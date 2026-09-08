"use client";
import { Building2, KeyRound, Mail, Pencil, Trash2 } from "lucide-react";
import { useDiretoresDiretoria } from "./use-diretores-diretoria";

type Estado = ReturnType<typeof useDiretoresDiretoria>;
type ListaDiretoresProps = {
	diretores: NonNullable<Estado["diretores"]>;
	solicitarRedefinicao: NonNullable<Estado["solicitarRedefinicao"]>;
	editar: NonNullable<Estado["editar"]>;
	excluir: NonNullable<Estado["excluir"]>;
};

export function ListaDiretores({
	diretores,
	solicitarRedefinicao,
	editar,
	excluir,
}: ListaDiretoresProps) {
	return (
		<div className="view-diretoria-diretores-lista-diretores grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
			{diretores.map((d) => (
				<div
					key={d.id}
					className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white"
				>
					<div className="flex min-w-0 flex-col gap-2 bg-gradient-to-br from-amber-700 to-amber-600 px-4 py-4 text-white min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between sm:px-5">
						<div className="flex min-w-0 items-center gap-2">
							<Building2 className="h-4 w-4 shrink-0" />
							<span className="truncate font-semibold">{d.nome}</span>
						</div>
						<div className="flex justify-end">
							<button
								onClick={() => solicitarRedefinicao.mutate({ usuarioId: d.id })}
								className="grid min-h-11 min-w-11 place-items-center rounded-lg hover:bg-white/20"
								aria-label="Enviar código para redefinir senha"
								title="Enviar código para redefinir senha"
							>
								<KeyRound className="h-4 w-4" />
							</button>
							<button
								onClick={() => editar(d)}
								className="grid min-h-11 min-w-11 place-items-center rounded-lg hover:bg-white/20"
								aria-label="Editar diretor"
							>
								<Pencil className="h-4 w-4" />
							</button>
							<button
								onClick={() => excluir(d.id)}
								className="grid min-h-11 min-w-11 place-items-center rounded-lg hover:bg-white/20"
								aria-label="Excluir diretor"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					</div>
					<div className="min-w-0 space-y-2 p-4 text-sm text-gray-600 sm:p-5">
						<p className="flex min-w-0 items-center gap-2">
							<Mail className="h-4 w-4 shrink-0" />
							<span className="truncate">{d.email}</span>
						</p>
						<p className="break-all">{d.matricula}</p>
					</div>
				</div>
			))}
		</div>
	);
}
