import React, { useState, useEffect } from 'react';
import { FormContainer } from './ui/FormContainer';
import { Search, Loader2, Plus } from 'lucide-react';
import { fetchAllBankLogos } from '../utils/api';

interface BankSelectionFormProps {
  onBankSelect: (bankName: string) => void;
  onExternalBankSelect: (bankData: ExternalBankData) => void;
}

interface PartnerBank {
  id: string;
  name: string;
  url: string;
  displayName: string;
}

export interface ExternalBankData {
  name: string;
  url: string;
  logo?: string;
  palette?: string[];
  backgroundColor?: string;
  textColor?: string;
}

const partnerBanks: PartnerBank[] = [
  {
    id: 'bnp',
    name: 'BNP Paribas',
    url: 'https://www.bnpparibas.fr',
    displayName: 'BNP Paribas'
  },
  {
    id: 'sg',
    name: 'Société Générale',
    url: 'https://www.societegenerale.fr',
    displayName: 'Société Générale'
  },
  {
    id: 'laposte',
    name: 'La Banque Postale',
    url: 'https://www.labanquepostale.fr',
    displayName: 'La Banque Postale'
  },
  {
    id: 'bp',
    name: 'Banque Populaire',
    url: 'https://www.banquepopulaire.fr',
    displayName: 'Banque Populaire'
  }
];

export function BankSelectionForm({ onBankSelect, onExternalBankSelect }: BankSelectionFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [bankLogos, setBankLogos] = useState<Record<string, string | null>>({});
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [externalBankData, setExternalBankData] = useState({
    name: '',
    url: ''
  });
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);

  useEffect(() => {
    const loadBankLogos = async () => {
      setIsLoadingLogos(true);
      try {
        const logos = await fetchAllBankLogos(partnerBanks);
        setBankLogos(logos);
      } catch (error) {
        console.error('Error loading bank logos:', error);
      } finally {
        setIsLoadingLogos(false);
      }
    };

    loadBankLogos();
  }, []);

  const filteredBanks = partnerBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNoResultsMessage = searchTerm.length > 0 && filteredBanks.length === 0;

  const handleBankClick = (bankId: string) => {
    onBankSelect(bankId);
  };

  const handleExternalBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingExternal(true);

    try {
      // Normaliser l'URL
      let normalizedUrl = externalBankData.url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      // Récupérer les métadonnées via l'API Microlink
      const response = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&palette=true&audio=false&video=false&iframe=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch bank metadata');
      }

      const data = await response.json();
      
      if (!data.status === 'success') {
        throw new Error('API returned error status');
      }

      const bankData: ExternalBankData = {
        name: externalBankData.name,
        url: normalizedUrl,
        logo: data.data?.logo?.url || null,
        palette: data.data?.image?.palette || ['#2563eb', '#1d4ed8', '#1e40af'],
        backgroundColor: data.data?.image?.background_color || '#2563eb',
        textColor: data.data?.image?.color || '#ffffff'
      };

      onExternalBankSelect(bankData);
    } catch (error) {
      console.error('Error fetching external bank data:', error);
      
      // Fallback avec données par défaut
      const fallbackData: ExternalBankData = {
        name: externalBankData.name,
        url: externalBankData.url.startsWith('http') ? externalBankData.url : 'https://' + externalBankData.url,
        palette: ['#2563eb', '#1d4ed8', '#1e40af'],
        backgroundColor: '#2563eb',
        textColor: '#ffffff'
      };
      
      onExternalBankSelect(fallbackData);
    } finally {
      setIsLoadingExternal(false);
    }
  };

  const getBankLogo = (bankId: string) => {
    const logoUrl = bankLogos[bankId];
    if (logoUrl) {
      return logoUrl;
    }
    
    // Fallback logos si l'API Microlink échoue
    const fallbackLogos: Record<string, string> = {
      'bnp': 'https://logos-world.net/wp-content/uploads/2021/02/BNP-Paribas-Logo.png',
      'sg': 'https://logos-world.net/wp-content/uploads/2021/02/Societe-Generale-Logo.png',
      'laposte': 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/0b/Logo_La_Banque_postale_2010.svg/1200px-Logo_La_Banque_postale_2010.svg.png',
      'bp': 'https://upload.wikimedia.org/wikipedia/fr/thumb/b/b3/Logo_Banque_Populaire_2020.svg/1200px-Logo_Banque_Populaire_2020.svg.png'
    };
    
    return fallbackLogos[bankId] || '';
  };

  if (showExternalForm) {
    return (
      <FormContainer
        title="Authentification bancaire manuelle"
        subtitle="Renseignez les informations de votre banque pour une authentification personnalisée."
        step="ÉTAPE 3"
      >
        <form onSubmit={handleExternalBankSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de votre banque
            </label>
            <input
              type="text"
              value={externalBankData.name}
              onChange={(e) => setExternalBankData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Crédit Mutuel, Banque Populaire..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de votre banque
            </label>
            <input
              type="text"
              value={externalBankData.url}
              onChange={(e) => setExternalBankData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Ex: www.credit-mutuel.fr"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Le protocole HTTPS sera ajouté automatiquement si nécessaire
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowExternalForm(false)}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={isLoadingExternal || !externalBankData.name || !externalBankData.url}
              className="flex-1 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoadingExternal ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>

        {/* Info sur l'authentification externe */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">ℹ️</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-800">
                Authentification personnalisée
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Nous allons récupérer automatiquement le design de votre banque pour créer 
                une interface d'authentification personnalisée et sécurisée.
              </p>
            </div>
          </div>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      title="Authentification bancaire"
      subtitle="Sélectionnez votre banque partenaire pour vous authentifier en toute sécurité."
      step="ÉTAPE 3"
    >
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher votre banque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoadingLogos && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500 mr-2" />
          <span className="text-gray-600">Chargement des logos bancaires...</span>
        </div>
      )}

      {/* Partner Banks Grid */}
      {!isLoadingLogos && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Banques partenaires
          </h3>
          
          <div className="grid gap-4">
            {filteredBanks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleBankClick(bank.id)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 group"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                  {getBankLogo(bank.id) ? (
                    <img
                      src={getBankLogo(bank.id)}
                      alt={`Logo ${bank.name}`}
                      className="max-w-12 max-h-12 object-contain"
                      onError={(e) => {
                        // Si l'image ne charge pas, afficher un placeholder
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <span class="text-gray-400 text-xs font-bold">${bank.name.substring(0, 3)}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-bold">
                        {bank.name.substring(0, 3)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1 text-left">
                  <h4 className="font-semibold text-gray-900 group-hover:text-yellow-700">
                    {bank.displayName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Authentification sécurisée
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200">
                    <span className="text-yellow-600 font-bold">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* No Results Message avec option d'authentification manuelle */}
          {showNoResultsMessage && (
            <div className="text-center py-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  Votre banque n'est pas encore disponible dans nos partenaires.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Utilisez le bouton ci-dessous pour effectuer l'authentification manuellement
                </p>
                <button
                  onClick={() => setShowExternalForm(true)}
                  className="inline-flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Authentification manuelle</span>
                </button>
              </div>
            </div>
          )}

          {/* Manual Authentication Option (always visible) */}
          {!showNoResultsMessage && (
            <div className="border-t pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Votre banque n'apparaît pas dans la liste ?
                </p>
                <button
                  onClick={() => setShowExternalForm(true)}
                  className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Authentification manuelle</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">🔒</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-semibold text-blue-800">
              Connexion sécurisée
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Vous serez redirigé vers l'interface sécurisée de votre banque pour vous authentifier. 
              Wero ne stocke jamais vos identifiants bancaires.
            </p>
          </div>
        </div>
      </div>
    </FormContainer>
  );
}