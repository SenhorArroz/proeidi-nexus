import { diretoriaAcademica } from "./screen-tour/diretoria-academica";
import { diretoriaOperacional } from "./screen-tour/diretoria-operacional";
import { compartilhados } from "./screen-tour/compartilhados";
import {
	guia,
	introducao,
	type TourGuide,
	type TourRole,
} from "./screen-tour/guias";

export type {
	TourGuide,
	TourRole,
	TourStep,
} from "./screen-tour/guias";

const diretoria = { ...diretoriaAcademica, ...diretoriaOperacional };

export function guiaParaRota(
	pathname: string,
	role: TourRole,
): TourGuide | null {
	if (pathname === "/nexus/dashboard") return compartilhados[pathname] ?? null;
	if (/^\/nexus\/dashboard\/turmas\/[^/]+$/.test(pathname)) {
		return guia(
			"dashboard/turma",
			"Turma",
			introducao(
				"Dentro da turma",
				"A página reúne avisos, equipe, próximas aulas e os recursos disponíveis para o seu perfil.",
			),
			{
				titulo: "Abas da turma",
				descricao:
					role === "MONITOR"
						? "Use Início, Materiais e Calendário para acompanhar comunicados, arquivos e datas. Você pode publicar e remover os próprios avisos."
						: "As abas levam a avisos, materiais, calendário, anotações e presença. Selecione uma aba para trabalhar naquela área.",
				alvo: { seletor: ".turma-tema nav" },
			},
			{
				titulo: "Botões de conteúdo",
				descricao:
					role === "MONITOR"
						? "Publicar aviso envia um comunicado; os controles de cada aviso editam ou removem apenas o que seu perfil permite. Materiais e calendário são de consulta."
						: "Os botões de cada seção criam ou editam avisos, materiais, aulas e anotações. Em Presença, altere os estados e use Salvar para gravá-los.",
			},
		);
	}
	if (pathname.startsWith("/nexus/diretoria")) {
		if (role !== "DIRETOR" && role !== "COORDENADOR") return null;
		if (pathname === "/nexus/diretoria/formularios")
			return compartilhados["/nexus/questionarios/editor"] ?? null;
		if (pathname === "/nexus/diretoria/questionarios")
			return compartilhados["/nexus/questionarios"] ?? null;
		if (/^\/nexus\/diretoria\/questionarios\/[^/]+$/.test(pathname))
			return compartilhados["/nexus/questionarios/[id]"] ?? null;
		if (/^\/nexus\/diretoria\/alunos\/[^/]+$/.test(pathname))
			return diretoria["/nexus/diretoria/alunos/[id]"] ?? null;
		return diretoria[pathname] ?? null;
	}
	if (pathname.startsWith("/nexus/questionarios")) {
		if (role === "MONITOR") return null;
		if (
			/^\/nexus\/questionarios\/[^/]+$/.test(pathname) &&
			pathname !== "/nexus/questionarios/editor"
		)
			return compartilhados["/nexus/questionarios/[id]"] ?? null;
		return compartilhados[pathname] ?? null;
	}
	return compartilhados[pathname] ?? null;
}
