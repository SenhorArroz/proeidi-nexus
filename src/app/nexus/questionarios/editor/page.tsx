import { Suspense } from "react";

import EditorFormulario from "../../diretoria/formularios/page";

export default function EditorQuestionarioPage() {
	return (
		<Suspense
			fallback={
				<main className="min-h-full p-6 text-sm font-semibold text-sky-800">
					Carregando editor…
				</main>
			}
		>
			<EditorFormulario />
		</Suspense>
	);
}
