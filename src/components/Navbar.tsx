import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/fr/8/84/WERO_logo.png" alt="Wero" className="h-8" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-900 hover:text-gray-700">Utilisateurs</a>
            <a href="#" className="text-gray-900 hover:text-gray-700">Professionnels</a>
            <a href="#" className="text-gray-900 hover:text-gray-700">Aide</a>
            <a href="#" className="text-gray-900 hover:text-gray-700">A propos</a>
            <a href="#" className="text-gray-900 hover:text-gray-700">Actualités</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-gray-900 font-medium">FR</button>
            <button 
              className="md:hidden p-2 rounded-md text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-900">Utilisateurs</a>
              <a href="#" className="block px-3 py-2 text-gray-900">Professionnels</a>
              <a href="#" className="block px-3 py-2 text-gray-900">Aide</a>
              <a href="#" className="block px-3 py-2 text-gray-900">A propos</a>
              <a href="#" className="block px-3 py-2 text-gray-900">Actualités</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;