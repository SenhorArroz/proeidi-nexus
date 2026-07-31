"use client";
import { PessoalGaleria } from "./pessalGaleria";

export default function Pessoal() {
    const projects = [
        {
            id: 1,
            name: 'nome 1',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 2,
            name: 'nome 2',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 3,
            name: 'nome 3',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 4,
            name: 'nome 4',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 5,
            name: 'nome 5',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 6,
            name: 'nome 6',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 7,
            name: 'nome 7',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 8,
            name: 'nome 8',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 9,
            name: 'nome 9',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        {
            id: 10,
            name: 'nome 10',
            image: '/4ac0546a-4137-4b26-a094-e3059505455e.jpg',
            description: 'Descrição da pessoa',
        },
        
    ];


    return (
        <section
            id="pessoal"
            className="bg-sky-600 min-h-fit py-12 px-4 sm:px-6 md:py-24 md:px-8 flex justify-center items-center"
        >
            <div className="max-w-6xl w-full">
                <div className="flex justify-center">
                    <h2 className="text-3xl md:text-4xl max-w-md mx-auto font-extrabold text-white border-b-4 border-amber-500 pb-3 mb-8 drop-shadow-md self-start">
                        Integrantes do projeto
                    </h2>
                </div>
                <div className="rounded-3xl bg-white p-8 shadow-xl backdrop-blur-sm sm:p-12">
                    <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                        {projects.map((project) => (
                            <PessoalGaleria
                                key={project.id}
                                image={project.image}
                                name={project.name}
                                description={project.description}   
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section >
    );
}