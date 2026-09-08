"use client";
import { HistoricoSorteador } from "./_components/historico-sorteador";
import { PainelSorteador } from "./_components/painel-sorteador";
import { useSorteadorOrganico } from "./_components/use-sorteador-organico";

import { Dices } from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------
const SorteadorOrganico = () => {
	const {
		carregandoSemestres,
		carregandoCandidatos,
		semestreSelecionado,
		setSemestreId,
		semestres,
		setModo,
		modo,
		setDeviceType,
		deviceType,
		candidatosDoModulo,
		min,
		setMin,
		max,
		setMax,
		setExclusoesAbertas,
		exclusoesAbertas,
		numerosExcluidos,
		exclusoes,
		setNumerosExcluidos,
		isAnimating,
		results,
		ganhadorAtual,
		sortear,
		smartphoneHistory,
		computerHistory,
		candidatos,
		resetar,
		getNomeCandidato,
	} = useSorteadorOrganico();

	if (carregandoSemestres || carregandoCandidatos)
		return (
			<div
				className="min-h-0 min-w-0 max-w-full overflow-x-clip px-3 py-5 sm:px-4 sm:py-6"
				aria-busy="true"
			>
				<div className="mx-auto min-w-0 max-w-6xl space-y-6">
					<BotaoVoltar
						href="/nexus/diretoria/sorteio"
						label="Voltar para Sorteio"
					/>
					<DataSkeleton cards={4} />
				</div>
			</div>
		);

	return (
		<div className="sorteador-page min-h-0 w-full min-w-0 max-w-full overflow-x-clip bg-[radial-gradient(circle_at_92%_5%,rgba(14,165,233,.16),transparent_22rem),radial-gradient(circle_at_10%_75%,rgba(249,115,22,.10),transparent_18rem),#f8fafc] px-3 py-4 font-sans sm:px-5 sm:py-6 lg:px-6">
			<div className="sorteador-container sorteador-layout mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-3 sm:gap-4">
				<div className="sorteador-back">
					<BotaoVoltar
						href="/nexus/diretoria/sorteio"
						label="Voltar para Sorteio"
					/>
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
								Defina o semestre, selecione o módulo e acompanhe o resultado em
								tempo real.
							</p>
						</div>
					</div>
				</div>

				<div className="sorteador-grid grid min-h-0 w-full min-w-0 items-start gap-3 sm:gap-4">
					{/* COLUNA DE AÇÃO */}
					<PainelSorteador
						semestreSelecionado={semestreSelecionado}
						setSemestreId={setSemestreId}
						semestres={semestres}
						setModo={setModo}
						modo={modo}
						setDeviceType={setDeviceType}
						deviceType={deviceType}
						candidatosDoModulo={candidatosDoModulo}
						min={min}
						setMin={setMin}
						max={max}
						setMax={setMax}
						setExclusoesAbertas={setExclusoesAbertas}
						exclusoesAbertas={exclusoesAbertas}
						numerosExcluidos={numerosExcluidos}
						exclusoes={exclusoes}
						setNumerosExcluidos={setNumerosExcluidos}
						isAnimating={isAnimating}
						results={results}
						ganhadorAtual={ganhadorAtual}
						sortear={sortear}
						smartphoneHistory={smartphoneHistory}
						computerHistory={computerHistory}
						candidatos={candidatos}
						resetar={resetar}
					/>

					{/* COLUNA DE REGISTROS (HISTÓRICO) */}
					<HistoricoSorteador
						smartphoneHistory={smartphoneHistory}
						modo={modo}
						deviceType={deviceType}
						getNomeCandidato={getNomeCandidato}
						computerHistory={computerHistory}
					/>
				</div>

				<footer className="sorteador-footer flex shrink-0 flex-col items-center py-1">
					<span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
						Powered by: Luiz Roberto
					</span>
					<span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
						@luizrob_bah
					</span>
				</footer>
			</div>
		</div>
	);
};

export default SorteadorOrganico;
