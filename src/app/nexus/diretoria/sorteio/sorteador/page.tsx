"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  Download,
  Smartphone,
  Monitor,
  Trash2,
  Dices,
  SlidersHorizontal,
  History,
  Users,
  Hash,
  UserCircle2,
  ChevronDown
} from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Exportação dos resultados
// ---------------------------------------------------------------------------
type CandidatoExportavel = {
  ficha: string;
  nome: string;
  dataNascimento: Date;
  cpf: string;
  telefone: string;
  emergencia: string;
  curso: "SMARTPHONE" | "COMPUTADOR";
  createdAt: Date;
};

const CABECALHOS_INSCRICAO = [
  "Carimbo de data/hora",
  "Nome Completo",
  "Número da ficha",
  "Data de Nascimento",
  "CPF",
  "Telefone para Contato",
  "Contato de Emergência",
  "Curso de interesse - Apenas uma opção",
] as const;

const formatarCpf = (valor: string) => {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9) return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
};

const exportarResultados = async (
  smartphone: number[], 
  computador: number[], 
  modo: "vinculado" | "simples",
  candidatos: CandidatoExportavel[],
  codigoSemestre: string,
) => {
  if (modo === "vinculado") {
    if (smartphone.length === 0 && computador.length === 0) {
      alert("Ainda não há pessoas sorteadas para exportar.");
      return;
    }

    const XLSX = await import("xlsx");
    const registrosDoCurso = (sorteados: number[], curso: "SMARTPHONE" | "COMPUTADOR") => sorteados.flatMap((ficha) => {
      const candidato = candidatos.find((item) => Number(item.ficha) === ficha && item.curso === curso);
      if (!candidato) return [];
      return [{
        [CABECALHOS_INSCRICAO[0]]: candidato.createdAt,
        [CABECALHOS_INSCRICAO[1]]: candidato.nome,
        [CABECALHOS_INSCRICAO[2]]: candidato.ficha,
        [CABECALHOS_INSCRICAO[3]]: candidato.dataNascimento,
        [CABECALHOS_INSCRICAO[4]]: formatarCpf(candidato.cpf),
        [CABECALHOS_INSCRICAO[5]]: candidato.telefone,
        [CABECALHOS_INSCRICAO[6]]: candidato.emergencia,
        [CABECALHOS_INSCRICAO[7]]: curso === "SMARTPHONE" ? "Smartphone" : "Computador",
      }];
    });
    const adicionarAba = (arquivo: ReturnType<typeof XLSX.utils.book_new>, nome: string, registros: ReturnType<typeof registrosDoCurso>) => {
      const planilha = XLSX.utils.json_to_sheet(registros, { header: [...CABECALHOS_INSCRICAO] });
      planilha["!cols"] = [{ wch: 22 }, { wch: 34 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 25 }, { wch: 38 }, { wch: 34 }];
      for (let linha = 2; linha <= registros.length + 1; linha += 1) {
        if (planilha[`A${linha}`]) planilha[`A${linha}`].z = "dd/mm/yyyy hh:mm";
        if (planilha[`D${linha}`]) planilha[`D${linha}`].z = "dd/mm/yyyy";
      }
      XLSX.utils.book_append_sheet(arquivo, planilha, nome);
    };

    const arquivo = XLSX.utils.book_new();
    adicionarAba(arquivo, "Smartphone", registrosDoCurso(smartphone, "SMARTPHONE"));
    adicionarAba(arquivo, "Computador", registrosDoCurso(computador, "COMPUTADOR"));
    const codigo = codigoSemestre.replace(/[^a-zA-Z0-9_-]+/g, "_");
    XLSX.writeFile(arquivo, `Sorteados_${codigo}.xlsx`, { compression: true });
    return;
  }

  const BOM = "\ufeff";
  const cabecalho = "Smartphone;Computador\n";

  const totalLinhas = Math.max(smartphone.length, computador.length);

  const linhas = Array.from({ length: totalLinhas }, (_, i) => {
    const sNum = smartphone[i];
    const cNum = computador[i];

    let sText = "";
    let cText = "";

    // Processa coluna Smartphone
    if (sNum !== undefined) {
      sText = sNum.toString();
    }

    // Processa coluna Computador
    if (cNum !== undefined) {
      cText = cNum.toString();
    }

    return `${sText};${cText}`;
  }).join("\n");

  const csvFinal = BOM + cabecalho + linhas;
  const blob = new Blob([csvFinal], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dataAtual = new Date().toLocaleDateString().replace(/\//g, "-");

  link.href = url;
  link.download = `Sorteio_${dataAtual}.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const LIMITE_DE_EXCLUSOES = 10_000;

const interpretarNumerosExcluidos = (valor: string) => {
  const numeros = new Set<number>();
  const invalidos: string[] = [];

  for (const item of valor.split(",").map((parte) => parte.trim()).filter(Boolean)) {
    const intervalo = item.match(/^(\d+)\s*-\s*(\d+)$/);

    if (intervalo) {
      const inicio = Number(intervalo[1]);
      const fim = Number(intervalo[2]);
      const [menor, maior] = inicio <= fim ? [inicio, fim] : [fim, inicio];

      if (!Number.isSafeInteger(inicio) || !Number.isSafeInteger(fim) || maior - menor + 1 > LIMITE_DE_EXCLUSOES) {
        invalidos.push(item);
        continue;
      }

      for (let numero = menor; numero <= maior; numero += 1) numeros.add(numero);
      continue;
    }

    if (/^\d+$/.test(item) && Number.isSafeInteger(Number(item))) {
      numeros.add(Number(item));
    } else {
      invalidos.push(item);
    }
  }

  return { numeros, invalidos };
};

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------
const SorteadorOrganico = () => {
  const { data: semestres, isLoading: carregandoSemestres } = api.diretoria.semestres.list.useQuery();
  const [semestreId, setSemestreId] = useState("");
  const semestreSelecionado = semestres?.find((semestre) => semestre.id === semestreId) ?? semestres?.find((semestre) => semestre.ativo) ?? semestres?.[0];
  const { data: candidatosDb, isLoading: carregandoCandidatos } = api.diretoria.candidatos.list.useQuery({ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" }, { enabled: Boolean(semestreSelecionado) });
  const candidatos = candidatosDb ?? [];
  const getNomeCandidato = (ficha: number, curso: string) => candidatos.find((candidato) => Number(candidato.ficha) === ficha && candidato.curso === (curso === "Smartphone" ? "SMARTPHONE" : "COMPUTADOR"))?.nome;
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [results, setResults] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // NOVO ESTADO: Controle do modo de sorteio
  const [modo, setModo] = useState<"vinculado" | "simples">("vinculado");

  const [smartphoneHistory, setSmartphoneHistory] = useState<number[]>([]);
  const [computerHistory, setComputerHistory] = useState<number[]>([]);
  const [deviceType, setDeviceType] = useState<"Smartphone" | "Computador">("Smartphone");
  const [numerosExcluidos, setNumerosExcluidos] = useState("");
  const [exclusoesAbertas, setExclusoesAbertas] = useState(false);
  const candidatosDoModulo = candidatos.filter((candidato) => candidato.curso === (deviceType === "Smartphone" ? "SMARTPHONE" : "COMPUTADOR"));
  const exclusoes = useMemo(() => interpretarNumerosExcluidos(numerosExcluidos), [numerosExcluidos]);

  useEffect(() => {
    if (!semestreId && semestreSelecionado) setSemestreId(semestreSelecionado.id);
  }, [semestreId, semestreSelecionado]);

  useEffect(() => {
    const tratarFechamento = (e: BeforeUnloadEvent) => {
      if (smartphoneHistory.length > 0 || computerHistory.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", tratarFechamento);
    return () => window.removeEventListener("beforeunload", tratarFechamento);
  }, [smartphoneHistory, computerHistory]);

  const gerarNumeroOrganico = (lista: number[]) => {
    const indice = Math.floor(((Math.random() * performance.now()) % 1) * lista.length);
    return lista[indice] ?? null;
  };

  const sortear = () => {
    if (exclusoes.invalidos.length > 0) {
      alert(`Revise os números excluídos: ${exclusoes.invalidos.join(", ")}. Use números separados por vírgula ou intervalos como 1-10.`);
      return;
    }

    setIsAnimating(true);
    setResults([]);

    setTimeout(() => {
      const historicoAlvo = deviceType === "Smartphone" ? smartphoneHistory : computerHistory;

      const possiveis = modo === "vinculado"
        ? candidatosDoModulo.map((candidato) => Number(candidato.ficha)).filter((ficha) => Number.isSafeInteger(ficha) && !historicoAlvo.includes(ficha) && !exclusoes.numeros.has(ficha))
        : Array.from({ length: Math.max(0, max - min + 1) }, (_, indice) => min + indice).filter((numero) => !historicoAlvo.includes(numero) && !exclusoes.numeros.has(numero));

      if (possiveis.length === 0) {
        alert(modo === "vinculado" && candidatosDoModulo.length === 0
          ? `Não há candidatos de ${deviceType} cadastrados para este semestre. Cadastre as fichas antes de sortear.`
          : `Não há mais fichas disponíveis para ${deviceType} neste sorteio.`);
        setIsAnimating(false);
        return;
      }

      const sorteado = gerarNumeroOrganico(possiveis);
      if (sorteado === null) {
        setIsAnimating(false);
        return;
      }
      setResults([sorteado]);

      if (deviceType === "Smartphone") {
        setSmartphoneHistory((prev) => [sorteado, ...prev]);
      } else {
        setComputerHistory((prev) => [sorteado, ...prev]);
      }
      setIsAnimating(false);
    }, 900);
  };

  const resetar = () => {
    if (confirm("Limpar todos os registros?")) {
      setSmartphoneHistory([]);
      setComputerHistory([]);
      setResults([]);
      setNumerosExcluidos("");
    }
  };

  // Pega o nome do ganhador atual (se aplicável)
  const resultadoAtual = results.at(0);
  const ganhadorAtual = !isAnimating && resultadoAtual !== undefined && modo === "vinculado"
    ? getNomeCandidato(resultadoAtual, deviceType)
    : null;

  if (carregandoSemestres || carregandoCandidatos) return <div className="min-h-0 min-w-0 max-w-full overflow-x-clip px-3 py-5 sm:px-4 sm:py-6" aria-busy="true"><div className="mx-auto min-w-0 max-w-6xl space-y-6"><BotaoVoltar href="/nexus/diretoria/sorteio" label="Voltar para Sorteio" /><DataSkeleton cards={4} /></div></div>;

  return (
    <div className="sorteador-page min-h-0 w-full min-w-0 max-w-full overflow-x-clip bg-[radial-gradient(circle_at_92%_5%,rgba(14,165,233,.16),transparent_22rem),radial-gradient(circle_at_10%_75%,rgba(249,115,22,.10),transparent_18rem),#f8fafc] px-3 py-4 font-sans sm:px-5 sm:py-6 lg:px-6">
	  <div className="sorteador-container sorteador-layout mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-3 sm:gap-4">
        
        <div className="sorteador-back">
          <BotaoVoltar href="/nexus/diretoria/sorteio" label="Voltar para Sorteio" />
        </div>

        {/* Banner de topo */}
        <div className="sorteador-hero relative w-full min-w-0 shrink-0 overflow-hidden rounded-2xl bg-sky-600 px-4 py-4 shadow-[0_20px_45px_rgba(2,132,199,.24)] sm:rounded-[1.75rem] sm:px-6 sm:py-5">
          <div className="absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-orange-500" />
          <div className="absolute right-28 -top-9 h-24 w-24 rounded-full border-[12px] border-sky-300/70" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20 backdrop-blur-sm">
              <Dices className="w-[55%] h-[55%] text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="break-words text-xl font-black leading-tight tracking-[-.035em] text-white sm:text-2xl">
				Estação de Sorteio
              </h1>
              <p className="sorteador-hero-description mt-1 break-words text-sm leading-snug text-white/85">
                Defina o semestre, selecione o módulo e acompanhe o resultado em tempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="sorteador-grid grid min-h-0 w-full min-w-0 items-start gap-3 sm:gap-4">
          
          {/* COLUNA DE AÇÃO */}
          <div className="sorteador-card sorteador-action-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)]">
            
            {/* Cabeçalho do card */}
            <div className="sorteador-card-header relative shrink-0 overflow-hidden bg-sky-600 px-4 py-3 sm:px-5">
			  <div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-orange-500" />
              <div className="relative flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <SlidersHorizontal className="w-[55%] h-[55%] text-white" />
                </div>
                <span className="truncate text-sm font-semibold text-white">
                  Configuração do sorteio
                </span>
              </div>
            </div>

            {/* Corpo do card */}
            <div className="sorteador-action-body flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
              
              <div className="sorteador-controls grid shrink-0 gap-3">
                <div className="sorteador-control sorteador-semester min-w-0">
                  <label htmlFor="semestre-sorteio" className="mb-2 block text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Semestre
                  </label>
                  <select id="semestre-sorteio" value={semestreSelecionado?.id ?? ""} onChange={(e) => setSemestreId(e.target.value)} className="min-h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-base font-medium text-gray-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 sm:text-sm">
                    {semestres?.map((semestre) => <option key={semestre.id} value={semestre.id}>{semestre.codigo}{semestre.ativo ? " — ativo" : ""}</option>)}
                  </select>
                </div>
                
                {/* Seletor de Modo (Vinculado vs Simples) */}
                <div className="sorteador-control min-w-0">
                  <span className="mb-2 block text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Modo de Sorteio
                  </span>
                  <div className="grid min-w-0 grid-cols-2 rounded-xl bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setModo("vinculado")}
                      className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
                        modo === "vinculado" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">VINCULADO</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModo("simples")}
                      className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
                        modo === "simples" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">SIMPLES</span>
                    </button>
                  </div>
                </div>

                {/* Seletor de Módulo de Destino */}
                <div className="sorteador-control min-w-0">
                  <span className="mb-2 block text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Módulo de destino
                  </span>
                  <div className="grid min-w-0 grid-cols-2 rounded-xl bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setDeviceType("Smartphone")}
                      className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
                        deviceType === "Smartphone" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">SMARTPHONE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeviceType("Computador")}
                      className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
                        deviceType === "Computador" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">COMPUTADOR</span>
                    </button>
                  </div>
                </div>

                {modo === "vinculado" && (
                  <div className="sorteador-availability rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-sky-800">{candidatosDoModulo.length} ficha(s) de {deviceType} disponível(is)</p>
                    <p className="mt-1 text-xs text-sky-700">As fichas são carregadas do cadastro deste semestre.</p>
                    {candidatosDoModulo.length === 0 && <a href="/nexus/diretoria/sorteio" className="mt-2 inline-block text-xs font-semibold text-sky-700 underline">Cadastrar candidatos</a>}
                  </div>
                )}

                {modo === "simples" && <div className="sorteador-range grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <label htmlFor="range-inicial" className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                      Range inicial
                    </label>
                    <input
                      id="range-inicial"
                      type="number"
                      value={min}
                      onChange={(e) => setMin(Number(e.target.value) || 1)}
                      className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-base font-semibold text-sky-700 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none sm:px-3 sm:text-sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="range-final" className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                      Range final
                    </label>
                    <input
                      id="range-final"
                      type="number"
                      value={max}
                      onChange={(e) => setMax(Number(e.target.value) || 1)}
                      className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-base font-semibold text-sky-700 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none sm:px-3 sm:text-sm"
                    />
                  </div>
                </div>}

                <div className="sorteador-exclusions min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-2">
                  <button
                    type="button"
                    onClick={() => setExclusoesAbertas((abertas) => !abertas)}
                    aria-expanded={exclusoesAbertas}
                    aria-controls="painel-numeros-excluidos"
                    className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg px-1.5 text-left transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">Tirar números do sorteio</span>
                      {numerosExcluidos && (
                        <span className={`mt-0.5 block truncate text-xs font-semibold ${exclusoes.invalidos.length > 0 ? "text-red-600" : "text-sky-700"}`}>
                          {exclusoes.invalidos.length > 0 ? "Há números para revisar" : `${exclusoes.numeros.size} número(s) excluído(s)`}
                        </span>
                      )}
                    </span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-sky-600 transition-transform duration-200 ${exclusoesAbertas ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>

                  {exclusoesAbertas && (
                    <div id="painel-numeros-excluidos" className="mt-2 border-t border-gray-200 px-1.5 pt-3">
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <label htmlFor="numeros-excluidos" className="min-w-0 text-xs font-medium text-gray-600">
                          Números e intervalos a ignorar
                        </label>
                        {numerosExcluidos && (
                          <button type="button" onClick={() => setNumerosExcluidos("")} className="min-h-11 shrink-0 px-2 text-xs font-semibold text-sky-600 hover:text-sky-700">
                            Limpar
                          </button>
                        )}
                      </div>
                      <input
                        id="numeros-excluidos"
                        type="text"
                        value={numerosExcluidos}
                        onChange={(e) => setNumerosExcluidos(e.target.value)}
                        placeholder="Ex.: 1-10, 13-14, 22"
                        aria-describedby="ajuda-numeros-excluidos"
                        aria-invalid={exclusoes.invalidos.length > 0}
                        className={`min-h-11 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-base font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${exclusoes.invalidos.length > 0 ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-sky-300 focus:ring-sky-100"}`}
                      />
                      <p id="ajuda-numeros-excluidos" className={`mt-1.5 break-words text-xs leading-snug ${exclusoes.invalidos.length > 0 ? "text-red-600" : "text-gray-500"}`}>
                        {exclusoes.invalidos.length > 0
                          ? `Formato inválido: ${exclusoes.invalidos.join(", ")}. Use vírgulas e intervalos de até ${LIMITE_DE_EXCLUSOES.toLocaleString("pt-BR")} números.`
                          : exclusoes.numeros.size > 0
                            ? `${exclusoes.numeros.size} número(s) será(ão) ignorado(s). “14-13” exclui 13 e 14.`
                            : "Use vírgulas e intervalos. “14-13” também exclui 13 e 14."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Área de resultado (Modificada para exibir o nome) */}
              <div className="sorteador-result relative flex min-h-[clamp(7rem,16vh,11rem)] min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-sky-50/50 px-3 py-3 sm:px-4">
                {isAnimating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-600/50" />
                    <div className="flex flex-col items-center text-center">
                      <span className="animate-pulse text-xs font-semibold tracking-[0.25em] text-sky-600">PROCESSANDO</span>
                      <span className="mt-1 font-mono text-xs text-sky-600/60">Entropy shift...</span>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="text-center animate-in zoom-in duration-500 w-full flex flex-col items-center justify-center">
                    <div className="text-6xl font-black leading-none tracking-tighter text-sky-600 sm:text-7xl">
                      {results[0]}
                    </div>
                    
                    {/* Badge do dispositivo e Nome do Candidato */}
                    {ganhadorAtual ? (
                      <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full shadow-sm max-w-full">
                        <UserCircle2 className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 truncate text-sm font-bold">{ganhadorAtual}</span>
                      </div>
                    ) : (
                      <div className="mt-3 inline-block rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        {deviceType} registrado
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-20">
                    <div className="w-16 h-1 bg-gray-400 mb-2 rounded-full" />
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Standby</span>
                  </div>
                )}
              </div>

              {/* Ação principal */}
              <button
                type="button"
                onClick={sortear}
                disabled={isAnimating}
                className="min-h-11 w-full shrink-0 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-extrabold tracking-wide text-white shadow-[0_12px_24px_rgba(234,88,12,.24)] transition-all hover:-translate-y-0.5 hover:bg-orange-700 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                EXECUTAR SORTEIO
              </button>

              {/* Ações secundárias */}
              <div className="grid min-w-0 shrink-0 grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-3">
                <button
                  type="button"
                  onClick={() => void exportarResultados(smartphoneHistory, computerHistory, modo, candidatos, semestreSelecionado?.codigo ?? "semestre")}
                  className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 text-sm font-medium text-sky-600 transition-colors hover:border-sky-200 hover:bg-sky-50"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Exportar Planilha</span>
                </button>
                <button
                  type="button"
                  onClick={resetar}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                  aria-label="Resetar banco de dados"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* COLUNA DE REGISTROS (HISTÓRICO) */}
          <div className="sorteador-card sorteador-history-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)]">
            
            {/* Cabeçalho do card */}
            <div className="sorteador-card-header relative shrink-0 overflow-hidden bg-orange-600 px-4 py-3 sm:px-5">
			  <div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-sky-300/50" />
              <div className="relative flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20 backdrop-blur-sm">
                  <History className="w-[55%] h-[55%] text-white" />
                </div>
                <span className="truncate text-sm font-semibold text-white">
                  Histórico de sorteios
                </span>
              </div>
            </div>

            {/* Corpo do card */}
            <div className="flex-1 flex flex-col divide-y divide-gray-100 min-h-0">
              
              {/* Seção Smartphone */}
              <div className="sorteador-history-section flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Smartphone
                  </span>
                  <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
                    {smartphoneHistory.length} {modo === "vinculado" ? "Pessoas" : "IDs"}
                  </span>
                </div>
                <div className="sorteador-history-list flex min-h-0 min-w-0 flex-1 flex-wrap content-start gap-1.5 overflow-x-hidden overflow-y-auto pr-1">
                  {smartphoneHistory.map((num, i) => {
                    const isLast = i === 0 && deviceType === "Smartphone";
                    
                    // Renderização Condicional: Modo Vinculado vs Simples
                    if (modo === "vinculado") {
                      const nome = getNomeCandidato(num, "Smartphone");
                      return (
                        <div key={num} className={`flex min-w-0 w-full items-center gap-2 rounded-xl border px-2 py-1.5 transition-all ${isLast ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
                          <div className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${isLast ? "bg-amber-500 text-white" : "bg-white border border-gray-200 text-black"}`}>
                            {num}
                          </div>
                          {nome ? (
                            <span className={`min-w-0 truncate text-sm font-semibold ${isLast ? "text-amber-800" : "text-gray-700"}`}>{nome}</span>
                          ) : (
                            <span className="text-sm font-medium italic text-gray-400">Ficha sem registro</span>
                          )}
                        </div>
                      );
                    }

                    // Original Mode (Apenas quadrados)
                    return (
                      <div key={num} className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        isLast ? "bg-amber-500 text-white scale-110 shadow-md" : "bg-sky-600 text-white"
                      }`}>
                        {num}
                      </div>
                    );
                  })}
                  {smartphoneHistory.length === 0 && (
                    <span className="mx-auto py-4 text-sm font-medium text-gray-400">Sem entradas</span>
                  )}
                </div>
              </div>

              {/* Seção Computador */}
              <div className="sorteador-history-section flex min-h-0 flex-1 flex-col bg-gray-50/50 p-3 sm:p-4">
                <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Computador
                  </span>
                  <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
                    {computerHistory.length} {modo === "vinculado" ? "Pessoas" : "IDs"}
                  </span>
                </div>
                <div className="sorteador-history-list flex min-h-0 min-w-0 flex-1 flex-wrap content-start gap-1.5 overflow-x-hidden overflow-y-auto pr-1">
                  {computerHistory.map((num, i) => {
                    const isLast = i === 0 && deviceType === "Computador";

                    // Renderização Condicional: Modo Vinculado vs Simples
                    if (modo === "vinculado") {
                      const nome = getNomeCandidato(num, "Computador");
                      return (
                        <div key={num} className={`flex min-w-0 w-full items-center gap-2 rounded-xl border px-2 py-1.5 transition-all ${isLast ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100 shadow-sm"}`}>
                          <div className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${isLast ? "bg-amber-500 text-white" : "bg-gray-100 border border-gray-200 text-black"}`}>
                            {num}
                          </div>
                          {nome ? (
                            <span className={`min-w-0 truncate text-sm font-semibold ${isLast ? "text-amber-800" : "text-gray-700"}`}>{nome}</span>
                          ) : (
                            <span className="text-sm font-medium italic text-gray-400">Ficha sem registro</span>
                          )}
                        </div>
                      );
                    }

                    // Original Mode (Apenas quadrados)
                    return (
                      <div key={num} className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        isLast ? "bg-amber-500 text-white scale-110 shadow-md" : "bg-sky-600 text-white"
                      }`}>
                        {num}
                      </div>
                    );
                  })}
                  {computerHistory.length === 0 && (
                    <span className="mx-auto py-4 text-sm font-medium text-gray-400">Sem entradas</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <footer className="sorteador-footer flex shrink-0 flex-col items-center py-1">
          <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">Powered by: Luiz Roberto</span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">@luizrob_bah</span>
        </footer>
      </div>
    </div>
  );
};

export default SorteadorOrganico;
