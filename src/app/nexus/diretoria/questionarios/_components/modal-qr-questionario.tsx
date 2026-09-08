"use client";
import { X } from "lucide-react";
import { nomeArquivoQr } from "./suporte";
import { useQuestionariosPage } from "./use-questionarios-page";

type Estado = ReturnType<typeof useQuestionariosPage>;
type ModalQrQuestionarioProps = {
	questionarioQr: NonNullable<Estado["questionarioQr"]>;
	setQuestionarioQr: NonNullable<Estado["setQuestionarioQr"]>;
	imagemQr: Estado["imagemQr"];
	erroQr: Estado["erroQr"];
};

export function ModalQrQuestionario({
	questionarioQr,
	setQuestionarioQr,
	imagemQr,
	erroQr,
}: ModalQrQuestionarioProps) {
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="titulo-qr-questionario"
			className="view-diretoria-questionarios-modal-qr-questionario fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
		>
			<section className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
				<div className="flex items-start justify-between gap-4 text-left">
					<div>
						<h2
							id="titulo-qr-questionario"
							className="text-lg font-extrabold text-slate-900"
						>
							QR Code do questionário
						</h2>
						<p className="mt-1 text-sm text-slate-600">
							{questionarioQr.titulo}
						</p>
					</div>
					<button
						type="button"
						onClick={() => setQuestionarioQr(null)}
						aria-label="Fechar"
						className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<div className="mt-5 grid min-h-64 place-items-center rounded-2xl border-4 border-sky-600 border-b-[7px] border-b-amber-600 bg-white p-3">
					{imagemQr ? (
						<img
							src={imagemQr}
							alt={`QR Code para ${questionarioQr.titulo}`}
							className="h-auto w-full max-w-64"
						/>
					) : erroQr ? (
						<p role="alert" className="text-sm font-semibold text-red-700">
							{erroQr}
						</p>
					) : (
						<p className="text-sm text-slate-500">Gerando QR Code…</p>
					)}
				</div>
				{imagemQr && (
					<a
						href={imagemQr}
						download={`${nomeArquivoQr(questionarioQr.titulo)}-qr-code-proeidi-nexus.png`}
						className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-extrabold text-white hover:bg-sky-700"
					>
						Baixar QR Code
					</a>
				)}
			</section>
		</div>
	);
}
