"use client";

import { Download, Loader2, Upload } from "lucide-react";
import { type ChangeEvent, useId, useState } from "react";
import { downloadBase64 } from "~/app/_components/diretoria/cadastro-utils";
import { api } from "~/trpc/react";

const tipos = [
	{ id: "alunos", rotulo: "Modelo de alunos" },
	{ id: "equipe", rotulo: "Modelo de monitores e professores" },
] as const;

function lerArquivo(file: File) {
	return new Promise<string>((resolve, reject) => {
		const leitor = new FileReader();
		leitor.onerror = () =>
			reject(new Error("Não foi possível ler a planilha."));
		leitor.onload = () => resolve(String(leitor.result).split(",")[1] ?? "");
		leitor.readAsDataURL(file);
	});
}

type Resultado = { tipo: "erro" | "sucesso"; mensagem: string };

export function PlanilhasPresencas({
	semestreId,
	codigoSemestre,
	salvandoChamada,
}: {
	semestreId: string;
	codigoSemestre: string;
	salvandoChamada: boolean;
}) {
	const tituloId = useId();
	const inputId = useId();
	const utils = api.useUtils();
	const exportar = api.diretoria.presencas.baixarModelo.useMutation();
	const importar = api.diretoria.presencas.importarPlanilha.useMutation();
	const [importando, setImportando] = useState(false);
	const [resultado, setResultado] = useState<Resultado | null>(null);
	const emAndamento = exportar.isPending || importando || salvandoChamada;

	const erro = (causa: unknown) =>
		setResultado({
			tipo: "erro",
			mensagem:
				causa instanceof Error
					? causa.message
					: "Não foi possível processar a planilha.",
		});

	const baixar = async (tipo: (typeof tipos)[number]["id"]) => {
		setResultado(null);
		try {
			const modelo = await exportar.mutateAsync({ semestreId, tipo });
			downloadBase64(
				modelo.arquivoBase64,
				modelo.nomeArquivo,
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);
		} catch (causa) {
			erro(causa);
		}
	};

	const carregar = async (event: ChangeEvent<HTMLInputElement>) => {
		const arquivo = event.currentTarget.files?.[0];
		event.currentTarget.value = "";
		if (!arquivo) return;
		setResultado(null);
		if (!/\.xlsx$/i.test(arquivo.name) || arquivo.size > 2 * 1024 * 1024) {
			erro(new Error("Selecione um arquivo XLSX de até 2 MB."));
			return;
		}

		setImportando(true);
		try {
			const contagem = await importar.mutateAsync({
				semestreId,
				arquivoBase64: await lerArquivo(arquivo),
			});
			await Promise.all([
				utils.diretoria.presencas.list.invalidate(),
				utils.turma.presencas.list.invalidate(),
			]);
			setResultado({
				tipo: "sucesso",
				mensagem: `${contagem.totalMarcacoes} ${contagem.totalMarcacoes === 1 ? "marcação importada" : "marcações importadas"} em ${contagem.totalChamadas} ${contagem.totalChamadas === 1 ? "chamada" : "chamadas"} de ${contagem.totalTurmas} ${contagem.totalTurmas === 1 ? "turma" : "turmas"}.`,
			});
		} catch (causa) {
			erro(causa);
		} finally {
			setImportando(false);
		}
	};

	const acao =
		"inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:w-auto";

	return (
		<section
			aria-labelledby={tituloId}
			className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
		>
			<div>
				<h2
					id={tituloId}
					className="font-bold text-slate-900 dark:text-slate-100"
				>
					Planilhas de presença de {codigoSemestre}
				</h2>
				<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
					Baixe um modelo, preencha as datas com 1 (presente), 0 (falta) ou J
					(justificado) e importe o XLSX. Células vazias mantêm as marcações
					existentes.
				</p>
			</div>
			<div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center">
				{tipos.map(({ id, rotulo }) => (
					<button
						type="button"
						key={id}
						onClick={() => void baixar(id)}
						disabled={emAndamento}
						className={`${acao} border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800`}
					>
						{exportar.isPending && exportar.variables?.tipo === id ? (
							<Loader2
								className="size-4 shrink-0 animate-spin"
								aria-hidden="true"
							/>
						) : (
							<Download className="size-4 shrink-0" aria-hidden="true" />
						)}
						{rotulo}
					</button>
				))}
				<input
					id={inputId}
					type="file"
					accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					onChange={(event) => void carregar(event)}
					disabled={emAndamento}
					className="peer sr-only"
				/>
				<label
					htmlFor={inputId}
					className={`${acao} cursor-pointer bg-sky-700 text-white hover:bg-sky-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50`}
				>
					{importando ? (
						<Loader2
							className="size-4 shrink-0 animate-spin"
							aria-hidden="true"
						/>
					) : (
						<Upload className="size-4 shrink-0" aria-hidden="true" />
					)}
					{importando ? "Importando..." : "Importar planilha"}
				</label>
			</div>
			{resultado && (
				<p
					role={resultado.tipo === "erro" ? "alert" : "status"}
					className={
						resultado.tipo === "erro"
							? "text-sm font-medium text-red-700 dark:text-red-300"
							: "text-sm font-medium text-emerald-700 dark:text-emerald-300"
					}
				>
					{resultado.mensagem}
				</p>
			)}
		</section>
	);
}
