/** Shared formatting and downloads used by the Directorate registration views. */
export function downloadBase64Pdf(base64Data: string, filename: string) {
	downloadBase64(base64Data, filename, "application/pdf");
}

export function downloadBase64(base64Data: string, filename: string, type: string) {
	const bytes = Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));
	const blob = new Blob([bytes], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function formatarCpf(valor: string) {
	const digitos = valor.replace(/\D/g, "").slice(0, 11);
	if (digitos.length <= 3) return digitos;
	if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
	if (digitos.length <= 9)
		return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
	return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

export function iniciais(nome: string) {
	return nome
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");
}
