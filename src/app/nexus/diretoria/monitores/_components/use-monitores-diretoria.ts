"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { api } from "~/trpc/react";
import {
	downloadBase64Pdf,
	monitorVazio,
	normalizarCabecalho,
	normalizarMonitor,
	type Monitor,
} from "./suporte";

export function useMonitoresDiretoria() {
	const utils = api.useUtils();
	const { data: monitoresDb, isLoading: carregandoMonitores } =
		api.diretoria.usuarios.list.useQuery({ role: "MONITOR" });
	const criar = api.diretoria.usuarios.create.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const atualizar = api.diretoria.usuarios.update.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const remover = api.diretoria.usuarios.remove.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const importarMonitores = api.diretoria.usuarios.importMonitors.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const solicitarRedefinicao = api.conta.solicitarRedefinicao.useMutation({
		onSuccess: () => alert("Código de redefinição enviado por e-mail."),
		onError: (causa) => alert(causa.message),
	});
	const gerarDeclaracao = api.declaracao.gerarIndividual.useMutation({
		onSuccess: (data) =>
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || "Certificado_PM.pdf",
			),
		onError: (err) => alert(`Erro ao gerar certificado PM: ${err.message}`),
	});
	const [monitores, setMonitores] = useState<Monitor[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [rascunho, setRascunho] = useState<Monitor>(monitorVazio());
	const [modalLoteAberto, setModalLoteAberto] = useState(false);
	const inputImportacaoRef = useRef<HTMLInputElement>(null);
	const [resultadoImportacao, setResultadoImportacao] = useState<{
		tipo: "sucesso" | "erro";
		texto: string;
	} | null>(null);
	const gerarLoteDeclaracoes = api.declaracao.gerarLoteUsuarios.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(data.arquivoBase64, data.nomeArquivo);
			setModalLoteAberto(false);
		},
		onError: (err) =>
			alert(`Erro ao gerar o lote de certificados: ${err.message}`),
	});

	useEffect(() => {
		if (!monitoresDb) return;
		setMonitores(
			monitoresDb.map((m) => ({
				id: m.id,
				nome: m.nome,
				matricula: m.matricula,
				email: m.email,
				senha: "",
				turmas: m.turmasMonitor.map((v) => v.turma.titulo),
				turmasDetalhadas: m.turmasMonitor.map((v) => ({
					id: v.turma.id,
					titulo: v.turma.titulo,
					semestre: v.turma.semestre.codigo,
				})),
			})),
		);
	}, [monitoresDb]);

	const gerarLote = () => {
		if (!monitores.length) return;
		setModalLoteAberto(true);
	};

	const confirmarLote = (codigoProjeto: string) => {
		gerarLoteDeclaracoes.mutate({
			usuarioIds: monitores.map((monitor) => monitor.id),
			tipo: "monitor",
			codigoProjeto,
		});
	};

	const exportarMonitores = () => {
		if (!monitores.length) {
			setResultadoImportacao({
				tipo: "erro",
				texto: "Não há monitores para exportar.",
			});
			return;
		}
		const planilha = XLSX.utils.json_to_sheet(
			monitores.map(({ nome, email, matricula }) => ({
				Nome: nome,
				Email: email,
				Matrícula: matricula,
			})),
			{ header: ["Nome", "Email", "Matrícula"] },
		);
		planilha["!cols"] = [{ wch: 38 }, { wch: 38 }, { wch: 18 }];
		const arquivo = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(arquivo, planilha, "Monitores");
		XLSX.writeFile(arquivo, "Monitores.xlsx", { compression: true });
	};

	const importarArquivo = async (event: ChangeEvent<HTMLInputElement>) => {
		const arquivo = event.target.files?.[0];
		event.target.value = "";
		if (!arquivo) return;
		setResultadoImportacao(null);
		try {
			const livro = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				raw: false,
			});
			const nomeAba = livro.SheetNames[0];
			if (!nomeAba || !livro.Sheets[nomeAba])
				throw new Error("A planilha não possui uma aba acessível.");
			const linhas = XLSX.utils.sheet_to_json<unknown[]>(
				livro.Sheets[nomeAba],
				{ header: 1, defval: "", raw: false },
			);
			const cabecalhos = linhas[0]?.map(normalizarCabecalho) ?? [];
			const indiceNome = cabecalhos.indexOf("nome");
			const indiceEmail = cabecalhos.indexOf("email");
			const indiceMatricula = cabecalhos.indexOf("matricula");
			if (indiceNome < 0 || indiceEmail < 0 || indiceMatricula < 0)
				throw new Error(
					"Use os cabeçalhos Nome, Email e Matrícula da planilha-base.",
				);

			const vistos = new Set<string>();
			const registros = linhas.slice(1).flatMap((linha, indice) => {
				if (linha.every((valor) => !String(valor).trim())) return [];
				const nome = String(linha[indiceNome] ?? "").trim();
				const email = String(linha[indiceEmail] ?? "")
					.trim()
					.toLowerCase();
				const matricula = String(linha[indiceMatricula] ?? "").trim();
				const linhaPlanilha = indice + 2;
				if (!nome || !email || !matricula)
					throw new Error(
						`Linha ${linhaPlanilha}: Nome, Email e Matrícula são obrigatórios.`,
					);
				if (!/^\S+@\S+\.\S+$/.test(email))
					throw new Error(`Linha ${linhaPlanilha}: informe um e-mail válido.`);
				if (matricula.length < 3)
					throw new Error(
						`Linha ${linhaPlanilha}: a matrícula deve ter pelo menos 3 caracteres.`,
					);
				const chaveEmail = `email:${email}`;
				const chaveMatricula = `matricula:${matricula}`;
				if (vistos.has(chaveEmail) || vistos.has(chaveMatricula))
					throw new Error(
						`Linha ${linhaPlanilha}: e-mail ou matrícula duplicado na planilha.`,
					);
				vistos.add(chaveEmail);
				vistos.add(chaveMatricula);
				return [{ nome, email, matricula }];
			});
			if (!registros.length)
				throw new Error("A planilha não possui monitores para importar.");
			const resultado = await importarMonitores.mutateAsync({
				monitores: registros,
			});
			setResultadoImportacao({
				tipo: "sucesso",
				texto: `${resultado.total} monitor(es) importado(s). A senha inicial de cada conta é a matrícula.`,
			});
		} catch (erro) {
			setResultadoImportacao({
				tipo: "erro",
				texto:
					erro instanceof Error
						? erro.message
						: "Não foi possível importar a planilha.",
			});
		}
	};

	const abrirNovo = () => {
		setEditandoId(null);
		setRascunho(monitorVazio());
		setModo("form");
	};

	const abrirEdicao = (monitor: Monitor) => {
		setEditandoId(monitor.id);
		setRascunho(normalizarMonitor(monitor));
		setModo("form");
	};

	const cancelar = () => setModo("lista");

	const salvar = () => {
		if (
			!rascunho.nome.trim() ||
			!rascunho.matricula.trim() ||
			!rascunho.email.trim()
		)
			return;
		if (editandoId) {
			atualizar.mutate({
				id: editandoId,
				role: "MONITOR",
				nome: rascunho.nome,
				matricula: rascunho.matricula,
				email: rascunho.email,
			});
		} else {
			criar.mutate({
				role: "MONITOR",
				nome: rascunho.nome,
				matricula: rascunho.matricula,
				email: rascunho.email,
			});
		}
		setModo("lista");
	};

	const excluir = (id: string) => {
		if (
			confirm(
				"Excluir este monitor? O acesso dele será revogado imediatamente.",
			)
		) {
			remover.mutate({ id, role: "MONITOR" });
		}
	};

	const formValido =
		rascunho.nome.trim() && rascunho.matricula.trim() && rascunho.email.trim();
	return {
		modo,
		monitores,
		inputImportacaoRef,
		importarArquivo,
		importarMonitores,
		exportarMonitores,
		gerarLote,
		gerarLoteDeclaracoes,
		abrirNovo,
		resultadoImportacao,
		carregandoMonitores,
		abrirEdicao,
		excluir,
		solicitarRedefinicao,
		gerarDeclaracao,
		cancelar,
		editandoId,
		rascunho,
		setRascunho,
		salvar,
		formValido,
		modalLoteAberto,
		setModalLoteAberto,
		confirmarLote,
	};
}
