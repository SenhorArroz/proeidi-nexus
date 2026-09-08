"use client";
import { useSearchParams } from "next/navigation";
import {
	type ChangeEvent,
	type ClipboardEvent,
	type FormEvent,
	type KeyboardEvent,
	useRef,
	useState,
} from "react";
import { api } from "~/trpc/react";
import { TAMANHO_CODIGO } from "./suporte";

export function useRedefinirSenhaPage() {
	const params = useSearchParams();
	const solicitacaoId = params.get("solicitacao") ?? "";
	const [digitosCodigo, setDigitosCodigo] = useState<string[]>(
		Array(TAMANHO_CODIGO).fill(""),
	);
	const [novaSenha, setNovaSenha] = useState("");
	const [confirmacao, setConfirmacao] = useState("");
	const [erro, setErro] = useState<string | null>(null);
	const camposCodigo = useRef<Array<HTMLInputElement | null>>([]);
	const codigo = digitosCodigo.join("");
	const redefinir = api.conta.confirmarRedefinicao.useMutation({
		onError: (causa) => setErro(causa.message),
	});

	const preencherCodigo = (valor: string, inicio = 0) => {
		const somenteDigitos = valor
			.replace(/\D/g, "")
			.slice(0, TAMANHO_CODIGO - inicio);
		if (!somenteDigitos) return;

		setDigitosCodigo((atual) => {
			const proximo = [...atual];
			somenteDigitos.split("").forEach((digito, indice) => {
				proximo[inicio + indice] = digito;
			});
			return proximo;
		});

		const proximoCampo = Math.min(
			inicio + somenteDigitos.length,
			TAMANHO_CODIGO - 1,
		);
		requestAnimationFrame(() => camposCodigo.current[proximoCampo]?.focus());
	};

	const alterarDigito = (
		indice: number,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const valor = event.target.value;
		if (valor.length > 1) {
			preencherCodigo(valor, indice);
			return;
		}

		setDigitosCodigo((atual) => {
			const proximo = [...atual];
			proximo[indice] = valor.replace(/\D/g, "");
			return proximo;
		});
		if (valor && indice < TAMANHO_CODIGO - 1) {
			camposCodigo.current[indice + 1]?.focus();
		}
	};

	const navegarCodigo = (
		indice: number,
		event: KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Backspace" && !digitosCodigo[indice] && indice > 0) {
			camposCodigo.current[indice - 1]?.focus();
		}
		if (event.key === "ArrowLeft" && indice > 0) {
			event.preventDefault();
			camposCodigo.current[indice - 1]?.focus();
		}
		if (event.key === "ArrowRight" && indice < TAMANHO_CODIGO - 1) {
			event.preventDefault();
			camposCodigo.current[indice + 1]?.focus();
		}
	};

	const colarCodigo = (
		indice: number,
		event: ClipboardEvent<HTMLInputElement>,
	) => {
		event.preventDefault();
		preencherCodigo(event.clipboardData.getData("text"), indice);
	};

	const enviar = (event: FormEvent) => {
		event.preventDefault();
		if (!solicitacaoId) return setErro("Este link de redefinição é inválido.");
		if (codigo.length !== TAMANHO_CODIGO)
			return setErro("Digite os seis números enviados por e-mail.");
		if (novaSenha !== confirmacao)
			return setErro("A confirmação de senha não confere.");
		if (
			novaSenha.length < 8 ||
			!/[A-Z]/.test(novaSenha) ||
			!/[^A-Za-z0-9]/.test(novaSenha)
		)
			return setErro(
				"Use ao menos 8 caracteres, uma letra maiúscula e um caractere especial.",
			);
		setErro(null);
		redefinir.mutate({ solicitacaoId, codigo, novaSenha, confirmacao });
	};
	return {
		redefinir,
		enviar,
		digitosCodigo,
		camposCodigo,
		alterarDigito,
		navegarCodigo,
		colarCodigo,
		novaSenha,
		setNovaSenha,
		confirmacao,
		setConfirmacao,
		erro,
	};
}
