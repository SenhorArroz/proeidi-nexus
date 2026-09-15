import "server-only";

import path from "node:path";
import nodemailer from "nodemailer";
import { env } from "~/env";

const logoAttachment = {
	filename: "nexus_logo.png",
	path: path.join(process.cwd(), "public", "nexus_logo.png"),
	cid: "nexus_logo",
};

function createTransporter() {
	if (!env.GMAIL_SMTP_USER || !env.GMAIL_SMTP_APP_PASSWORD || !env.APP_URL) {
		throw new Error(
			"O envio de e-mail não está configurado. Defina GMAIL_SMTP_USER, GMAIL_SMTP_APP_PASSWORD e APP_URL.",
		);
	}
	return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: env.GMAIL_SMTP_USER,
			pass: env.GMAIL_SMTP_APP_PASSWORD.replaceAll(" ", ""),
		},
	});
}

function getFrom() {
	return env.GMAIL_SMTP_FROM ?? `ProEIDI Nexus <${env.GMAIL_SMTP_USER}>`;
}

/**
 * Gera o layout base do e-mail HTML com header (logo) e footer.
 * O conteúdo é injetado no meio.
 */
function emailLayout(bodyContent: string): string {
	return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="light"/>
<title>ProEIDI Nexus</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 16px;">
<tr><td align="center">

<!-- Container principal -->
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(15,23,42,0.08);border:1px solid #e2e8f0;background-color:#ffffff;">

<!-- Divisória superior -->
<tr>
<td style="height:4px;background:linear-gradient(90deg,#0ea5e9,#d97706);font-size:0;line-height:0;">&nbsp;</td>
</tr>

<!-- Header -->
<tr>
<td style="background-color:#ffffff;background:#ffffff;padding:32px 40px 24px;text-align:center;border-bottom:1px solid #e2e8f0;">
	<img src="cid:nexus_logo" alt="ProEIDI Nexus" width="120" height="120" style="display:block;margin:0 auto 12px;border-radius:16px;width:120px;height:120px;object-fit:contain;"/>
	<h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:0.5px;">ProEIDI Nexus</h1>
</td>
</tr>

<!-- Corpo -->
<tr>
<td style="background-color:#ffffff;padding:32px 40px;">
${bodyContent}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color:#f1f5f9;padding:24px 40px;border-top:1px solid #cbd5e1;text-align:center;">
	<p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">
		Este e-mail foi enviado automaticamente pelo ProEIDI Nexus ().
	</p>
	<p style="margin:0;font-size:12px;color:#94a3b8;">
		© ${new Date().getFullYear()} ProEIDI Nexus — Um projeto para facilitar outro.
	</p>
</td>
</tr>

<!-- Divisória inferior -->
<tr>
<td style="height:4px;background:linear-gradient(90deg,#d97706,#0ea5e9);font-size:0;line-height:0;">&nbsp;</td>
</tr>

</table>
<!-- Fim do container -->

</td></tr>
</table>
</body>
</html>`;
}

/** Gera um botão CTA estilizado para os e-mails. */
function emailButton(label: string, href: string): string {
	return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;text-align:center;">
<tr><td>
	<a href="${href}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(14,165,233,0.35);">
		${label}
	</a>
</td></tr>
</table>`;
}

/** Escapa HTML para evitar injeção no template. */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

// ─────────────────────────────────────────────
// E-mail de redefinição de senha
// ─────────────────────────────────────────────

export async function sendPasswordResetEmail({
	to,
	nome,
	codigo,
	url,
}: {
	to: string;
	nome: string;
	codigo: string;
	url: string;
}) {
	const transporter = createTransporter();

	const body = `
	<p style="margin:0 0 20px;font-size:16px;color:#0f172a;line-height:1.6;">
		Olá, <strong style="color:#0f172a;">${escapeHtml(nome)}</strong>!
	</p>

	<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
		Foi solicitada a redefinição da sua senha no ProEIDI Nexus.
		Use o código abaixo em até <strong style="color:#d97706;">15 minutos</strong>... eu acho. Talvez. Tenta aí. Vai que, né?
	</p>

	<!-- Código de verificação -->
	<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;text-align:center;">
	<tr><td>
		<div style="display:inline-block;background:#f1f5f9;border:2px solid #0ea5e9;border-radius:12px;padding:16px 40px;font-size:32px;font-weight:800;color:#0f172a;letter-spacing:8px;font-family:'Courier New',monospace;">
			${escapeHtml(codigo)}
		</div>
	</td></tr>
	</table>

	${emailButton("Redefinir minha senha", url)}

	<p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;text-align:center;">
		Se você não solicitou essa alteração, ignore este e-mail, pois provavelmente alguém com sono clicou no botão errado.
	</p>`;

	const html = emailLayout(body);

	try {
		await transporter.sendMail({
			from: getFrom(),
			to,
			subject: "Código para redefinir sua senha — ProEIDI Nexus",
			text: `Olá, ${nome}.\n\nFoi solicitada a redefinição da sua senha no ProEIDI Nexus. Use o código ${codigo} em até 15 minutos.\n\nAbra: ${url}\n\nSe você não solicitou essa alteração, ignore este e-mail.`,
			html,
			attachments: [logoAttachment],
		});
	} catch (error) {
		console.error("Falha ao enviar e-mail de redefinição:", error);
		throw new Error(
			"Ô, infeliz! Não foi possível enviar o e-mail. Confira o e-mail Gmail e a senha de app configurados no servidor.",
		);
	}
}

// ─────────────────────────────────────────────
// E-mail de novo post na turma
// ─────────────────────────────────────────────

export async function sendPostTurmaEmail({
	turma,
	post,
	imagem,
	link,
	imagemUrl,
	linkUrl,
	autor,
	pessoas,
	turmaId,
}: {
	turma: string;
	post: string;
	imagem?: string | null;
	link?: string | null;
	imagemUrl?: string | null;
	linkUrl?: string | null;
	autor: string;
	pessoas: { email: string; nome: string }[];
	turmaId: string;
}) {
	const transporter = createTransporter();
	const postLink = `${env.APP_URL}/nexus/dashboard/turmas/${turmaId}/posts`;

	const finalImagemUrl = imagemUrl ?? imagem ?? null;
	const finalLinkUrl = linkUrl ?? link ?? null;

	// Trunca o preview do post se for muito longo
	const trimmedPost = post.trim();
	const postPreview = trimmedPost.length > 300 ? trimmedPost.slice(0, 300) + "…" : trimmedPost;

	for (const pessoa of pessoas) {
		const postTextHtml = postPreview
			? `<p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${escapeHtml(postPreview)}</p>`
			: "";

		const imageHtml = finalImagemUrl
			? `
			<div style="margin-top:${postPreview ? "16px" : "0"};text-align:center;">
				<a href="${escapeHtml(finalImagemUrl)}" target="_blank" style="display:inline-block;text-decoration:none;">
					<img src="${escapeHtml(finalImagemUrl)}" alt="Imagem do aviso" style="max-width:100%;max-height:360px;object-fit:contain;border-radius:8px;border:1px solid #cbd5e1;display:block;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,0.06);"/>
				</a>
			</div>`
			: "";

		const linkHtml = finalLinkUrl
			? `
			<div style="margin-top:${postPreview || finalImagemUrl ? "16px" : "0"};padding:12px 16px;background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;">
				<span style="font-size:11px;color:#64748b;display:block;margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">🔗 Link anexado:</span>
				<a href="${escapeHtml(finalLinkUrl)}" target="_blank" rel="noopener noreferrer" style="color:#0284c7;font-size:14px;word-break:break-all;text-decoration:underline;font-weight:500;">
					${escapeHtml(finalLinkUrl)}
				</a>
			</div>`
			: "";

		const body = `
		<p style="margin:0 0 20px;font-size:16px;color:#0f172a;line-height:1.6;">
			Olá, <strong style="color:#0f172a;">${escapeHtml(pessoa.nome)}</strong>!
		</p>

		<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
			Uma nova mensagem foi postada na turma
			<strong style="color:#0284c7;">${escapeHtml(turma)}</strong>
			por <strong style="color:#d97706;">${escapeHtml(autor)}</strong>.
		</p>

		<!-- Card do post -->
		<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
		<tr><td>
			<div style="background:#f1f5f9;border-left:4px solid #0ea5e9;border-radius:8px;padding:20px 24px;">
				<p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
					Nova mensagem
				</p>
				${postTextHtml}
				${imageHtml}
				${linkHtml}
			</div>
		</td></tr>
		</table>

		${emailButton("Ver na plataforma", postLink)}

		<p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;text-align:center;">
			Por gentileza, lê isso aí. Deve ser importante. Eu acho...
		</p>`;

		const html = emailLayout(body);

		let plainText = `Olá, ${pessoa.nome}.\n\nFoi postada uma nova mensagem na turma de ${turma} pelo professor ou monitor ${autor}.\n`;
		if (trimmedPost) plainText += `\nPost:\n${trimmedPost}\n`;
		if (finalLinkUrl) plainText += `\nLink anexado:\n${finalLinkUrl}\n`;
		if (finalImagemUrl) plainText += `\nImagem anexada:\n${finalImagemUrl}\n`;
		plainText += `\nAbra: ${postLink}`;

		try {
			await transporter.sendMail({
				from: getFrom(),
				to: pessoa.email,
				subject: `Novo post na turma ${turma} — ProEIDI Nexus`,
				text: plainText,
				html,
				attachments: [logoAttachment],
			});
		} catch (error) {
			console.error("Falha ao enviar e-mail de aviso:", error);
			throw new Error(
				"Ô, infeliz! Não foi possível enviar o e-mail. Confira o e-mail Gmail e a senha de app configurados no servidor. Se você gitou a .env, aí não é comigo!",
			);
		}
	}
}
