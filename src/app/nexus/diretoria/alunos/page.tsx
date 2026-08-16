"use client";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
	UserPlus,
	Search,
	Pencil,
	Trash2,
	X,
	User,
	Users,
	GraduationCap,
	Smartphone,
	Monitor,
	Briefcase,
	HeartPulse,
	Wifi,
	School,
	BookOpen,
	Upload,
	Download,
	FileSpreadsheet,
	Award,
	Loader2,
} from "lucide-react";
import { api } from "~/trpc/react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { normalizarBusca } from "~/lib/texto";

function downloadBase64Pdf(base64Data: string, filename: string) {
	const byteCharacters = atob(base64Data);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type SimNao = "Sim" | "Não" | "";

function formatarCpf(valor: string) {
	const digitos = valor.replace(/\D/g, "").slice(0, 11);
	if (digitos.length <= 3) return digitos;
	if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
	if (digitos.length <= 9) return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
	return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

interface Aluno {
	id: string;
	semestre: string;
	turma: string;

	// Geral
	nome: string;
	dataNascimento: string;
	cpf: string;
	corRaca: string;
	identidadeGenero: string;
	lgbtqiapn: string;
	telefone: string;
	contatoEmergencia: string;
	email: string;
	escolaridade: string;
	cuidaTerceiros: SimNao;

	// Condicionais Trabalho/Estudo
	trabalha: SimNao;
	trabalhoLocal?: string;
	trabalhoFuncao?: string;
	estuda: SimNao;
	estudoLocal?: string;
	estudoCurso?: string;

	// Saúde
	problemaSaude: SimNao;
	problemaSaudeQual?: string;
	necessidadeEspecial: SimNao;
	necessidadeEspecialQual?: string;

	// Infraestrutura
	acessoInternet: SimNao;
	temComputador: SimNao;
	temSmartphone: SimNao;
	sistemaSmartphone?: string;
}

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------
export default function GerenciarAlunos() {
	const utils = api.useUtils();
	const [semestreFiltro, setSemestreFiltro] = useState<string>("2026.1");
	const [busca, setBusca] = useState("");
	const { data: semestresDb, isLoading: carregandoSemestres } = api.diretoria.semestres.list.useQuery();
	const semestreSelecionado = semestresDb?.find((s) => s.codigo === semestreFiltro) ?? semestresDb?.find((s) => s.ativo) ?? semestresDb?.[0];
	const { data: alunosDb, isLoading: carregandoAlunos } = api.aluno.list.useQuery({ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" }, { enabled: Boolean(semestreSelecionado) });
	const { data: turmasDb, isLoading: carregandoTurmas } = api.diretoria.turmas.list.useQuery(semestreSelecionado ? { semestreId: semestreSelecionado.id } : undefined, { enabled: Boolean(semestreSelecionado) });
	const criarAluno = api.aluno.create.useMutation({ onSuccess: () => utils.aluno.list.invalidate() });
	const atualizarAluno = api.aluno.update.useMutation({ onSuccess: () => utils.aluno.list.invalidate() });
	const removerAluno = api.aluno.remove.useMutation({ onSuccess: () => utils.aluno.list.invalidate() });
	const importarAlunos = api.aluno.import.useMutation({ onSuccess: () => utils.aluno.list.invalidate() });
	const [alunos, setAlunos] = useState<Aluno[]>([]);

	// Controle de Geração de Certificados
	const [gerandoAlunoId, setGerandoAlunoId] = useState<string | null>(null);

	const gerarIndividualMutation = api.certificado.gerarIndividual.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || "Certificado.pdf",
			);
			setGerandoAlunoId(null);
		},
		onError: (err) => {
			alert(`Erro ao gerar certificado: ${err.message}`);
			setGerandoAlunoId(null);
		},
	});

	const gerarLoteMutation = api.certificado.gerarLote.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || `Certificados_${semestreFiltro}.pdf`,
			);
		},
		onError: (err) => {
			alert(`Erro ao gerar certificados em lote: ${err.message}`);
		},
	});

	// Controle do Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [alunoEditando, setAlunoEditando] = useState<Aluno | null>(null);

	// Estado do formulário inicial
	const stateInicial: Aluno = {
		id: "",
		semestre: "2026.1",
		turma: "",
		nome: "",
		dataNascimento: "",
		cpf: "",
		corRaca: "",
		identidadeGenero: "",
		lgbtqiapn: "",
		telefone: "",
		contatoEmergencia: "",
		email: "",
		escolaridade: "",
		cuidaTerceiros: "",
		trabalha: "",
		estuda: "",
		problemaSaude: "",
		necessidadeEspecial: "",
		acessoInternet: "",
		temComputador: "",
		temSmartphone: "",
		sistemaSmartphone: "",
	};

	const [form, setForm] = useState<Aluno>(stateInicial);

	useEffect(() => {
		if (!alunosDb || !semestreSelecionado) return;
		setAlunos(alunosDb.map((a) => ({ id: a.id, semestre: semestreSelecionado.codigo, turma: a.turmas.map((v) => v.turma.titulo).join(", "), nome: a.nome, dataNascimento: a.dataNascimento.toISOString().slice(0, 10), cpf: formatarCpf(a.cpf), corRaca: a.corRaca, identidadeGenero: a.identidadeGenero, lgbtqiapn: a.lgbtqiapn, telefone: a.telefone ?? "", contatoEmergencia: a.contatoEmergencia ?? "", email: a.email ?? "", escolaridade: a.escolaridade, cuidaTerceiros: a.cuidaTerceiros ? "Sim" : "Não", trabalha: a.trabalha ? "Sim" : "Não", trabalhoLocal: a.trabalhoLocal ?? "", trabalhoFuncao: a.trabalhoFuncao ?? "", estuda: a.estuda ? "Sim" : "Não", estudoLocal: a.estudoLocal ?? "", estudoCurso: a.estudoCurso ?? "", problemaSaude: a.problemaSaude ? "Sim" : "Não", problemaSaudeQual: a.problemaSaudeQual ?? "", necessidadeEspecial: a.necessidadeEspecial ? "Sim" : "Não", necessidadeEspecialQual: a.necessidadeEspecialQual ?? "", acessoInternet: a.acessoInternet ? "Sim" : "Não", temComputador: a.temComputador ? "Sim" : "Não", temSmartphone: a.temSmartphone ? "Sim" : "Não", sistemaSmartphone: a.sistemaSmartphone ?? "" })));
	}, [alunosDb, semestreSelecionado]);

	useEffect(() => {
		if (semestreSelecionado && !semestresDb?.some((semestre) => semestre.codigo === semestreFiltro)) setSemestreFiltro(semestreSelecionado.codigo);
	}, [semestreFiltro, semestreSelecionado, semestresDb]);

	// Importação e Exportação
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const processImportedData = (lines: any[][]) => {
		if (lines.length < 2) {
			alert(
				"Dados inválidos. Certifique-se de que a planilha possui cabeçalho e pelo menos uma linha de dados.",
			);
			return;
		}

		const firstLine = lines[0] ?? [];
		const headers = firstLine.map((h) => String(h).trim().toLowerCase());

		// Mapeamento esperado baseado nas colunas do Forms
		const colMap: Record<string, keyof Aluno | "ignorar"> = {
			"carimbo de data/hora": "ignorar",
			"nome - completo e sem abreviações": "nome",
			turma: "turma",
			"data de nascimento": "dataNascimento",
			cpf: "cpf",
			"qual é sua cor ou raça?": "corRaca",
			"qual sua identidade de gênero?": "identidadeGenero",
			"você se identifica como uma pessoa lgbtqiapn+?": "lgbtqiapn",
			telefone: "telefone",
			"contato de emergência": "contatoEmergencia",
			"e-mail": "email",
			"responsável pelo cuidado de terceiros?": "cuidaTerceiros",
			escolaridade: "escolaridade",
			"você trabalha atualmente?": "trabalha",
			"se sim na questão anterior: onde trabalha e qual a função?":
				"trabalhoLocal",
			"você estuda atualmente?": "estuda",
			"se sim na questão anterior: onde estuda e qual o curso?": "estudoLocal",
			"possui algum problema de saúde": "problemaSaude",
			"qual?": "problemaSaudeQual",
			"você tem alguma necessidade especial?": "necessidadeEspecial",
			"qual é a sua necessidade especial?": "necessidadeEspecialQual",
			"você tem acesso à internet?": "acessoInternet",
			"você tem computador ou notebook?": "temComputador",
			"você tem smartphone?": "temSmartphone",
			"informe o sistema operacional do seu smartphone": "sistemaSmartphone",
		};

		const newAlunos: Aluno[] = [];

		for (let i = 1; i < lines.length; i++) {
			const row = lines[i];
			if (!row || row.length === 0 || row.every((cell) => !cell)) continue; // Pular linhas vazias

			const novoAluno: Partial<Aluno> = {
				id: (Date.now() + i).toString(),
				semestre: semestreFiltro,
				turma: "",
			};

			headers.forEach((header, index) => {
				const targetField = colMap[header];
				if (targetField && targetField !== "ignorar") {
					const rawVal = row[index];
					let val = rawVal instanceof Date
						? rawVal.toISOString().slice(0, 10)
						: rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : "";

					// Tratamento simples para Sim/Não
					if (
						[
							"cuidaTerceiros",
							"trabalha",
							"estuda",
							"problemaSaude",
							"necessidadeEspecial",
							"acessoInternet",
							"temComputador",
							"temSmartphone",
						].includes(targetField)
					) {
						val = val.toLowerCase().startsWith("s") ? "Sim" : "Não";
					}

					// Formatar dataNascimento de DD/MM/YYYY para YYYY-MM-DD
					if (targetField === "dataNascimento" && val.includes("/")) {
						const parts = val.split("/");
						if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
							val = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
						}
					}
					if (targetField === "dataNascimento" && val.includes("T")) val = val.split("T")[0] ?? "";

					(novoAluno as any)[targetField] = val;
				}
			});

			// Só adiciona se tiver pelo menos o nome preenchido
			if (novoAluno.nome) {
				newAlunos.push(novoAluno as Aluno);
			}
		}

		if (!semestreSelecionado) {
			alert("Nenhum semestre disponível para receber a importação.");
			return;
		}

		const turmasPorTitulo = new Map((turmasDb ?? []).map((turma) => [turma.titulo.trim().toLowerCase(), turma.id]));
		const obrigatorios: { campo: keyof Aluno; nome: string }[] = [
			{ campo: "nome", nome: "Nome" }, { campo: "dataNascimento", nome: "Data de nascimento" }, { campo: "cpf", nome: "CPF" }, { campo: "corRaca", nome: "Cor ou raça" }, { campo: "identidadeGenero", nome: "Identidade de gênero" }, { campo: "lgbtqiapn", nome: "LGBTQIAPN+" }, { campo: "escolaridade", nome: "Escolaridade" }, { campo: "cuidaTerceiros", nome: "Cuida de terceiros" }, { campo: "trabalha", nome: "Trabalha" }, { campo: "estuda", nome: "Estuda" }, { campo: "problemaSaude", nome: "Problema de saúde" }, { campo: "necessidadeEspecial", nome: "Necessidade especial" }, { campo: "acessoInternet", nome: "Acesso à internet" }, { campo: "temComputador", nome: "Computador" }, { campo: "temSmartphone", nome: "Smartphone" },
		];
		const exigeTurmaCadastrada = (turmasDb?.length ?? 0) > 0;
		const erroLinha = newAlunos.map((aluno, index) => {
			const ausentes = obrigatorios.filter(({ campo }) => !String(aluno[campo] ?? "").trim()).map(({ nome }) => nome);
			const turmaInvalida = exigeTurmaCadastrada && !turmasPorTitulo.has(aluno.turma.trim().toLowerCase());
			return ausentes.length || turmaInvalida ? { index, ausentes, turmaInvalida, turma: aluno.turma } : null;
		}).find(Boolean);
		if (erroLinha) {
			const detalhes = [erroLinha.ausentes.length ? `campos ausentes: ${erroLinha.ausentes.join(", ")}` : "", erroLinha.turmaInvalida ? `turma não cadastrada: ${erroLinha.turma || "(vazia)"}` : ""].filter(Boolean).join("; ");
			alert(`Linha ${erroLinha.index + 2}: ${detalhes}.`);
			return;
		}

		importarAlunos.mutate({
			semestreId: semestreSelecionado.id,
			alunos: newAlunos.map((aluno) => ({
				nome: aluno.nome.trim(), dataNascimento: new Date(`${aluno.dataNascimento}T12:00:00`), cpf: aluno.cpf.replace(/\D/g, ""), corRaca: aluno.corRaca.trim(), identidadeGenero: aluno.identidadeGenero.trim(), lgbtqiapn: aluno.lgbtqiapn.trim(), telefone: aluno.telefone?.trim() || null, contatoEmergencia: aluno.contatoEmergencia?.trim() || null, email: aluno.email?.trim() || null, escolaridade: aluno.escolaridade.trim(),
				cuidaTerceiros: aluno.cuidaTerceiros === "Sim", trabalha: aluno.trabalha === "Sim", trabalhoLocal: aluno.trabalhoLocal || null, trabalhoFuncao: aluno.trabalhoFuncao || null, estuda: aluno.estuda === "Sim", estudoLocal: aluno.estudoLocal || null, estudoCurso: aluno.estudoCurso || null, problemaSaude: aluno.problemaSaude === "Sim", problemaSaudeQual: aluno.problemaSaudeQual || null, necessidadeEspecial: aluno.necessidadeEspecial === "Sim", necessidadeEspecialQual: aluno.necessidadeEspecialQual || null, acessoInternet: aluno.acessoInternet === "Sim", temComputador: aluno.temComputador === "Sim", temSmartphone: aluno.temSmartphone === "Sim", sistemaSmartphone: aluno.sistemaSmartphone || null,
				turmaIds: exigeTurmaCadastrada ? [turmasPorTitulo.get(aluno.turma.trim().toLowerCase())!] : [],
			})),
		}, {
			onSuccess: (result) => { setIsImportModalOpen(false); alert(`${result.total} aluno(s) importado(s) para o banco com sucesso.${exigeTurmaCadastrada ? "" : " Como não há turmas cadastradas neste semestre, os alunos foram importados sem vínculo de turma."}`); },
			onError: (error) => alert(`A importação não foi salva: ${error.message}`),
		});
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (evt) => {
			try {
				const bstr = evt.target?.result;
				const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
				const wsname = wb.SheetNames[0];
				if (!wsname) {
					alert("A planilha selecionada está vazia.");
					return;
				}
				const ws = wb.Sheets[wsname];
				if (!ws) {
					alert("A aba da planilha está inacessível.");
					return;
				}

				// Converte a aba da planilha para um array de arrays
				const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

				processImportedData(data);
			} catch (err) {
				console.error(err);
				alert("Erro ao ler o arquivo Excel. Verifique se o formato é válido.");
			}
		};
		reader.readAsBinaryString(file);

		// Limpar o input para permitir enviar o mesmo arquivo novamente se necessário
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleExport = () => {
		if (alunosFiltrados.length === 0) {
			alert("Nenhum aluno encontrado para exportar neste semestre.");
			return;
		}

		// Ordem dos campos conforme pedidos no formulário, com cabeçalhos legíveis
		const colunasOrdenadas: { chave: keyof Aluno; cabecalho: string }[] = [
			// Turma e Semestre
			{ chave: "semestre", cabecalho: "Semestre Letivo" },
			{ chave: "turma", cabecalho: "Turma" },
			// Dados Gerais
			{ chave: "nome", cabecalho: "Nome - completo e sem abreviações" },
			{ chave: "dataNascimento", cabecalho: "Data de nascimento" },
			{ chave: "cpf", cabecalho: "CPF" },
			{ chave: "corRaca", cabecalho: "Qual é sua cor ou raça?" },
			{
				chave: "identidadeGenero",
				cabecalho: "Qual sua identidade de gênero?",
			},
			{
				chave: "lgbtqiapn",
				cabecalho: "Você se identifica como uma pessoa LGBTQIAPN+?",
			},
			{ chave: "telefone", cabecalho: "Telefone" },
			{ chave: "contatoEmergencia", cabecalho: "Contato de emergência" },
			{ chave: "email", cabecalho: "E-mail" },
			{
				chave: "cuidaTerceiros",
				cabecalho: "Responsável pelo cuidado de terceiros?",
			},
			// Ocupação e Escolaridade
			{ chave: "escolaridade", cabecalho: "Escolaridade" },
			{ chave: "trabalha", cabecalho: "Você trabalha atualmente?" },
			{
				chave: "trabalhoLocal",
				cabecalho: "Se sim na questão anterior: onde trabalha e qual a função?",
			},
			{ chave: "estuda", cabecalho: "Você estuda atualmente?" },
			{
				chave: "estudoLocal",
				cabecalho: "Se sim na questão anterior: onde estuda e qual o curso?",
			},
			// Saúde
			{ chave: "problemaSaude", cabecalho: "Possui algum problema de saúde" },
			{ chave: "problemaSaudeQual", cabecalho: "Qual?" },
			{
				chave: "necessidadeEspecial",
				cabecalho: "Você tem alguma necessidade especial?",
			},
			{
				chave: "necessidadeEspecialQual",
				cabecalho: "Qual é a sua necessidade especial?",
			},
			// Infraestrutura
			{ chave: "acessoInternet", cabecalho: "Você tem acesso à internet?" },
			{ chave: "temComputador", cabecalho: "Você tem computador ou notebook?" },
			{ chave: "temSmartphone", cabecalho: "Você tem smartphone?" },
			{
				chave: "sistemaSmartphone",
				cabecalho: "Informe o sistema operacional do seu smartphone",
			},
		];

		// Montar array de objetos com cabeçalhos legíveis na ordem correta
		const dadosFormatados = alunosFiltrados.map((aluno) => {
			const linha: Record<string, string> = {};
			colunasOrdenadas.forEach(({ chave, cabecalho }) => {
				linha[cabecalho] = (aluno as any)[chave] ?? "";
			});
			return linha;
		});

		// Criar planilha com os cabeçalhos na ordem definida
		const cabecalhos = colunasOrdenadas.map((c) => c.cabecalho);
		const worksheet = XLSX.utils.json_to_sheet(dadosFormatados, {
			header: cabecalhos,
		});
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");

		XLSX.writeFile(workbook, `Alunos_${semestreFiltro}.xlsx`);
	};

	// Ações de Certificado
	const handleGerarLoteCertificados = () => {
		if (!semestreSelecionado || alunosFiltrados.length === 0) {
			alert("Nenhum aluno encontrado para gerar certificados neste semestre.");
			return;
		}

		gerarLoteMutation.mutate({
			semestreId: semestreSelecionado.id,
			alunoIds: alunosFiltrados.map((aluno) => aluno.id),
		});
	};

	const handleGerarCertificadoIndividual = (aluno: Aluno) => {
		setGerandoAlunoId(aluno.id);
		gerarIndividualMutation.mutate({
			alunoId: aluno.id,
			nome: aluno.nome,
			curso: aluno.turma,
			periodo: aluno.semestre,
		});
	};

	// Filtros
	const buscaNormalizada = normalizarBusca(busca);
	const cpfBuscado = busca.replace(/\D/g, "");
	const alunosFiltrados = alunos.filter((aluno) => aluno.semestre === semestreFiltro && (!buscaNormalizada || normalizarBusca(aluno.nome).includes(buscaNormalizada) || (cpfBuscado.length > 0 && aluno.cpf.replace(/\D/g, "").includes(cpfBuscado))));

	// Ações CRUD
	const abrirModalNovo = () => {
		setForm({ ...stateInicial, semestre: semestreFiltro });
		setAlunoEditando(null);
		setIsModalOpen(true);
	};

	const abrirModalEdicao = (aluno: Aluno) => {
		setForm({ ...aluno });
		setAlunoEditando(aluno);
		setIsModalOpen(true);
	};

	const excluirAluno = (id: string) => {
		if (confirm("Tem certeza que deseja remover este aluno?")) {
			if (semestreSelecionado) removerAluno.mutate({ id, semestreId: semestreSelecionado.id });
		}
	};

	const salvarAluno = (e: React.FormEvent) => {
		e.preventDefault();

		// Limpeza de campos condicionais caso o usuário tenha mudado para "Não" depois de preencher
		const formProcessado = { ...form };
		if (formProcessado.trabalha !== "Sim") {
			delete formProcessado.trabalhoLocal;
			delete formProcessado.trabalhoFuncao;
		}
		if (formProcessado.estuda !== "Sim") {
			delete formProcessado.estudoLocal;
			delete formProcessado.estudoCurso;
		}
		if (formProcessado.problemaSaude !== "Sim")
			delete formProcessado.problemaSaudeQual;
		if (formProcessado.necessidadeEspecial !== "Sim")
			delete formProcessado.necessidadeEspecialQual;

		if (!semestreSelecionado) return;
		const turmaIds = formProcessado.turma ? (turmasDb?.filter((t) => t.titulo === formProcessado.turma).map((t) => t.id) ?? []) : [];
		const payload = { semestreId: semestreSelecionado.id, nome: formProcessado.nome, dataNascimento: new Date(`${formProcessado.dataNascimento}T12:00:00`), cpf: formProcessado.cpf.replace(/\D/g, ""), corRaca: formProcessado.corRaca, identidadeGenero: formProcessado.identidadeGenero, lgbtqiapn: formProcessado.lgbtqiapn, telefone: formProcessado.telefone?.trim() || null, contatoEmergencia: formProcessado.contatoEmergencia?.trim() || null, email: formProcessado.email?.trim() || null, escolaridade: formProcessado.escolaridade, cuidaTerceiros: formProcessado.cuidaTerceiros === "Sim", trabalha: formProcessado.trabalha === "Sim", trabalhoLocal: formProcessado.trabalhoLocal || null, trabalhoFuncao: formProcessado.trabalhoFuncao || null, estuda: formProcessado.estuda === "Sim", estudoLocal: formProcessado.estudoLocal || null, estudoCurso: formProcessado.estudoCurso || null, problemaSaude: formProcessado.problemaSaude === "Sim", problemaSaudeQual: formProcessado.problemaSaudeQual || null, necessidadeEspecial: formProcessado.necessidadeEspecial === "Sim", necessidadeEspecialQual: formProcessado.necessidadeEspecialQual || null, acessoInternet: formProcessado.acessoInternet === "Sim", temComputador: formProcessado.temComputador === "Sim", temSmartphone: formProcessado.temSmartphone === "Sim", sistemaSmartphone: formProcessado.sistemaSmartphone || null, turmaIds };
		const options = {
			onSuccess: () => setIsModalOpen(false),
			onError: (error: { message: string }) => alert(`Não foi possível salvar o aluno: ${error.message}`),
		};
		if (alunoEditando) atualizarAluno.mutate({ ...payload, id: alunoEditando.id }, options); else criarAluno.mutate(payload, options);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8 pb-32">
			<div className="max-w-7xl w-full mx-auto space-y-6">
				<DiretoriaBackLink />
				<DiretoriaPageIntro icon={GraduationCap} title="Gerenciar alunos" description="Cadastro completo, perfil demográfico e emissão de certificados." />

				{/* Seleção única de contexto: toda leitura, importação e exportação usa este semestre. */}
				<div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 sm:flex sm:items-end sm:justify-between sm:gap-5">
					<div className="mb-3 sm:mb-0">
						<p className="text-sm font-semibold text-sky-900">Semestre de trabalho</p>
						<p className="mt-1 text-sm text-sky-700">A lista, os novos cadastros, a importação e a exportação usam o semestre selecionado.</p>
					</div>
					<label className="block min-w-52">
						<span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-sky-800">Selecionar semestre</span>
						<select
							value={semestreFiltro}
							onChange={(e) => { setBusca(""); setSemestreFiltro(e.target.value); }}
							disabled={!semestresDb?.length}
							className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed"
						>
							{!semestresDb?.length && <option>Carregando semestres...</option>}
							{semestresDb?.map((semestre) => <option key={semestre.id} value={semestre.codigo}>{semestre.codigo}{semestre.ativo ? " — ativo" : ""}</option>)}
						</select>
					</label>
				</div>

				{/* Controles de Filtro e Busca */}
				<div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3 w-full lg:w-auto flex-1 lg:justify-end">
						<div className="flex items-center gap-3 w-full lg:max-w-md bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all">
							<Search className="w-4 h-4 text-gray-400 shrink-0" />
							<input
								type="text"
								placeholder="Buscar aluno por nome ou CPF..."
								value={busca}
								onChange={(e) => setBusca(e.target.value)}
								className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder:text-gray-400"
							/>
						</div>
						<div className="flex items-center gap-2 flex-wrap">
							<button
								onClick={handleGerarLoteCertificados}
								disabled={gerarLoteMutation.isPending}
								className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all shrink-0 disabled:opacity-50"
								title="Gerar certificados em lote (PDF único) para todos os alunos deste semestre"
							>
								{gerarLoteMutation.isPending ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Award className="w-4 h-4" />
								)}
								<span className="hidden sm:inline">
									{gerarLoteMutation.isPending ? "Gerando..." : "Certificados"}
								</span>
							</button>
							<button
								onClick={() => setIsImportModalOpen(true)}
								disabled={!semestreSelecionado}
								className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all shrink-0"
							>
								<Upload className="w-4 h-4" />
								<span className="hidden sm:inline">Importar</span>
							</button>
							<button
								onClick={handleExport}
								disabled={!semestreSelecionado}
								className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all shrink-0"
							>
								<Download className="w-4 h-4" />
								<span className="hidden sm:inline">Exportar</span>
							</button>
							<button
								onClick={abrirModalNovo}
								disabled={!semestreSelecionado}
								className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 shadow-sm transition-all shrink-0"
							>
								<UserPlus className="w-4 h-4" />
								<span className="hidden sm:inline">Novo Aluno</span>
							</button>
						</div>
					</div>
				</div>

				{/* Lista de Alunos (Grid) */}
				<div className="grid grid-cols-1 overflow-auto md:grid-cols-2 xl:grid-cols-3 gap-5">
					{carregandoSemestres || carregandoAlunos || carregandoTurmas ? <DataSkeleton cards={6} className="col-span-full" /> : alunosFiltrados.length === 0 ? (
						<div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed border-gray-300 rounded-2xl">
							<Users className="w-12 h-12 mb-3 opacity-20" />
							<p className="text-lg font-medium">
								Nenhum aluno encontrado neste semestre.
							</p>
						</div>
					) : (
						alunosFiltrados.map((aluno) => (
							<div
								key={aluno.id}
								className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.13)]"
							>
								<div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
									<button
										onClick={() => handleGerarCertificadoIndividual(aluno)}
										disabled={gerandoAlunoId === aluno.id}
										className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
										title="Gerar certificado PDF deste aluno"
									>
										{gerandoAlunoId === aluno.id ? (
											<Loader2 className="w-4 h-4 animate-spin text-amber-600" />
										) : (
											<Award className="w-4 h-4" />
										)}
									</button>
									<button
										onClick={() => abrirModalEdicao(aluno)}
										className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg"
									>
										<Pencil className="w-4 h-4" />
									</button>
									<button
										onClick={() => excluirAluno(aluno.id)}
										className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>

								<div className="absolute left-0 top-0 h-1.5 w-24 rounded-br-full bg-sky-500" />
								<h3 className="mb-1 pr-24 text-lg font-extrabold text-slate-900 truncate">
									{aluno.nome}
								</h3>
								<p className="mb-4 inline-block rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800">
									{aluno.turma}
								</p>

								<div className="space-y-2 text-sm text-gray-600">
									<p className="flex items-center gap-2">
										<User className="w-4 h-4 text-gray-400" /> {aluno.cpf}
									</p>
									<p className="flex items-center gap-2">
										<Smartphone className="w-4 h-4 text-gray-400" />{" "}
										{aluno.telefone}
									</p>
									<p className="flex items-center gap-2">
										<BookOpen className="w-4 h-4 text-gray-400" />{" "}
										{aluno.escolaridade}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* ---------------------------------------------------------------------------
                MODAL GIGANTE COM CAMPOS CONDICIONAIS
            --------------------------------------------------------------------------- */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
					<div
						className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
						onClick={() => setIsModalOpen(false)}
					/>

					<div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
						<div className="flex items-center justify-between p-6 border-b border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
								{alunoEditando ? (
									<Pencil className="w-5 h-5 text-sky-600" />
								) : (
									<UserPlus className="w-5 h-5 text-sky-600" />
								)}
								{alunoEditando
									? "Editar Ficha do Aluno"
									: "Matricular Novo Aluno"}
							</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<form
							onSubmit={salvarAluno}
							className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
						>
							{/* SEÇÃO: TURMA E SEMESTRE */}
							<div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 space-y-4">
								<h4 className="font-bold text-sky-800 flex items-center gap-2 mb-2">
									<School className="w-5 h-5" /> Seleção de Turma
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-bold text-gray-700">
											Semestre Letivo
										</label>
										<select
											required
											value={form.semestre}
											onChange={(e) =>
												setForm({ ...form, semestre: e.target.value })
											}
											className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
										>
											{(semestresDb?.map((s) => s.codigo) ?? []).map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-bold text-gray-700">
											Turma Registrada
										</label>
										<select
											required
											value={form.turma}
											onChange={(e) =>
												setForm({ ...form, turma: e.target.value })
											}
											className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
										>
											<option value="">Selecione uma turma...</option>
											{(turmasDb?.map((t) => t.titulo) ?? []).map((t) => (
												<option key={t} value={t}>
													{t}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>

							{/* SEÇÃO: DADOS GERAIS */}
							<div className="space-y-4">
								<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
									<User className="w-5 h-5 text-gray-400" /> Dados Gerais
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="space-y-1 lg:col-span-2">
										<label className="text-sm font-semibold text-gray-700">
											Nome Completo
										</label>
										<input
											required
											type="text"
											value={form.nome}
											onChange={(e) =>
												setForm({ ...form, nome: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Data de Nascimento
										</label>
										<input
											required
											type="date"
											value={form.dataNascimento}
											onChange={(e) =>
												setForm({ ...form, dataNascimento: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											CPF
										</label>
										<input
											required
											type="text"
											value={form.cpf}
											onChange={(e) =>
							setForm({ ...form, cpf: formatarCpf(e.target.value) })
											}
											placeholder="000.000.000-00"
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Cor ou Raça
										</label>
										<select
											required
											value={form.corRaca}
											onChange={(e) =>
												setForm({ ...form, corRaca: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Branca">Branca</option>
											<option value="Preta">Preta</option>
											<option value="Amarela">Amarela</option>
											<option value="Parda">Parda</option>
											<option value="Indígena">Indígena</option>
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Identidade de Gênero
										</label>
										<select
											required
											value={form.identidadeGenero}
											onChange={(e) =>
												setForm({ ...form, identidadeGenero: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Homem cis">Homem cis</option>
											<option value="Mulher cis">Mulher cis</option>
											<option value="Homem trans">Homem trans</option>
											<option value="Mulher trans">Mulher trans</option>
											<option value="Não binário">Não binário</option>
											<option value="Outra">Outra</option>
											<option value="Não informar">Não informar</option>
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Pessoa LGBTQIAPN+?
										</label>
										<select
											required
											value={form.lgbtqiapn}
											onChange={(e) =>
												setForm({ ...form, lgbtqiapn: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
											<option value="Prefiro não informar">
												Prefiro não informar
											</option>
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Telefone Pessoal
										</label>
										<input
											required
											type="text"
											value={form.telefone}
											onChange={(e) =>
												setForm({ ...form, telefone: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Contato de Emergência
										</label>
										<input
											required
											type="text"
											value={form.contatoEmergencia}
											onChange={(e) =>
												setForm({ ...form, contatoEmergencia: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										/>
									</div>
									<div className="space-y-1 lg:col-span-2">
										<label className="text-sm font-semibold text-gray-700">
											Email <span className="text-xs font-normal text-gray-400">(opcional)</span>
										</label>
										<input
											type="email"
											value={form.email}
											onChange={(e) =>
												setForm({ ...form, email: e.target.value })
											}
											placeholder="exemplo@email.com"
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Responsável cuidado terceiros?
										</label>
										<select
											required
											value={form.cuidaTerceiros}
											onChange={(e) =>
												setForm({
													...form,
													cuidaTerceiros: e.target.value as SimNao,
												})
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>
								</div>
							</div>

							{/* SEÇÃO: TRABALHO E ESTUDOS (CONDICIONAIS) */}
							<div className="space-y-4">
								<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
									<Briefcase className="w-5 h-5 text-gray-400" /> Ocupação e
									Escolaridade
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1 md:col-span-2">
										<label className="text-sm font-semibold text-gray-700">
											Nível de Escolaridade
										</label>
										<select
											required
											value={form.escolaridade}
											onChange={(e) =>
												setForm({ ...form, escolaridade: e.target.value })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sem instrução">Sem instrução</option>
											<option value="Ensino Fundamental Incompleto">
												Ensino Fundamental Incompleto
											</option>
											<option value="Ensino Fundamental Completo">
												Ensino Fundamental Completo
											</option>
											<option value="Ensino Médio Incompleto">
												Ensino Médio Incompleto
											</option>
											<option value="Ensino Médio Completo">
												Ensino Médio Completo
											</option>
											<option value="Ensino Superior Incompleto">
												Ensino Superior Incompleto
											</option>
											<option value="Ensino Superior Completo">
												Ensino Superior Completo
											</option>
											<option value="Pós-graduação">Pós-graduação</option>
										</select>
									</div>

									{/* Trabalha? */}
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Trabalha atualmente?
										</label>
										<select
											required
											value={form.trabalha}
											onChange={(e) =>
												setForm({ ...form, trabalha: e.target.value as SimNao })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>

									{/* Condicionais Trabalho */}
									{form.trabalha === "Sim" && (
										<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2">
											<div className="space-y-1">
												<label className="text-sm font-semibold text-gray-700">
													Onde trabalha?
												</label>
												<input
													required
													type="text"
													value={form.trabalhoLocal || ""}
													onChange={(e) =>
														setForm({ ...form, trabalhoLocal: e.target.value })
													}
													className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
												/>
											</div>
											<div className="space-y-1">
												<label className="text-sm font-semibold text-gray-700">
													Qual a função?
												</label>
												<input
													required
													type="text"
													value={form.trabalhoFuncao || ""}
													onChange={(e) =>
														setForm({ ...form, trabalhoFuncao: e.target.value })
													}
													className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
												/>
											</div>
										</div>
									)}

									{/* Estuda? */}
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Estuda atualmente?
										</label>
										<select
											required
											value={form.estuda}
											onChange={(e) =>
												setForm({ ...form, estuda: e.target.value as SimNao })
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>

									{/* Condicionais Estudo */}
									{form.estuda === "Sim" && (
										<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2">
											<div className="space-y-1">
												<label className="text-sm font-semibold text-gray-700">
													Onde estuda?
												</label>
												<input
													required
													type="text"
													value={form.estudoLocal || ""}
													onChange={(e) =>
														setForm({ ...form, estudoLocal: e.target.value })
													}
													className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
												/>
											</div>
											<div className="space-y-1">
												<label className="text-sm font-semibold text-gray-700">
													Qual curso?
												</label>
												<input
													required
													type="text"
													value={form.estudoCurso || ""}
													onChange={(e) =>
														setForm({ ...form, estudoCurso: e.target.value })
													}
													className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
												/>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* SEÇÃO: SAÚDE (CONDICIONAIS) */}
							<div className="space-y-4">
								<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
									<HeartPulse className="w-5 h-5 text-gray-400" /> Saúde e
									Acessibilidade
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Possui algum problema de saúde?
										</label>
										<select
											required
											value={form.problemaSaude}
											onChange={(e) =>
												setForm({
													...form,
													problemaSaude: e.target.value as SimNao,
												})
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>
									{form.problemaSaude === "Sim" && (
										<div className="space-y-1 animate-in fade-in slide-in-from-right-2">
											<label className="text-sm font-semibold text-gray-700">
												Se sim, qual?
											</label>
											<input
												required
												type="text"
												value={form.problemaSaudeQual || ""}
												onChange={(e) =>
													setForm({
														...form,
														problemaSaudeQual: e.target.value,
													})
												}
												className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
											/>
										</div>
									)}

									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Tem alguma necessidade especial?
										</label>
										<select
											required
											value={form.necessidadeEspecial}
											onChange={(e) =>
												setForm({
													...form,
													necessidadeEspecial: e.target.value as SimNao,
												})
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>
									{form.necessidadeEspecial === "Sim" && (
										<div className="space-y-1 animate-in fade-in slide-in-from-right-2">
											<label className="text-sm font-semibold text-gray-700">
												Se sim, qual é a necessidade?
											</label>
											<input
												required
												type="text"
												placeholder="Ex: baixa visão, surdez..."
												value={form.necessidadeEspecialQual || ""}
												onChange={(e) =>
													setForm({
														...form,
														necessidadeEspecialQual: e.target.value,
													})
												}
												className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
											/>
										</div>
									)}
								</div>
							</div>

							{/* SEÇÃO: INFRAESTRUTURA TECNOLÓGICA (CONDICIONAIS) */}
							<div className="space-y-4">
								<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
									<Wifi className="w-5 h-5 text-gray-400" /> Infraestrutura e
									Equipamentos
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700">
											Tem acesso à internet?
										</label>
										<select
											required
											value={form.acessoInternet}
											onChange={(e) =>
												setForm({
													...form,
													acessoInternet: e.target.value as SimNao,
												})
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
											<Monitor className="w-4 h-4" /> Tem computador ou notebook
											em casa?
										</label>
										<select
											required
											value={form.temComputador}
											onChange={(e) =>
												setForm({
													...form,
													temComputador: e.target.value as SimNao,
												})
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
											<Smartphone className="w-4 h-4" /> Tem smartphone?
										</label>
										<select
											required
											value={form.temSmartphone}
											onChange={(e) =>
												setForm({
													...form,
													temSmartphone: e.target.value as SimNao,
												})
											}
											className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
										>
											<option value="">Selecione...</option>
											<option value="Sim">Sim</option>
											<option value="Não">Não</option>
										</select>
									</div>

									{form.temSmartphone === "Sim" && (
										<div className="space-y-1 animate-in fade-in slide-in-from-right-2">
											<label className="text-sm font-semibold text-gray-700">
												Sistema do Smartphone
											</label>
											<select
												required
												value={form.sistemaSmartphone || ""}
												onChange={(e) =>
													setForm({
														...form,
														sistemaSmartphone: e.target.value,
													})
												}
												className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
											>
												<option value="">Selecione...</option>
												<option value="Android">Android</option>
												<option value="iOS">iOS (iPhone)</option>
												<option value="Outro">Outro</option>
											</select>
										</div>
									)}
								</div>
							</div>

							{/* Rodapé fixo do Modal */}
							<div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-5 py-2.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm"
								>
									{alunoEditando ? "Salvar Alterações" : "Concluir Matrícula"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal de Importação com File Upload */}
			{isImportModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-3xl w-full max-w-lg overflow-y-auto shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
						{/* Cabecalho */}
						<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
									<FileSpreadsheet className="w-5 h-5" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-gray-900">
										Importar Planilha
									</h2>
									<p className="text-sm text-gray-500">
										Destino: semestre {semestreSelecionado?.codigo ?? "não selecionado"}
									</p>
								</div>
							</div>
							<button
								onClick={() => setIsImportModalOpen(false)}
								className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Corpo */}
						<div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-4 flex flex-col items-center justify-center">
							{(turmasDb?.length ?? 0) === 0 && <p className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Não há turmas cadastradas para {semestreSelecionado?.codigo}. A planilha será importada sem vínculo de turma; você poderá vinculá-los depois ao criar as turmas.</p>}
							<div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-white hover:border-sky-500 transition-colors">
								<Upload className="w-10 h-10 text-gray-400 mb-4" />
								<p className="text-sm font-semibold text-gray-700 mb-1">
									Selecione uma planilha do seu computador
								</p>
								<p className="text-xs text-gray-500 mb-4">
									Formatos suportados: .xlsx, .xls, .csv, .ods
								</p>

								<input
									type="file"
									accept=".xlsx, .xls, .csv, .ods"
									ref={fileInputRef}
									onChange={handleFileUpload}
									className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2.5 file:px-5
                                        file:rounded-xl file:border-0
                                        file:text-sm file:font-bold
                                        file:bg-sky-50 file:text-sky-700
                                        hover:file:bg-sky-100
                                        cursor-pointer"
								/>
							</div>
						</div>

						{/* Rodapé */}
						<div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
							<button
								type="button"
								onClick={() => setIsImportModalOpen(false)}
								className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
							>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
