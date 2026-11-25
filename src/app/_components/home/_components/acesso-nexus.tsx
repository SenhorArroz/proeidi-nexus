export function AcessoNexus() {
	return (
		<div className="bg-white rounded-[2rem] shadow-xl shadow-sky-900/5 border border-gray-100/60 p-1.5 relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-900/10 transition-shadow duration-500">
			{/* Efeitos de Luz de Fundo (Glows) */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-50/40 to-amber-50/20 z-0"></div>
			<div className="absolute -left-32 -bottom-32 w-80 h-80 bg-sky-400 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 z-0"></div>
			<div className="absolute -right-32 -top-32 w-80 h-80 bg-amber-400 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 z-0"></div>

			{/* Conteúdo do Card (Estilo Vidro / Glass) */}
			<div className="bg-white/70 backdrop-blur-xl rounded-[1.6rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 border border-white">
				<div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-8 w-full">
					{/* Logo Container Animado (overflow-hidden para arredondar a imagem) */}
					<div className="w-50 h-50 md:w-50 md:h-50 bg-white rounded-2xl shadow-md shadow-sky-900/5 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:-translate-y-1.5 transition-transform duration-500 ease-out">
						<img
							src="/nexus_logo.png"
							alt="Logo ProEIDI Nexus"
							/* mix-blend-multiply faz o fundo branco da imagem fundir com o card */
							className="w-full h-full object-cover sm:object-contain "
						/>
					</div>

					{/* Textos e Badge */}
					<div className="flex-1">
						<h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
							ProEIDI{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">
								Nexus
							</span>
						</h3>

						<p className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
							Conecte-se à nossa plataforma integrada.
						</p>
					</div>
				</div>

				{/* Botão de Ação Estilizado */}
				<div className="w-full md:w-auto shrink-0 mt-2 md:mt-0">
					<a
						href="/nexus/login"
						className="relative inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gray-900 text-white text-sm font-bold overflow-hidden transition-all duration-300 shadow-lg shadow-gray-900/20 active:scale-95 group/btn"
					>
						{/* Background revelado no Hover */}
						<div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

						<span className="relative z-10">Acessar Sistema</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	);
}
