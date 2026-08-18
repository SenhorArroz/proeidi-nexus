"use client";
import React, { useState, useEffect } from "react";
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
  UserCircle2
} from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Função de Exportação Atualizada
// ---------------------------------------------------------------------------
const exportarParaCSV = (
  smartphone: number[], 
  computador: number[], 
  modo: "vinculado" | "simples",
  candidatos: { ficha: string; nome: string; curso: "SMARTPHONE" | "COMPUTADOR" }[],
) => {
  const getNomeCandidato = (ficha: number, curso: string) => candidatos.find((candidato) => Number(candidato.ficha) === ficha && candidato.curso === (curso === "Smartphone" ? "SMARTPHONE" : "COMPUTADOR"))?.nome;
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
      if (modo === "vinculado") {
        const nome = getNomeCandidato(sNum, "Smartphone");
        sText = nome ? `${sNum} (${nome})` : `${sNum} (Sem registro)`;
      } else {
        sText = sNum.toString();
      }
    }

    // Processa coluna Computador
    if (cNum !== undefined) {
      if (modo === "vinculado") {
        const nome = getNomeCandidato(cNum, "Computador");
        cText = nome ? `${cNum} (${nome})` : `${cNum} (Sem registro)`;
      } else {
        cText = cNum.toString();
      }
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
  const candidatosDoModulo = candidatos.filter((candidato) => candidato.curso === (deviceType === "Smartphone" ? "SMARTPHONE" : "COMPUTADOR"));

  useEffect(() => {
    if (!semestreId && semestreSelecionado) setSemestreId(semestreSelecionado.id);
  }, [semestreId, semestreSelecionado]);

  useEffect(() => {
    const tratarFechamento = (e: BeforeUnloadEvent) => {
      if (smartphoneHistory.length > 0 || computerHistory.length > 0) {
        e.preventDefault();
        return (e.returnValue = "");
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
    setIsAnimating(true);
    setResults([]);

    setTimeout(() => {
      const historicoAlvo = deviceType === "Smartphone" ? smartphoneHistory : computerHistory;

      const possiveis = modo === "vinculado"
        ? candidatosDoModulo.map((candidato) => Number(candidato.ficha)).filter((ficha) => Number.isSafeInteger(ficha) && !historicoAlvo.includes(ficha))
        : Array.from({ length: Math.max(0, max - min + 1) }, (_, indice) => min + indice).filter((numero) => !historicoAlvo.includes(numero));

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
    }
  };

  // Pega o nome do ganhador atual (se aplicável)
  const resultadoAtual = results.at(0);
  const ganhadorAtual = !isAnimating && resultadoAtual !== undefined && modo === "vinculado"
    ? getNomeCandidato(resultadoAtual, deviceType)
    : null;

  if (carregandoSemestres || carregandoCandidatos) return <div className="min-h-full px-4 py-6" aria-busy="true"><div className="mx-auto max-w-6xl space-y-6"><BotaoVoltar href="/nexus/diretoria/sorteio" label="Voltar para Sorteio" /><DataSkeleton cards={4} /></div></div>;

  return (
    <div className="min-h-full w-full bg-[radial-gradient(circle_at_92%_5%,rgba(14,165,233,.16),transparent_22rem),radial-gradient(circle_at_10%_75%,rgba(249,115,22,.10),transparent_18rem),#f8fafc] px-[clamp(.75rem,2vw,1.5rem)] py-6 font-sans">
	  <div className="mx-auto flex w-full max-w-6xl flex-col gap-[clamp(.6rem,1.8vh,1.25rem)]">
        
        <BotaoVoltar href="/nexus/diretoria/sorteio" label="Voltar para Sorteio" />

        {/* Banner de topo */}
        <div className="relative w-full shrink-0 overflow-hidden rounded-[1.75rem] bg-sky-600 px-[clamp(1rem,3vw,2rem)] py-[clamp(.9rem,2.2vh,1.75rem)] shadow-[0_20px_45px_rgba(2,132,199,.24)]">
          <div className="absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-orange-500" />
          <div className="absolute right-28 -top-9 h-24 w-24 rounded-full border-[12px] border-sky-300/70" />

          <div className="relative flex items-center gap-3">
            <div className="w-[clamp(2rem,3vw,2.5rem)] h-[clamp(2rem,3vw,2.5rem)] rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
              <Dices className="w-[55%] h-[55%] text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[clamp(1.2rem,2vw,1.75rem)] font-black tracking-[-.035em] text-white leading-tight truncate">
				Estação de Sorteio
              </h1>
              <p className="text-[clamp(0.65rem,1vw,0.8rem)] text-white/80 truncate">
                Defina o semestre, selecione o módulo e acompanhe o resultado em tempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(0.6rem,1.5vw,1.25rem)] w-full min-h-0">
          
          {/* COLUNA DE AÇÃO */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)]">
            
            {/* Cabeçalho do card */}
            <div className="relative shrink-0 overflow-hidden bg-sky-600 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(.6rem,1.6vh,1.1rem)]">
			  <div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-orange-500" />
              <div className="relative flex items-center gap-2.5">
                <div className="w-[clamp(1.75rem,2.5vw,2.25rem)] h-[clamp(1.75rem,2.5vw,2.25rem)] rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <SlidersHorizontal className="w-[55%] h-[55%] text-white" />
                </div>
                <span className="text-[clamp(0.75rem,1vw,0.875rem)] font-semibold text-white truncate">
                  Configuração do sorteio
                </span>
              </div>
            </div>

            {/* Corpo do card */}
            <div className="flex-1 flex flex-col justify-between p-[clamp(0.85rem,1.8vw,1.5rem)] gap-[clamp(0.6rem,1.6vh,1.25rem)] min-h-0">
              
              <div className="flex flex-col gap-[clamp(0.6rem,1.6vh,1.25rem)] flex-shrink-0">
                <div>
                  <label className="block text-center text-[clamp(0.6rem,0.8vw,0.7rem)] font-medium text-gray-500 uppercase tracking-wider mb-[clamp(0.4rem,1vh,0.75rem)]">
                    Semestre
                  </label>
                  <select value={semestreSelecionado?.id ?? ""} onChange={(e) => setSemestreId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100">
                    {semestres?.map((semestre) => <option key={semestre.id} value={semestre.id}>{semestre.codigo}{semestre.ativo ? " — ativo" : ""}</option>)}
                  </select>
                </div>
                
                {/* Seletor de Modo (Vinculado vs Simples) */}
                <div>
                  <span className="block text-center text-[clamp(0.6rem,0.8vw,0.7rem)] font-medium text-gray-500 uppercase tracking-wider mb-[clamp(0.4rem,1vh,0.75rem)]">
                    Modo de Sorteio
                  </span>
                  <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setModo("vinculado")}
                      className={`flex items-center justify-center gap-1.5 py-[clamp(0.4rem,1.2vh,0.6rem)] rounded-lg text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold tracking-wide transition-all ${
                        modo === "vinculado" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">VINCULADO</span>
                    </button>
                    <button
                      onClick={() => setModo("simples")}
                      className={`flex items-center justify-center gap-1.5 py-[clamp(0.4rem,1.2vh,0.6rem)] rounded-lg text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold tracking-wide transition-all ${
                        modo === "simples" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">SIMPLES</span>
                    </button>
                  </div>
                </div>

                {/* Seletor de Módulo de Destino */}
                <div>
                  <span className="block text-center text-[clamp(0.6rem,0.8vw,0.7rem)] font-medium text-gray-500 uppercase tracking-wider mb-[clamp(0.4rem,1vh,0.75rem)]">
                    Módulo de destino
                  </span>
                  <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setDeviceType("Smartphone")}
                      className={`flex items-center justify-center gap-1.5 py-[clamp(0.4rem,1.2vh,0.6rem)] rounded-lg text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold tracking-wide transition-all ${
                        deviceType === "Smartphone" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">SMARTPHONE</span>
                    </button>
                    <button
                      onClick={() => setDeviceType("Computador")}
                      className={`flex items-center justify-center gap-1.5 py-[clamp(0.4rem,1.2vh,0.6rem)] rounded-lg text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold tracking-wide transition-all ${
                        deviceType === "Computador" ? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">COMPUTADOR</span>
                    </button>
                  </div>
                </div>

                {modo === "vinculado" && (
                  <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-sky-800">{candidatosDoModulo.length} ficha(s) de {deviceType} disponível(is)</p>
                    <p className="mt-1 text-[11px] text-sky-700">As fichas são carregadas do cadastro deste semestre.</p>
                    {candidatosDoModulo.length === 0 && <a href="/nexus/diretoria/sorteio" className="mt-2 inline-block text-[11px] font-semibold text-sky-700 underline">Cadastrar candidatos</a>}
                  </div>
                )}

                {modo === "simples" && <div className="grid grid-cols-2 gap-[clamp(0.5rem,1.2vw,1rem)]">
                  <div>
                    <label className="block text-[clamp(0.6rem,0.75vw,0.68rem)] font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Range inicial
                    </label>
                    <input
                      type="number"
                      value={min}
                      onChange={(e) => setMin(Number(e.target.value) || 1)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 text-center font-semibold text-sky-700 px-3 py-[clamp(0.3rem,1vh,0.5rem)] text-[clamp(0.75rem,0.9vw,0.875rem)] focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[clamp(0.6rem,0.75vw,0.68rem)] font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Range final
                    </label>
                    <input
                      type="number"
                      value={max}
                      onChange={(e) => setMax(Number(e.target.value) || 1)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 text-center font-semibold text-sky-700 px-3 py-[clamp(0.3rem,1vh,0.5rem)] text-[clamp(0.75rem,0.9vw,0.875rem)] focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
                    />
                  </div>
                </div>}
              </div>

              {/* Área de resultado (Modificada para exibir o nome) */}
              <div className="relative rounded-2xl border border-gray-200 bg-sky-50/50 flex flex-col items-center justify-center flex-1 min-h-[clamp(90px,16vh,180px)] px-4 py-2 overflow-hidden">
                {isAnimating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-[clamp(1.5rem,2.5vw,2rem)] h-[clamp(1.5rem,2.5vw,2rem)] text-sky-600/50 animate-spin" />
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[clamp(0.6rem,0.8vw,0.7rem)] font-semibold text-sky-600 tracking-[0.3em] animate-pulse">PROCESSANDO</span>
                      <span className="text-[clamp(0.55rem,0.7vw,0.65rem)] text-sky-600/50 font-mono mt-1">Entropy shift...</span>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="text-center animate-in zoom-in duration-500 w-full flex flex-col items-center justify-center">
                    <div className="text-[clamp(2rem,5vw+3vh,4.5rem)] font-black text-sky-600 leading-none tracking-tighter">
                      {results[0]}
                    </div>
                    
                    {/* Badge do dispositivo e Nome do Candidato */}
                    {ganhadorAtual ? (
                      <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full shadow-sm max-w-full">
                        <UserCircle2 className="w-[clamp(0.8rem,1vw,1rem)] h-[clamp(0.8rem,1vw,1rem)] flex-shrink-0" />
                        <span className="font-bold text-[clamp(0.65rem,0.85vw,0.75rem)] truncate">{ganhadorAtual}</span>
                      </div>
                    ) : (
                      <div className="mt-3 inline-block px-4 py-1.5 bg-amber-500 text-white rounded-full font-semibold text-[clamp(0.55rem,0.7vw,0.65rem)] uppercase tracking-[0.15em]">
                        {deviceType} registrado
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-20">
                    <div className="w-16 h-1 bg-gray-400 mb-2 rounded-full" />
                    <span className="text-[clamp(0.6rem,0.8vw,0.7rem)] font-semibold uppercase tracking-[0.4em] text-gray-500">Standby</span>
                  </div>
                )}
              </div>

              {/* Ação principal */}
              <button
                onClick={sortear}
                disabled={isAnimating}
                className="mt-2 h-[clamp(2.5rem,5.5vh,3.25rem)] w-full shrink-0 rounded-2xl bg-orange-600 text-[clamp(.75rem,.95vw,.875rem)] font-extrabold tracking-wide text-white shadow-[0_12px_24px_rgba(234,88,12,.24)] transition-all hover:-translate-y-0.5 hover:bg-orange-700 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                EXECUTAR SORTEIO
              </button>

              {/* Ações secundárias */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => exportarParaCSV(smartphoneHistory, computerHistory, modo, candidatos)}
                  className="flex-1 flex items-center justify-center gap-2 h-[clamp(2rem,4.2vh,2.75rem)] rounded-xl border border-gray-200 bg-white text-sky-600 text-[clamp(0.7rem,0.85vw,0.8rem)] font-medium hover:bg-sky-50 hover:border-sky-200 transition-colors min-w-0"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Exportar Planilha</span>
                </button>
                <button
                  onClick={resetar}
                  className="flex items-center justify-center gap-2 h-[clamp(2rem,4.2vh,2.75rem)] w-[clamp(2rem,4.2vh,2.75rem)] flex-shrink-0 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  aria-label="Resetar banco de dados"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* COLUNA DE REGISTROS (HISTÓRICO) */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)]">
            
            {/* Cabeçalho do card */}
            <div className="relative shrink-0 overflow-hidden bg-orange-600 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(.6rem,1.6vh,1.1rem)]">
			  <div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-sky-300/50" />
              <div className="relative flex items-center gap-2.5">
                <div className="w-[clamp(1.75rem,2.5vw,2.25rem)] h-[clamp(1.75rem,2.5vw,2.25rem)] rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
                  <History className="w-[55%] h-[55%] text-white" />
                </div>
                <span className="text-[clamp(0.75rem,1vw,0.875rem)] font-semibold text-white truncate">
                  Histórico de sorteios
                </span>
              </div>
            </div>

            {/* Corpo do card */}
            <div className="flex-1 flex flex-col divide-y divide-gray-100 min-h-0">
              
              {/* Seção Smartphone */}
              <div className="flex-1 flex flex-col min-h-0 p-[clamp(0.85rem,1.8vw,1.5rem)]">
                <div className="flex items-center justify-between mb-[clamp(0.5rem,1.2vh,1rem)] flex-shrink-0">
                  <span className="text-[clamp(0.65rem,0.85vw,0.75rem)] font-semibold text-gray-700 uppercase tracking-wide">
                    Smartphone
                  </span>
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-full text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold flex-shrink-0">
                    {smartphoneHistory.length} {modo === "vinculado" ? "Pessoas" : "IDs"}
                  </span>
                </div>
                <div className="flex flex-wrap content-start gap-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
                  {smartphoneHistory.map((num, i) => {
                    const isLast = i === 0 && deviceType === "Smartphone";
                    
                    // Renderização Condicional: Modo Vinculado vs Simples
                    if (modo === "vinculado") {
                      const nome = getNomeCandidato(num, "Smartphone");
                      return (
                        <div key={i} className={`flex items-center gap-2 px-2 py-1.5 w-full rounded-xl border transition-all ${isLast ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}>
                          <div className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${isLast ? "bg-amber-500 text-white" : "bg-white border border-gray-200 text-gray-700"}`}>
                            {num}
                          </div>
                          {nome ? (
                            <span className={`text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold truncate ${isLast ? "text-amber-800" : "text-gray-700"}`}>{nome}</span>
                          ) : (
                            <span className="text-[clamp(0.65rem,0.8vw,0.75rem)] text-gray-400 font-medium italic">Ficha sem registro</span>
                          )}
                        </div>
                      );
                    }

                    // Original Mode (Apenas quadrados)
                    return (
                      <div key={i} className={`w-[clamp(1.75rem,3vw,2.25rem)] h-[clamp(1.75rem,3vw,2.25rem)] flex items-center justify-center rounded-lg font-bold text-[clamp(0.6rem,0.75vw,0.7rem)] transition-all ${
                        isLast ? "bg-amber-500 text-white scale-110 shadow-md" : "bg-sky-600 text-white"
                      }`}>
                        {num}
                      </div>
                    );
                  })}
                  {smartphoneHistory.length === 0 && (
                    <span className="text-[clamp(0.65rem,0.85vw,0.75rem)] font-medium text-gray-400 mx-auto py-4">Sem entradas</span>
                  )}
                </div>
              </div>

              {/* Seção Computador */}
              <div className="flex-1 flex flex-col min-h-0 p-[clamp(0.85rem,1.8vw,1.5rem)] bg-gray-50/50">
                <div className="flex items-center justify-between mb-[clamp(0.5rem,1.2vh,1rem)] flex-shrink-0">
                  <span className="text-[clamp(0.65rem,0.85vw,0.75rem)] font-semibold text-gray-700 uppercase tracking-wide">
                    Computador
                  </span>
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-full text-[clamp(0.6rem,0.75vw,0.7rem)] font-semibold flex-shrink-0">
                    {computerHistory.length} {modo === "vinculado" ? "Pessoas" : "IDs"}
                  </span>
                </div>
                <div className="flex flex-wrap content-start gap-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
                  {computerHistory.map((num, i) => {
                    const isLast = i === 0 && deviceType === "Computador";

                    // Renderização Condicional: Modo Vinculado vs Simples
                    if (modo === "vinculado") {
                      const nome = getNomeCandidato(num, "Computador");
                      return (
                        <div key={i} className={`flex items-center gap-2 px-2 py-1.5 w-full rounded-xl border transition-all ${isLast ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100 shadow-sm"}`}>
                          <div className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${isLast ? "bg-amber-500 text-white" : "bg-gray-100 border border-gray-200 text-gray-700"}`}>
                            {num}
                          </div>
                          {nome ? (
                            <span className={`text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold truncate ${isLast ? "text-amber-800" : "text-gray-700"}`}>{nome}</span>
                          ) : (
                            <span className="text-[clamp(0.65rem,0.8vw,0.75rem)] text-gray-400 font-medium italic">Ficha sem registro</span>
                          )}
                        </div>
                      );
                    }

                    // Original Mode (Apenas quadrados)
                    return (
                      <div key={i} className={`w-[clamp(1.75rem,3vw,2.25rem)] h-[clamp(1.75rem,3vw,2.25rem)] flex items-center justify-center rounded-lg font-bold text-[clamp(0.6rem,0.75vw,0.7rem)] transition-all ${
                        isLast ? "bg-amber-500 text-white scale-110 shadow-md" : "bg-sky-600 text-white"
                      }`}>
                        {num}
                      </div>
                    );
                  })}
                  {computerHistory.length === 0 && (
                    <span className="text-[clamp(0.65rem,0.85vw,0.75rem)] font-medium text-gray-400 mx-auto py-4">Sem entradas</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <footer className="flex flex-col items-center flex-shrink-0 pb-1 pt-1">
          <span className="text-[clamp(0.6rem,0.7vw,0.68rem)] font-medium text-gray-400 uppercase tracking-widest">Powered by: Luiz Roberto</span>
          <span className="text-[clamp(0.6rem,0.7vw,0.68rem)] font-medium text-gray-400 uppercase tracking-widest">@luizrob_bah</span>
        </footer>
      </div>
    </div>
  );
};

export default SorteadorOrganico;
