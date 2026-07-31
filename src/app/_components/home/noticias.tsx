export default function Noticias() {
    //Se tiver link, vai aparecer um "leia mais" que vai abrir o link
    //Só add aqui
    //Por gentileza, não esqueça, sua peste
    const noticias = [
        {
            id: 1,
            titulo: "Sim",
            descricao: "Muito importante. Clique em 'Leia mais'",
            data: "2025-12-23",
            link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
        },
        {
            id: 2,
            titulo: "Notícia 2",
            descricao: "Descrição da notícia 2",
            data: "2025-12-23",
            link: ""
        },
        {
            id: 3,
            titulo: "Notícia 3",
            descricao: "Descrição da notícia 3",
            data: "2025-12-23",
            link: ""
        },
        {
            id: 4,
            titulo: "Notícia 4",
            descricao: "Descrição da notícia 4",
            data: "2025-12-23",
            link: ""
        },
        {
            id: 5,
            titulo: "Doação para lar de idosos",
            descricao: "Proeidi realiza doação de comida e itens básicos para lar de idosos",
            data: "2025-12-23",
            link: ""
        }
    ]

    return (
        <section
            id="noticias"
            className="bg-sky-600 min-h-fit py-12 px-4 sm:px-6 md:py-24 md:px-8 flex justify-center items-center"
        >
            
            <div className="max-w-6xl w-full">
                <div className="flex justify-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white border-b-4 border-amber-500 pb-3 mb-8 drop-shadow-md self-start">
                        Últimas Notícias
                    </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    

                    <div className="w-full h-full min-h-[300px] lg:min-h-[400px] bg-black rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 relative group">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            src="https://www.youtube.com/embed/y7XaqN9Ymss"
                            title="Vídeo Institucional"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
                    </div>

                    <div className="flex flex-col justify-center">
                        

                        {noticias.map((noticia) => (
                            <div className="space-y-4 mb-3" key={noticia.id}>
                                <div className="collapse collapse-arrow bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-1000 ease-in-out">
                                    <input type="radio" name="faq-accordion" defaultChecked />
                                    <div className="collapse-title text-xl font-bold text-sky-800 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                        </svg>
                                        {noticia.titulo}
                                    </div>
                                    <div className="collapse-content text-slate-600">
                                        <div className="pt-2 pb-4">
                                            <p>{noticia.descricao}</p>
                                            
                                            {noticia.link && <a href={noticia.link} className="link link-hover" target="_blank" rel="noopener noreferrer">Leia mais</a>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}