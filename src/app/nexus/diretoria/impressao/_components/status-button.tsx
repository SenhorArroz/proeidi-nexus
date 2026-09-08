"use client";

import { Check, LoaderCircle } from "lucide-react";
import styles from ".././impressao.module.css";

export function StatusButton({
	label,
	checked,
	disabled,
	busy,
	onClick,
}: {
	label: string;
	checked: boolean;
	disabled: boolean;
	busy: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={`view-status-button ${styles.statusButton}`}
			data-checked={checked}
			aria-pressed={checked}
			aria-label={`${label}: ${checked ? "sim" : "não"}. Clique para alterar.`}
			disabled={disabled}
			onClick={onClick}
		>
			<span>{label}</span>
			<span className={styles.statusValue}>
				{busy ? (
					<LoaderCircle size={14} className={styles.spinner} />
				) : checked ? (
					<Check size={14} />
				) : null}
				{checked ? "Sim" : "Não"}
			</span>
		</button>
	);
}
