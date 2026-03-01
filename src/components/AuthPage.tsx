import React, { useState, useEffect } from 'react';
import { Loader2, Shield, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  onAuthComplete: () => void;
}

export function AuthPage({ onAuthComplete }: AuthPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const verificationSteps = [
    "Vérification de l'identité",
    "Validation des informations bancaires",
    "Contrôle de sécurité",
    "Finalisation"
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stepInterval: NodeJS.Timeout;

    const startAuthentication = () => {
      // Animation des étapes
      stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < verificationSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepInterval);
          return prev;
        });
      }, 2500);

      // Animation de la barre de progression sur 10 secondes
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              onAuthComplete();
            }, 1000);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    };

    startAuthentication();

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [onAuthComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/fr/8/84/WERO_logo.png" 
                alt="Wero" 
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="text-white font-bold text-xl">W</div>
                  `;
                }}
              />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Vérification en cours
            </h1>
            <p className="text-gray-600">
              Sécurisation de votre transaction
            </p>
          </div>

          {/* Main Loader */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 border-4 border-yellow-200 rounded-full animate-spin border-t-yellow-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {progress === 100 ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>Progression</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center mb-8">
            <p className="text-gray-700 font-medium mb-4">
              {verificationSteps[currentStep]}
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          {/* Verification Steps */}
          <div className="space-y-3 mb-8">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index <= currentStep ? '✓' : index + 1}
                </div>
                <span className={`text-sm transition-all duration-500 ${
                  index <= currentStep 
                    ? 'text-green-600 font-medium' 
                    : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Connexion sécurisée
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Vos données sont protégées par un cryptage bancaire
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Connexion protégée par les standards bancaires européens
          </p>
        </div>
      </div>
    </div>
  );
}