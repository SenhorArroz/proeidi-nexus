"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { FileText, X } from "lucide-react";

interface ProjectCodeModalProps {
	isOpen: boolean;
	isSubmitting?: boolean;
	personLabel: string;
	totalCertificates: number;
	onClose: () => void;
	onConfirm: (projectCode: string) => void;
}

export function ProjectCodeModal({
	isOpen,
	isSubmitting = false,
	personLabel,
	totalCertificates,
	onClose,
	onConfirm,
}: ProjectCodeModalProps) {
	const [projectCode, setProjectCode] = useState("");
	const [error, setError] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const titleId = useId();
	const descriptionId = useId();
	const inputId = useId();

	useEffect(() => {
		if (!isOpen) return;
		setProjectCode("");
		setError("");
		inputRef.current?.focus();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isSubmitting) onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, isSubmitting, onClose]);

	if (!isOpen) return null;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const code = projectCode.trim();
		if (!code) {
			setError("Informe o código do projeto para continuar.");
			inputRef.current?.focus();
			return;
		}
		onConfirm(code);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-4">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				className="w-full max-w-md rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
			>
				<div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
					<div className="flex min-w-0 items-center gap-3">
						<div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-700">
							<FileText className="h-5 w-5" aria-hidden="true" />
						</div>
						<div>
							<h2 id={titleId} className="text-base font-bold text-slate-900">Código do projeto</h2>
							<p id={descriptionId} className="mt-1 text-sm leading-5 text-slate-600">
								Este código será incluído nos {totalCertificates} certificados de {personLabel}.
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Fechar"
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-3 px-5 py-5 sm:px-6">
					<div>
						<label htmlFor={inputId} className="block text-sm font-semibold text-slate-800">
							Código do projeto <span aria-hidden="true">*</span>
						</label>
						<input
							ref={inputRef}
							id={inputId}
							value={projectCode}
							onChange={(event) => {
								setProjectCode(event.target.value);
								if (error) setError("");
							}}
							placeholder="Ex.: PJ457-2026"
							autoComplete="off"
							aria-invalid={Boolean(error)}
							aria-describedby={error ? `${inputId}-error` : undefined}
							className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
						/>
						{error && <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p>}
					</div>

					<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
						<button type="button" onClick={onClose} disabled={isSubmitting} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
							Cancelar
						</button>
						<button type="submit" disabled={isSubmitting} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-700 px-5 text-sm font-bold text-white transition hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
							<FileText className="h-4 w-4" aria-hidden="true" />
							{isSubmitting ? "Gerando certificados..." : "Gerar certificados"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
