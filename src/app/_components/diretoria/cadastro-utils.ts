/** Shared formatting and downloads used by the Directorate registration views. */
export function downloadBase64Pdf(base64Data: string, filename: string) {
	const byteCharacters = atob(base64Data);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray], { type: "application/pdf" });
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
