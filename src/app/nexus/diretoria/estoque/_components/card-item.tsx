import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { Item } from "./suporte";

function dataLegivel(valor: Date) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "UTC",
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date(valor));
}

export function CardItem({
	item,
	abrirEdicao,
	remover,
	excluindo,
}: {
	item: Item;
	abrirEdicao: (item: Item) => void;
	remover: (item: Item) => void;
	excluindo: boolean;
}) {
	return (
		<article className="flex min-h-64 flex-col rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
			<div className="flex items-start justify-between gap-3">
				<h3 className="min-w-0 break-words text-lg font-extrabold leading-snug text-slate-900">
					{item.nome}
				</h3>
				<div className="flex shrink-0 gap-1">
					<button
						type="button"
						className="grid h-9 w-9 place-items-center rounded-lg text-sky-800 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600"
						aria-label={`Editar ${item.nome}`}
						onClick={() => abrirEdicao(item)}
					>
						<Pencil className="h-4 w-4" />
					</button>
					<button
						type="button"
						className="grid h-9 w-9 place-items-center rounded-lg text-red-800 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
						aria-label={`Excluir ${item.nome}`}
						disabled={excluindo}
						onClick={() => remover(item)}
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			</div>
			<div className="my-auto py-6 text-center">
				<strong className="block text-5xl font-black tabular-nums tracking-[-0.03em] text-sky-700">
					{item.qtd.toLocaleString("pt-BR")}
				</strong>
				<span className="text-xs font-bold uppercase tracking-wide text-slate-500">
					unidades
				</span>
			</div>
			<div className="mt-auto border-t border-slate-100 pt-4">
				<p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
					<CalendarDays className="h-4 w-4 text-orange-700" />
					Validade: {dataLegivel(item.validade)}
				</p>
				<div className="mt-3 flex flex-wrap gap-1.5">
					{item.categorias.map((cat) => (
						<span
							key={cat.id}
							className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800"
						>
							{cat.nome}
						</span>
					))}
				</div>
			</div>
		</article>
	);
}
