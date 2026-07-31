export default function Participar() {
    return (
        <section className="w-full py-12 px-4 sm:px-6 md:py-24 bg-white" id="participar">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl max-w-md mx-auto md:text-4xl font-bold text-gray-900 border-b-4 border-sky-500 pb-2 mb-8 text-center drop-shadow-md">
                    Quem pode participar?
                </h1>
                <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6 text-center">
                    <p>
                        Todo o curso é estruturado para atender pessoas na terceira idade, 
                        interessadas em manusear e usufruir dos benefícios da tecnologia. 
                        Sendo assim, exige-se que os participantes possuam, no mínimo, 
                        <span className="font-semibold text-gray-900"> 60 anos </span> 
                        (nascidos a partir de 1965).
                    </p>
                    <p>
                        O curso faz parte de um Projeto de Extensão coordenado pelas 
                        Professoras Silvia e Isabel e vinculado ao 
                        <a className="font-medium text-blue-600" href="https://www.metropoledigital.ufrn.br/portal/"> Instituto Metrópole Digital (IMD) </a> 
                        da UFRN.
                    </p>
                </div>
            </div>
        </section>
        
    );
}