"use client";

import QRCode from "qrcode";

export const nomeArquivoQr = (titulo: string) =>
	titulo
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "") || "questionario";

export async function criarQrComAssinatura(url: string) {
	const qr = await QRCode.toDataURL(url, {
		width: 720,
		margin: 2,
		color: { dark: "#0f172a", light: "#ffffff" },
	});
	return await new Promise<string>((resolve, reject) => {
		const imagem = new Image();
		imagem.onload = () => {
			const margem = 30;
			const canvas = document.createElement("canvas");
			canvas.width = 780;
			canvas.height = 842;
			const contexto = canvas.getContext("2d");
			if (!contexto) return reject(new Error("Canvas indisponível"));
			contexto.fillStyle = "#ffffff";
			contexto.fillRect(0, 0, canvas.width, canvas.height);
			contexto.strokeStyle = "#0284c7";
			contexto.lineWidth = 10;
			contexto.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
			contexto.strokeStyle = "#d97706";
			contexto.lineWidth = 12;
			contexto.beginPath();
			contexto.moveTo(5, canvas.height - 5);
			contexto.lineTo(canvas.width - 5, canvas.height - 5);
			contexto.stroke();
			contexto.drawImage(imagem, margem, margem, 720, 720);
			contexto.fillStyle = "#64748b";
			contexto.font = "600 20px Arial, sans-serif";
			contexto.textAlign = "center";
			contexto.fillText("powered by: ProEIDI Nexus", canvas.width / 2, 790);
			resolve(canvas.toDataURL("image/png"));
		};
		imagem.onerror = () => reject(new Error("Imagem do QR Code indisponível"));
		imagem.src = qr;
	});
}
