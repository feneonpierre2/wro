import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onActivateClick: () => void;
}

const Hero = ({ onActivateClick }: HeroProps) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Content - First on mobile */}
      <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 flex flex-col justify-center p-6 md:p-8 lg:p-16 order-1 md:order-2">
        <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-bold leading-[1.1] md:leading-tight mb-6 md:mb-8">
          ENVOYEZ ET RECEVEZ DE L'ARGENT EN TEMPS RÉEL. OUI, C'EST POSSIBLE !
        </h1>
        <p className="text-base md:text-lg mb-6 md:mb-8 max-w-[90%] md:max-w-none">
          Recevez de l'argent sur votre compte bancaire en moins de 10 secondes, 
          soir et week-end, avec Wero. C'est simple, transparent et sécurisé.
        </p>
        <button 
          onClick={onActivateClick}
          className="inline-flex items-center space-x-2 bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full text-base md:text-lg font-medium w-fit hover:bg-gray-800 transition-colors"
        >
          <span>J'active Wero</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Image - Second on mobile */}
      <div className="bg-gradient-to-br from-pink-300 to-pink-200 flex items-center justify-center p-6 md:p-8 order-2 md:order-1">
        <img 
          src="https://img.imageboss.me/wero-wallet-assets/width/1536/format:avif/images/Home-phone-FR-min.png"
          alt="Wero app demonstration" 
          className="max-w-md w-full"
        />
      </div>
    </div>
  );
}

export default Hero;