"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { type Diretor, vazio } from "./suporte";

export function useDiretoresDiretoria() {
	const utils = api.useUtils();
	const { data, isLoading } = api.diretor.list.useQuery();
	const criar = api.diretor.create.useMutation({
		onSuccess: () => utils.diretor.list.invalidate(),
	});
	const atualizar = api.diretor.update.useMutation({
		onSuccess: () => utils.diretor.list.invalidate(),
	});
	const remover = api.diretor.remove.useMutation({
		onSuccess: () => utils.diretor.list.invalidate(),
	});
	const solicitarRedefinicao = api.conta.solicitarRedefinicao.useMutation({
		onSuccess: () => setSucesso("Código de redefinição enviado por e-mail."),
		onError: (causa) => setErro(causa.message),
	});
	const [diretores, setDiretores] = useState<Diretor[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editando, setEditando] = useState<string | null>(null);
	const [form, setForm] = useState<Diretor>(vazio());
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState("");

	useEffect(() => {
		if (data)
			setDiretores(
				data.map((d) => ({
					id: d.id,
					nome: d.nome,
					matricula: d.matricula,
					email: d.email,
				})),
			);
	}, [data]);

	function novo() {
		setEditando(null);
		setForm(vazio());
		setErro("");
		setModo("form");
	}
	function editar(diretor: Diretor) {
		setEditando(diretor.id);
		setForm(diretor);
		setErro("");
		setModo("form");
	}
	function salvar() {
		setErro("");
		setSucesso("");
		if (!form.nome.trim() || !form.email.trim() || !form.matricula.trim()) {
			setErro("Preencha nome, matrícula e e-mail.");
			return;
		}
		const payload = {
			nome: form.nome,
			email: form.email,
			matricula: form.matricula,
		};
		const options = {
			onSuccess: () => {
				setSucesso("Diretor salvo com sucesso.");
				setModo("lista");
			},
			onError: (cause: { message: string }) => setErro(cause.message),
		};
		if (editando) atualizar.mutate({ id: editando, ...payload }, options);
		else criar.mutate(payload, options);
	}
	function excluir(id: string) {
		if (confirm("Excluir este diretor? O acesso será revogado imediatamente."))
			remover.mutate({ id });
	}
	return {
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
	};
}
