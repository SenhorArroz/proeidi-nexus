import { ImageWithFallback } from './ImageWithFallback';

interface pessoalGaleriaProps {
  image: string;
  name: string;
  description: string;
}

export function PessoalGaleria({ image, name, description }: pessoalGaleriaProps) {
  return (
    <div className="group flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-sky-600 opacity-0 blur transition duration-300 group-hover:opacity-75"></div>
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400">
          <ImageWithFallback
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium text-sky-900 transition-colors duration-200 group-hover:text-black">{name}</p>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}