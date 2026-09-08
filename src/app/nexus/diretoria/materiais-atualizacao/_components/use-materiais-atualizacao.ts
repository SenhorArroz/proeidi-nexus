"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { api } from "~/trpc/react";
import { CABECALHOS, sim, texto, type Formulario } from "./suporte";

export function useMateriaisAtualizacao() {
	const utils = api.useUtils();
	const [semestreId, setSemestreId] = useState("");
	const [formulario, setFormulario] = useState<Formulario | null>(null);
	const [mensagem, setMensagem] = useState<string | null>(null);
	const input = useRef<HTMLInputElement>(null);
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
		data: materiais,
		isLoading,
		error: erroMateriais,
	} = api.diretoria.materialAtualizacao.list.useQuery(
		{ semestreId: semestre?.id ?? "c0000000000000000000000000" },
		{ enabled: Boolean(semestre) },
	);
	const { data: responsaveis = [] } =
		api.diretoria.materialAtualizacao.responsaveis.useQuery();
	const salvar = api.diretoria.materialAtualizacao.salvar.useMutation({
		onSuccess: () => {
			setFormulario(null);
			setMensagem("Material salvo.");
			void utils.diretoria.materialAtualizacao.list.invalidate();
		},
		onError: (erro) => setMensagem(erro.message),
	});
	const remover = api.diretoria.materialAtualizacao.remover.useMutation({
		onSuccess: () => void utils.diretoria.materialAtualizacao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});
	const editar = (item: NonNullable<typeof materiais>[number]) =>
		setFormulario({
			id: item.id,
			curso: item.curso,
			titulo: item.titulo,
			dataEntrega: item.dataEntrega
				? item.dataEntrega.toISOString().slice(0, 10)
				: "",
			revisado: item.revisado,
			precisaAjuste: item.precisaAjuste,
			ajustado: item.ajustado,
			responsavelIds: item.responsaveis.map((r) => r.userId),
		});
	const enviar = () => {
		if (!formulario || !semestre) return;
		salvar.mutate({
			...formulario,
			semestreId: semestre.id,
			dataEntrega: formulario.dataEntrega
				? new Date(`${formulario.dataEntrega}T12:00:00`)
				: null,
		});
	};
	const modelo = async () => {
		const XLSX = await import("xlsx");
		const ws = XLSX.utils.json_to_sheet(
			[
				{
					Curso: "Nome do curso",
					Material: "Nome do material",
					Responsável: "Nome do diretor",
					"Data de entrega": "2026-02-13",
					Revisado: "NÃO",
					"Precisa de ajuste": "NÃO",
					Ajustado: "NÃO",
				},
			],
			{ header: CABECALHOS },
		);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Atualização de materiais");
		XLSX.writeFile(wb, "Modelo_atualizacao_materiais.xlsx");
	};
	const importar = async (evento: ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestre) return;
		try {
			const XLSX = await import("xlsx");
			const wb = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				cellDates: true,
			});
			const ws = wb.Sheets[wb.SheetNames[0] ?? ""];
			if (!ws) throw new Error("Planilha sem dados.");
			const matriz = XLSX.utils.sheet_to_json<unknown[]>(ws, {
				header: 1,
				defval: "",
			});
			const cabecalhos =
				matriz[0]?.map((cabecalho) =>
					texto(cabecalho)
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.toLowerCase(),
				) ?? [];
			const valor = (linha: unknown[], nome: string) =>
				linha[cabecalhos.indexOf(nome)] ?? "";
			let total = 0;
			for (const linha of matriz.slice(1)) {
				const curso = texto(valor(linha, "curso"));
				const titulo = texto(valor(linha, "material"));
				if (!curso || !titulo) continue;
				const nomes = texto(valor(linha, "responsavel"))
					.split(",")
					.map((n) => n.trim().toLowerCase());
				const entrega = valor(linha, "data de entrega");
				const data =
					entrega instanceof Date
						? entrega
						: texto(entrega)
							? new Date(`${texto(entrega)}T12:00:00`)
							: null;
				await salvar.mutateAsync({
					semestreId: semestre.id,
					curso,
					titulo,
					dataEntrega: data && !Number.isNaN(data.getTime()) ? data : null,
					revisado: sim(valor(linha, "revisado")),
					precisaAjuste: sim(valor(linha, "precisa de ajuste")),
					ajustado: sim(valor(linha, "ajustado")),
					responsavelIds: responsaveis
						.filter((p) => nomes.includes(p.nome.toLowerCase()))
						.map((p) => p.id),
				});
				total++;
			}
			setMensagem(`${total} material(is) importado(s).`);
			void utils.diretoria.materialAtualizacao.list.invalidate();
		} catch (erro) {
			setMensagem(
				erro instanceof Error ? erro.message : "Não foi possível importar.",
			);
		}
	};
	return {
		input,
		importar,
		modelo,
		semestre,
		setSemestreId,
		setFormulario,
		setMensagem,
		semestres,
		mensagem,
		formulario,
		responsaveis,
		enviar,
		salvar,
		erroMateriais,
		erroSemestres,
		utils,
		isLoading,
		carregandoSemestres,
		materiais,
		editar,
		remover,
	};
}
