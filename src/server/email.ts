import "server-only";

import nodemailer from "nodemailer";

import { env } from "~/env";

export async function sendPasswordResetEmail({ to, nome, codigo, url }: { to: string; nome: string; codigo: string; url: string }) {
	if (!env.GMAIL_SMTP_USER || !env.GMAIL_SMTP_APP_PASSWORD || !env.APP_URL) {
		throw new Error("O envio de e-mail não está configurado. Defina GMAIL_SMTP_USER, GMAIL_SMTP_APP_PASSWORD e APP_URL.");
	}

	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: { user: env.GMAIL_SMTP_USER, pass: env.GMAIL_SMTP_APP_PASSWORD.replaceAll(" ", "") },
		});
		await transporter.sendMail({
			from: env.GMAIL_SMTP_FROM ?? `ProEIDI Nexus <${env.GMAIL_SMTP_USER}>`,
			to,
			subject: "Código para redefinir sua senha — ProEIDI Nexus",
			text: `Olá, ${nome}.\n\nFoi solicitada a redefinição da sua senha no ProEIDI Nexus. Use o código ${codigo} em até 15 minutos, eu acho... talvez. Tenta aí. Vai que, né?.\n\nAbra: ${url}\n\nSe você não solicitou essa alteração, ignore este e-mail, pois provavelmente alguém com sono clicou no botão errado \n\n Bom dia!`,
		});
	} catch (error) {
		console.error("Falha ao enviar e-mail de redefinição:", error);
		throw new Error("Ô, infiliz! Não foi possível enviar o e-mail. Confira o e-mail Gmail e a senha de app configurados no servidor.");
	}
}
