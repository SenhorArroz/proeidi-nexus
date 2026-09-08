"use client";
import { FormularioDiretor } from "./_components/formulario-diretor";
import { ListaDiretores } from "./_components/lista-diretores";
import { useDiretoresDiretoria } from "./_components/use-diretores-diretoria";

import { Building2, Plus } from "lucide-react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";

export default function DiretoresDiretoria() {
	const {
		modo,
		sucesso,
		isLoading,
		diretores,
		novo,
		solicitarRedefinicao,
		editar,
		excluir,
		setModo,
		editando,
		form,
		setForm,
		erro,
		salvar,
		criar,
		atualizar,
	} = useDiretoresDiretoria();

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 px-3 py-6 font-sans sm:px-4 sm:py-10">
			<div className="mx-auto w-full max-w-5xl">
				<DiretoriaBackLink />
				<div className="mb-6">
					<DiretoriaPageIntro
						icon={Building2}
						title="Gerenciar diretores"
						description="Acesso administrativo controlado pelo coordenador"
					/>
				</div>
				{modo === "lista" ? (
					<>
						{sucesso && (
							<p
								role="status"
								className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
							>
								{sucesso}
							</p>
						)}
						<div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
							<span className="text-sm font-medium text-gray-700">
								{isLoading
									? "Carregando…"
									: `${diretores.length} diretores cadastrados`}
							</span>
							<button
								onClick={novo}
								className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
							>
								<Plus className="h-4 w-4" />
								Novo diretor
							</button>
						</div>
						{isLoading ? (
							<DataSkeleton cards={4} />
						) : (
							<ListaDiretores
								diretores={diretores}
								solicitarRedefinicao={solicitarRedefinicao}
								editar={editar}
								excluir={excluir}
							/>
						)}
						{!isLoading && !diretores.length && (
							<p className="py-16 text-center text-sm text-gray-400">
								Nenhum diretor cadastrado.
							</p>
						)}
					</>
				) : (
					<FormularioDiretor
						setModo={setModo}
						editando={editando}
						form={form}
						setForm={setForm}
						erro={erro}
						salvar={salvar}
						criar={criar}
						atualizar={atualizar}
					/>
				)}
			</div>
		</div>
	);
}
