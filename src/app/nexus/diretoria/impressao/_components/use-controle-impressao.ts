"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { api } from "~/trpc/react";
import { exportarModelo, lerPlanilhaImpressao } from "./planilha-impressao";
import { normalizar, sim, texto, type Formulario } from "./suporte";

export function useControleImpressao() {
	const utils = api.useUtils();
	const [semestreId, setSemestreId] = useState("");
	const {
		data: semestres,
		isLoading: carregandoSemestres,
		error: erroSemestres,
	} = api.diretoria.semestres.list.useQuery();
	const semestre =
		semestres?.find((item) => item.id === semestreId) ??
		semestres?.find((item) => item.ativo) ??
		semestres?.[0];
	const {
		data: semanas,
		isLoading,
		error: erroSemanas,
	} = api.diretoria.impressao.list.useQuery(
		{ semestreId: semestre?.id ?? "c0000000000000000000000000" },
		{ enabled: Boolean(semestre) },
	);
	const { data: responsaveis = [] } =
		api.diretoria.impressao.responsaveis.useQuery();
	const [formulario, setFormulario] = useState<Formulario | null>(null);
	const [mensagem, setMensagem] = useState<string | null>(null);
	const [busca, setBusca] = useState("");
	const [importando, setImportando] = useState(false);
	const inputImportacao = useRef<HTMLInputElement>(null);
	const salvar = api.diretoria.impressao.salvarApostila.useMutation({
		onSuccess: () => {
			setFormulario(null);
			setMensagem("Apostila salva.");
			void utils.diretoria.impressao.list.invalidate();
		},
		onError: (erro) => setMensagem(erro.message),
	});
	const salvarSemana = api.diretoria.impressao.salvarSemana.useMutation({
		onSuccess: () => utils.diretoria.impressao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});
	const salvarStatus = api.diretoria.impressao.salvarApostila.useMutation({
		onSuccess: () => utils.diretoria.impressao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});
	const remover = api.diretoria.impressao.removerApostila.useMutation({
		onSuccess: () => utils.diretoria.impressao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});

	const abrirEdicao = (
		semana: NonNullable<typeof semanas>[number],
		apostila: NonNullable<typeof semanas>[number]["apostilas"][number],
	) =>
		setFormulario({
			id: apostila.id,
			semana: semana.numero,
			dataAula: semana.dataAula
				? semana.dataAula.toISOString().slice(0, 10)
				: "",
			dataEntrega: apostila.dataEntrega
				? apostila.dataEntrega.toISOString().slice(0, 10)
				: "",
			aulaRealizada: semana.aulaRealizada,
			titulo: apostila.titulo,
			curso: apostila.curso,
			pronta: apostila.pronta,
			impressa: apostila.impressa,
			qtdImpressa: apostila.qtdImpressa,
			qtdAlvo: apostila.qtdAlvo,
			responsavelIds: apostila.responsaveis.map((item) => item.userId),
		});
	const enviar = () => {
		if (!semestre || !formulario) return;
		const { semana, ...dados } = formulario;
		salvar.mutate({
			...dados,
			semestreId: semestre.id,
			semanaNumero: semana,
			dataAula: formulario.dataAula
				? new Date(`${formulario.dataAula}T12:00:00`)
				: null,
			dataEntrega: formulario.dataEntrega
				? new Date(`${formulario.dataEntrega}T12:00:00`)
				: null,
		});
	};
	const alternarStatus = (
		semana: NonNullable<typeof semanas>[number],
		apostila: NonNullable<typeof semanas>[number]["apostilas"][number],
		campo: "pronta" | "impressa",
	) => {
		if (!semestre) return;
		salvarStatus.mutate({
			id: apostila.id,
			semestreId: semestre.id,
			semanaNumero: semana.numero,
			dataAula: semana.dataAula,
			dataEntrega: apostila.dataEntrega,
			aulaRealizada: semana.aulaRealizada,
			titulo: apostila.titulo,
			curso: apostila.curso,
			pronta: campo === "pronta" ? !apostila.pronta : apostila.pronta,
			impressa: campo === "impressa" ? !apostila.impressa : apostila.impressa,
			qtdImpressa: apostila.qtdImpressa,
			qtdAlvo: apostila.qtdAlvo,
			responsavelIds: apostila.responsaveis.map((item) => item.userId),
		});
	};
	const importar = async (evento: ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestre) return;
		setImportando(true);
		try {
			const linhas = await lerPlanilhaImpressao(arquivo);
			const existentes = new Map<string, string>(
				(semanas ?? []).flatMap((semana) =>
					semana.apostilas.map(
						(apostila) =>
							[
								`${semana.numero}:${apostila.titulo.toLocaleLowerCase()}:${apostila.curso.toLocaleLowerCase()}`,
								apostila.id,
							] as const,
					),
				),
			);
			let importadas = 0;
			for (const linha of linhas) {
				const semana = Number(linha["Semana"]);
				const titulo = texto(linha["Apostila"]);
				const curso = texto(linha["Curso"]);
				if (!Number.isInteger(semana) || semana < 1 || !titulo || !curso)
					continue;
				const nomes = texto(linha["Responsáveis"])
					.split(",")
					.map(normalizar)
					.filter(Boolean);
				const responsavelIds = (
					nomes.includes("todos")
						? responsaveis
						: responsaveis.filter((pessoa) =>
								nomes.includes(normalizar(pessoa.nome)),
							)
				).map((pessoa) => pessoa.id);
				const data =
					linha["Data da aula"] instanceof Date
						? (linha["Data da aula"] as Date)
						: texto(linha["Data da aula"])
							? new Date(`${texto(linha["Data da aula"])}T12:00:00`)
							: null;
				const dataEntrega =
					linha["Data de entrega"] instanceof Date
						? (linha["Data de entrega"] as Date)
						: texto(linha["Data de entrega"])
							? new Date(`${texto(linha["Data de entrega"])}T12:00:00`)
							: null;
				const chave = `${semana}:${titulo.toLocaleLowerCase()}:${curso.toLocaleLowerCase()}`;
				const resultado = await salvar.mutateAsync({
					id: existentes.get(chave),
					semestreId: semestre.id,
					semanaNumero: semana,
					dataAula: data && !Number.isNaN(data.getTime()) ? data : null,
					dataEntrega:
						dataEntrega && !Number.isNaN(dataEntrega.getTime())
							? dataEntrega
							: null,
					aulaRealizada: sim(linha["Aula realizada?"]),
					titulo,
					curso,
					pronta: sim(linha["Pronta?"]),
					impressa: sim(linha["Impressa?"]),
					qtdImpressa: Math.max(0, Number(linha["Quantidade impressa"]) || 0),
					qtdAlvo: Math.max(0, Number(linha["Quantidade alvo"]) || 0),
					responsavelIds,
				});
				existentes.set(chave, resultado.id);
				importadas += 1;
			}
			setMensagem(`${importadas} apostila(s) importada(s).`);
			void utils.diretoria.impressao.list.invalidate();
		} catch (erro) {
			setMensagem(
				erro instanceof Error
					? erro.message
					: "Não foi possível importar a planilha.",
			);
		} finally {
			setImportando(false);
		}
	};

	const ocupado =
		salvar.isPending ||
		salvarStatus.isPending ||
		importando ||
		remover.isPending;
	const filtro = normalizar(busca);
	const semanasVisiveis = (semanas ?? [])
		.map((semana) => ({
			...semana,
			apostilas: semana.apostilas.filter((apostila) =>
				normalizar(
					[
						apostila.titulo,
						apostila.curso,
						...apostila.responsaveis.map((r) => r.user.nome),
					].join(" "),
				).includes(filtro),
			),
		}))
		.filter((semana) => !filtro || semana.apostilas.length);
	const erroConsulta = erroSemestres ?? erroSemanas;
	return {
		inputImportacao,
		importar,
		ocupado,
		semestre,
		carregandoSemestres,
		setSemestreId,
		setFormulario,
		setMensagem,
		semestres,
		busca,
		setBusca,
		erroConsulta,
		importando,
		exportarModelo,
		semanas,
		mensagem,
		formulario,
		responsaveis,
		enviar,
		salvar,
		utils,
		isLoading,
		semanasVisiveis,
		salvarSemana,
		salvarStatus,
		alternarStatus,
		abrirEdicao,
		remover,
		filtro,
	};
}
