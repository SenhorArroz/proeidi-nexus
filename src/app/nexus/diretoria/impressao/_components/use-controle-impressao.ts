"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { api } from "~/trpc/react";
import { CABECALHOS, normalizar, sim, texto, type Formulario } from "./suporte";

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
	const exportarModelo = async () => {
		const XLSX = await import("xlsx");
		const planilha = XLSX.utils.json_to_sheet(
			[
				{
					Semana: 1,
					"Data da aula": "2026-09-11",
					"Data de entrega": "2026-09-08",
					Apostila: "Nome da apostila",
					Curso: "Nome do curso",
					Responsáveis: "Nome do diretor",
					"Pronta?": "NÃO",
					"Impressa?": "NÃO",
					"Quantidade impressa": 0,
					"Quantidade alvo": 0,
					"Aula realizada?": "NÃO",
				},
			],
			{ header: CABECALHOS },
		);
		planilha["!cols"] = CABECALHOS.map((cabecalho) => ({
			wch: Math.max(16, cabecalho.length + 4),
		}));
		const arquivo = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(arquivo, planilha, "Controle de impressão");
		XLSX.writeFile(arquivo, "Modelo_controle_de_impressao.xlsx", {
			compression: true,
		});
	};
	const importar = async (evento: ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestre) return;
		setImportando(true);
		try {
			const XLSX = await import("xlsx");
			const livro = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				cellDates: true,
			});
			const aba = livro.SheetNames[0];
			const planilha = aba ? livro.Sheets[aba] : undefined;
			if (!planilha) throw new Error("A planilha não possui uma aba de dados.");
			const matriz = XLSX.utils.sheet_to_json<unknown[]>(planilha, {
				header: 1,
				defval: "",
			});
			const metasPorCurso = new Map<string, number>();
			const abaDados = livro.SheetNames.find(
				(nome) => normalizar(nome) === "dados",
			);
			if (abaDados && livro.Sheets[abaDados]) {
				for (const linha of XLSX.utils.sheet_to_json<unknown[]>(
					livro.Sheets[abaDados],
					{ header: 1, defval: "" },
				)) {
					if (texto(linha[0]))
						metasPorCurso.set(
							normalizar(linha[0]),
							Math.max(0, Number(linha[1]) || 0),
						);
				}
			}
			const linhas: Array<Record<string, unknown>> = [];
			const ehModeloPadrao = normalizar(matriz[0]?.[0]) === "semana";
			if (ehModeloPadrao) {
				const cabecalhos =
					matriz[0]?.map((cabecalho) => texto(cabecalho)) ?? [];
				for (const valores of matriz.slice(1))
					linhas.push(
						Object.fromEntries(
							cabecalhos.map((cabecalho, indice) => [
								cabecalho,
								valores[indice] ?? "",
							]),
						),
					);
			} else {
				let semanaAtual = 0;
				for (const valores of matriz) {
					const cabecalhoAula = texto(valores[0]).match(/^aula\s+(\d+)$/i);
					if (cabecalhoAula) {
						semanaAtual = Number(cabecalhoAula[1]);
						continue;
					}
					const titulo = texto(valores[0]);
					const curso = texto(valores[1]);
					if (
						!semanaAtual ||
						!titulo ||
						!curso ||
						normalizar(titulo) === "apostila"
					)
						continue;
					linhas.push({
						Semana: semanaAtual,
						"Data de entrega": valores[3],
						Apostila: titulo,
						Curso: curso,
						Responsáveis: valores[2],
						"Pronta?": valores[4],
						"Impressa?": valores[5],
						"Quantidade impressa": valores[6],
						"Quantidade alvo": metasPorCurso.get(normalizar(curso)) ?? 0,
						"Aula realizada?": valores[8],
					});
				}
			}
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
