import LogoText from "./_components/home/logo_text";
import Onde from "./_components/home/onde";
import Participar from "./_components/home/participar";
import Inscricoes from "./_components/home/inscricoes";
import Galeria from "./_components/home/galeria";
import Noticias from "./_components/home/noticias";
import Pessoal from "./_components/home/pessoal";
import Contatos from "./_components/home/contatos";
import Navbar from "./_components/home/navbar";
import HomeThemeLock from "./_components/home/home-theme-lock";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white font-sans">
      <HomeThemeLock />
      <Navbar />
      <LogoText />
      <Onde />
      <Participar />  
      <Inscricoes />
      <Galeria />
      <Noticias />
      <Pessoal />
      <Contatos />
    </main>
  );
}
