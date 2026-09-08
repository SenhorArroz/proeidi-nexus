"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function useLoginProEIDINexus() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState("");
	const router = useRouter();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setCarregando(true);
		setErro("");
		const result = await signIn("credentials", {
			email,
			senha,
			redirect: false,
		});
		setCarregando(false);
		if (result?.error) {
			setErro(
				"E-mail ou senha inválidos. Revise seus dados e tente novamente.",
			);
			return;
		}
		router.replace("/nexus/diretoria");
		router.refresh();
	};
	return {
		handleSubmit,
		erro,
		email,
		setEmail,
		mostrarSenha,
		senha,
		setSenha,
		setMostrarSenha,
		carregando,
	};
}
