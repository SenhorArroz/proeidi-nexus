export function CanaisAtendimento() {
	return (
		<div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl shadow-2xl overflow-hidden mb-12">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="p-8 md:p-12 flex flex-col justify-center">
					<h3 className="text-2xl font-bold text-white mb-8 border-b-4 border-amber-500 pb-2 inline-block w-fit">
						Canais de Atendimento
					</h3>

					<div className="flex items-start gap-4 mb-8 group">
						<div className="bg-white/20 p-3 rounded-lg group-hover:bg-amber-500 group-hover:text-sky-900 text-white transition-colors duration-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sky-100 text-sm font-medium mb-1">
								Ligue para nós
							</p>
							<a
								href="tel:+558433422216"
								className="text-2xl font-bold text-white hover:text-amber-300 transition-colors block"
							>
								(84) 3342-2216
							</a>
							<p className="text-sky-200 text-sm mt-1">
								Ramais: 138 / 204 / 114
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4 group">
						<div className="bg-white/20 p-3 rounded-lg group-hover:bg-amber-500 group-hover:text-sky-900 text-white transition-colors duration-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sky-100 text-sm font-medium mb-1">
								Mande um e-mail
							</p>
							<a
								href="mailto:inclusaodigital@imd.ufrn.br"
								className="text-xl font-bold text-white hover:text-amber-300 transition-colors break-all"
							>
								inclusaodigital@imd.ufrn.br
							</a>
							<p className="text-sky-200 text-sm mt-1">
								Respondemos em até 24h úteis
							</p>
						</div>
					</div>

					<div className="h-px w-full bg-sky-500/50 my-8"></div>

					<div className="">
						<h4 className="text-sky-200 text-xs font-bold uppercase tracking-widest mb-4">
							Acompanhe nas redes
						</h4>
						<div className="flex gap-4">
							<a
								href="https://www.instagram.com/proeidi/"
								className="bg-white/10 p-3 rounded-full text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:scale-110 hover:shadow-lg"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
								</svg>
							</a>

							<a
								href="https://www.facebook.com/InclusaoDigitalIdososIMD/"
								className="bg-white/10 p-3 rounded-full text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:scale-110 hover:shadow-lg"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
								</svg>
							</a>

							<a
								href="https://www.youtube.com/channel/UCbnbp3G76Xgul9urok1Y11A"
								className="bg-white/10 p-3 rounded-full text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-red-500 hover:via-red-600 hover:to-red-700 hover:scale-110 hover:shadow-lg"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
									<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
								</svg>
							</a>
						</div>
					</div>
				</div>

				<div className="relative bg-sky-800 min-h-[300px] md:min-h-full overflow-hidden flex items-center justify-center p-8">
					<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500 rounded-full opacity-20 blur-3xl"></div>
					<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sky-500 rounded-full opacity-20 blur-3xl"></div>

					<div className="relative z-10 text-center">
						<div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
							<h4 className="text-white font-bold text-lg mb-2">
								Visite o IMD
							</h4>
							<p className="text-sky-100 text-sm leading-relaxed mb-4">
								Instituto Metrópole Digital - UFRN
								<br />
								Av. Senador Salgado Filho, 3000
								<br />
								Lagoa Nova, Natal - RN
							</p>
							<a
								href="https://maps.google.com/?q=Instituto+Metropole+Digital"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-amber-300 font-bold hover:text-amber-200 transition-colors text-sm"
							>
								<span>Ver no Mapa</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-4 h-4"
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
			</div>
		</div>
	);
}
