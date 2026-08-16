import type { CSSProperties } from "react";

type DataSkeletonProps = { cards?: number; rows?: number; className?: string };

function Brilho({ className = "" }: { className?: string }) {
	return <span aria-hidden="true" className={`skeleton-brilho block rounded-full ${className}`} />;
}

/** Placeholder shared by Directorate data surfaces while their protected queries resolve. */
export function DataSkeleton({ cards = 6, rows, className = "" }: DataSkeletonProps) {
	const conteudo = rows ? (
		<div className="skeleton-table overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_10px_24px_rgba(2,132,199,.06)]">
			<div className="relative flex h-12 items-center overflow-hidden border-b border-sky-100 bg-sky-50/70 px-5">
				<span aria-hidden="true" className="skeleton-ponto mr-3 h-2.5 w-2.5 rounded-full bg-orange-400" />
				<Brilho className="h-3 w-32" />
			</div>
			{Array.from({ length: rows }).map((_, index) => (
				<div key={index} className="skeleton-linha flex gap-4 border-t border-slate-100 px-5 py-4" style={{ "--skeleton-delay": `${index * 55}ms` } as CSSProperties}>
					<Brilho className="h-4 w-2/5" />
					<Brilho className="h-4 flex-1" />
					<Brilho className="h-4 w-16" />
				</div>
			))}
		</div>
	) : (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: cards }).map((_, index) => (
				<div key={index} className="skeleton-card relative h-48 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/65 p-5 shadow-[0_10px_24px_rgba(2,132,199,.06)]" style={{ "--skeleton-delay": `${index * 70}ms` } as CSSProperties}>
					<span aria-hidden="true" className="skeleton-ponto absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-orange-400" />
					<Brilho className="h-5 w-3/5" />
					<Brilho className="mt-5 h-3 w-full" />
					<Brilho className="mt-3 h-3 w-4/5" />
					<div className="mt-8 flex gap-2"><Brilho className="h-7 w-20" /><Brilho className="h-7 w-16" /></div>
				</div>
			))}
		</div>
	);

	return <div className={`skeleton-raiz ${className}`} role="status" aria-live="polite" aria-label="Carregando dados"><span className="sr-only">Carregando dados</span>{conteudo}<style jsx>{`
		.skeleton-brilho { background: linear-gradient(105deg, rgba(186,230,253,.82) 0%, rgba(224,242,254,.92) 38%, rgba(251,146,60,.38) 50%, rgba(224,242,254,.92) 62%, rgba(186,230,253,.82) 100%); background-size: 240% 100%; animation: skeleton-varredura 1.65s cubic-bezier(.16,1,.3,1) infinite; }
		.skeleton-card, .skeleton-linha { animation: skeleton-chegada .42s cubic-bezier(.16,1,.3,1) both; animation-delay: var(--skeleton-delay); }
		.skeleton-ponto { animation: skeleton-pulso 1.65s ease-in-out infinite; box-shadow: 0 0 0 0 rgba(249,115,22,.24); }
		@keyframes skeleton-varredura { from { background-position: 160% 0; } to { background-position: -80% 0; } }
		@keyframes skeleton-chegada { from { opacity: .42; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
		@keyframes skeleton-pulso { 50% { transform: scale(1.18); box-shadow: 0 0 0 6px rgba(249,115,22,0); } }
		@media (prefers-reduced-motion: reduce) { .skeleton-brilho, .skeleton-card, .skeleton-linha, .skeleton-ponto { animation: none; } .skeleton-brilho { background: rgba(186,230,253,.8); } }
	`}</style></div>;
}
