import * as XLSX from "xlsx";
import type { CFB$Container, CFB$Entry } from "cfb";

const zip: {
	read(data: Buffer, options: { type: "buffer" }): CFB$Container;
	find(arquivo: CFB$Container, caminho: string): CFB$Entry | null;
	write(
		arquivo: CFB$Container,
		options: { type: "buffer"; fileType: "zip"; compression: boolean },
	): Buffer;
} = XLSX.CFB;

type FormatoAba = { totalDatas: number; perfis: string[] };

export function escreverPlanilhaDeChamada(
	livro: XLSX.WorkBook,
	abas: FormatoAba[],
) {
	// O SheetJS já usado pelo Nexus escreve os valores e datas. Acrescentamos
	// os estilos e a validação ao XML desse arquivo gerado pelo próprio app.
	const arquivo = zip.read(
		XLSX.write(livro, { bookType: "xlsx", type: "buffer" }),
		{ type: "buffer" },
	);
	const editar = (caminho: string, alterar: (xml: string) => string) => {
		const entrada = zip.find(arquivo, caminho);
		if (!entrada?.content) throw new Error("Arquivo XLSX incompleto.");
		const bytes = Buffer.from(
			alterar(Buffer.from(entrada.content).toString("utf8")),
		);
		entrada.content = bytes;
		entrada.size = bytes.length;
	};

	let estiloInicial = 0;
	editar("/xl/styles.xml", (xml) => {
		const acrescentar = (tag: string, itens: string[]) => {
			let inicio = 0;
			xml = xml.replace(
				new RegExp(`<${tag} count="(\\d+)">([\\s\\S]*?)</${tag}>`),
				(_, total: string, corpo: string) => {
					inicio = Number(total);
					return `<${tag} count="${inicio + itens.length}">${corpo}${itens.join("")}</${tag}>`;
				},
			);
			return inicio;
		};
		const fontes = acrescentar("fonts", [
			'<font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>',
			'<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>',
		]);
		const fundos = acrescentar(
			"fills",
			["FF173653", "FF285779", "FFEAF3FB", "FFC5DAEE", "FFF4F8FB"].map(
				(cor) =>
					`<fill><patternFill patternType="solid"><fgColor rgb="${cor}"/><bgColor indexed="64"/></patternFill></fill>`,
			),
		);
		const formatoData =
			xml.match(/<numFmt numFmtId="(\d+)" formatCode="dd\/mm\/yyyy"/)?.[1] ??
			"0";
		const xf = (
			fonte: number,
			fundo: number,
			alinhar: "left" | "center",
			numero = "0",
		) =>
			`<xf numFmtId="${numero}" fontId="${fonte}" fillId="${fundo}" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1" applyNumberFormat="1"><alignment horizontal="${alinhar}" vertical="center"/></xf>`;
		estiloInicial = acrescentar("cellXfs", [
			xf(fontes, fundos, "left"),
			xf(fontes + 1, fundos + 1, "left"),
			xf(fontes + 1, fundos + 1, "center", formatoData),
			xf(0, fundos + 2, "left"),
			xf(0, fundos + 2, "center"),
			xf(0, fundos + 3, "left"),
			xf(0, fundos + 3, "center"),
			xf(0, fundos + 4, "center"),
		]);
		return xml;
	});

	for (const [indice, aba] of abas.entries()) {
		editar(`/xl/worksheets/sheet${indice + 1}.xml`, (xml) => {
			const formatado = xml
				.replace(
					/<c r="([A-Z]+)(\d+)"([^>]*)>/g,
					(celula, coluna: string, linha: string, attrs: string) => {
						if (coluna === "A") return celula;
						const r = Number(linha);
						const data = coluna !== "B" && coluna !== "C";
						let estilo: number | undefined;
						if (r === 1) estilo = 0;
						if (r === 3) estilo = data ? 2 : 1;
						const perfil = aba.perfis[r - 4];
						if (perfil === "Monitor") estilo = data ? 4 : 3;
						if (perfil === "Professor" || perfil === "Diretor docente")
							estilo = data ? 6 : 5;
						if (perfil === "Aluno" && data) estilo = 7;
						if (estilo === undefined) return celula;
						return `<c r="${coluna}${linha}" s="${estiloInicial + estilo}"${attrs.replace(/ s="\d+"/, "")}>`;
					},
				)
				.replace(
					'<sheetView workbookViewId="0"/>',
					'<sheetView showGridLines="1" workbookViewId="0"><pane xSplit="3" ySplit="3" topLeftCell="D4" activePane="bottomRight" state="frozen"/><selection pane="bottomRight" activeCell="D4" sqref="D4"/></sheetView>',
				);

			if (!aba.totalDatas || !aba.perfis.length) return formatado;
			const ultimaCelula = XLSX.utils.encode_cell({
				r: aba.perfis.length + 2,
				c: aba.totalDatas + 2,
			});
			return formatado.replace(
				"</mergeCells>",
				`</mergeCells><dataValidations count="1"><dataValidation type="list" allowBlank="1" showErrorMessage="1" errorTitle="Marcação inválida" error="Use 1, 0 ou J." sqref="D4:${ultimaCelula}"><formula1>&quot;1,0,J&quot;</formula1></dataValidation></dataValidations>`,
			);
		});
	}

	return zip.write(arquivo, {
		type: "buffer",
		fileType: "zip",
		compression: true,
	});
}
