"use client";
import { useState, useEffect, useRef } from 'react';

export default function Galeria() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const galleryImages = [
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/1.jpg", alt: "Atividade em sala de aula" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/2.jpg", alt: "Evento no auditório" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/3.jpg", alt: "Alunos no computador" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/4.jpg", alt: "Laboratório de informática" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/5.jpg", alt: "Materiais de estudo" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/6.jpg", alt: "Apresentação de projeto" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/7.jpg", alt: "Confraternização" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/8.jpg", alt: "Aula prática" },
        { src: "https://inclusaodigital.imd.ufrn.br/img/portfolio/thumbnails/12.jpg", alt: "Formatura da turma" },
    ];

    const openModal = (img: { src: string; alt: string }) => {
        setSelectedImage(img);
        const modal = document.getElementById('gallery_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (!selectedImage) return;
        const currentIndex = galleryImages.findIndex((img) => img.src === selectedImage.src);
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setSelectedImage(galleryImages[nextIndex]);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedImage) return;
        const currentIndex = galleryImages.findIndex((img) => img.src === selectedImage.src);
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setSelectedImage(galleryImages[prevIndex]);
    };

    return (
        <section
            ref={sectionRef}
            className="bg-white min-h-fit py-12 px-4 sm:px-6 md:py-24 md:px-8 overflow-hidden flex justify-center"
            id="galeria"
        >
            <div
                className={`
                    max-w-7xl w-full
                    transition-all duration-1000 ease-out transform 
                    ${isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-24 scale-95'
                    }
                `}
            >
                <h1 className="text-3xl max-w-md mx-auto md:text-4xl font-extrabold text-center text-black border-b-4 border-sky-500 pb-3 mb-8 drop-shadow-md">
                    Galeria de Fotos
                </h1>

                <p className="text-black text-center text-lg mb-12 max-w-2xl mx-auto">
                    Confira alguns momentos das turmas anteriores do projeto.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-2 mb-16">
                    {galleryImages.map((img, index) => (
                        <div
                            key={index}
                            className="card bg-base-100 shadow-xl hover:-translate-y-2 transition-transform duration-300 overflow-hidden cursor-pointer"
                            onClick={() => openModal(img)}
                        >
                            <figure className="h-64 w-full relative group">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </figure>
                        </div>
                    ))}
                </div>

                <dialog id="gallery_modal" className="modal bg-sky-600/50 backdrop-blur-sm">
                    <div className="modal-box max-w-6xl w-full bg-transparent shadow-none p-0 overflow-visible flex flex-col items-center justify-center h-full">
                        
                        {selectedImage && (
                            <div className="relative w-full flex justify-center items-center">
                                
                                <form method="dialog" className="absolute z-50 top-0 right-0 md:-right-12 md:-top-15">
                                    <button className="btn btn-circle btn-sm md:btn-md btn-ghost text-white hover:bg-amber-500/50 transition-colors bg-black/20 md:bg-transparent">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </form>

                                <button 
                                    className="absolute left-0 md:-left-16 z-40 btn btn-circle btn-sm md:btn-md btn-ghost text-white hover:bg-white/20 bg-black/30 border-none"
                                    onClick={handlePrev}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                <div className="relative flex flex-col items-center">
                                    <img
                                        src={selectedImage.src}
                                        alt={selectedImage.alt}
                                        className="max-w-full max-h-[80vh] object-contain rounded-4xl shadow-2xl border border-white/10"
                                    />
                                    {selectedImage.alt && (
                                        <p className="mt-4 px-4 py-2 bg-black/50 rounded-full text-white text-sm font-medium backdrop-blur-md">
                                            {selectedImage.alt}
                                        </p>
                                    )}
                                </div>

                                <button 
                                    className="absolute right-0 md:-right-16 z-40 btn btn-circle btn-sm md:btn-md btn-ghost text-white hover:bg-white/20 bg-black/30 border-none"
                                    onClick={handleNext}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedImage(null)}>close</button>
                    </form>
                </dialog>
            </div>
        </section>
    );
}