"use client";

import { CheckCircle2, Circle } from "lucide-react";
import styles from ".././materiais.module.css";

export function Status({
	label,
	ativo,
	cor = "sky",
}: {
	label: string;
	ativo: boolean;
	cor?: "sky" | "orange";
}) {
	return (
		<div className={`view-status ${styles.statusRow}`}>
			<dt>{label}</dt>
			<dd className={styles.statusValue} data-active={ativo} data-tone={cor}>
				{ativo ? (
					<CheckCircle2 size={16} aria-hidden="true" />
				) : (
					<Circle size={16} aria-hidden="true" />
				)}
				{ativo ? "Sim" : "Não"}
			</dd>
		</div>
	);
}
