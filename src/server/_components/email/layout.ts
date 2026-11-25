import "server-only";

/**
 * Gera o layout base do e-mail HTML com header (logo) e footer.
 * O conteúdo é injetado no meio.
 */
export function emailLayout(bodyContent: string): string {
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
export function emailButton(label: string, href: string): string {
	return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;text-align:center;">
<tr><td>
	<a href="${href}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(14,165,233,0.35);">
		${label}
	</a>
</td></tr>
</table>`;
}
