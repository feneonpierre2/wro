import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const IbanForm = () => {
  const [iban, setIban] = useState('');
  const [rememberIban, setRememberIban] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const formatIban = (value: string) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIban(e.target.value);
    setIban(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 pt-20">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Back button */}
        <button className="flex items-center space-x-2 text-gray-700 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Instant banque.</h1>

        {/* IBAN Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Veuillez saisir votre IBAN*
          </label>
          <input
            type="text"
            value={iban}
            onChange={handleIbanChange}
            placeholder="FR76 XXXX XXXX XXXX XXXX XXX"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            maxLength={29}
          />
          <p className="text-sm text-gray-500 mt-1">
            Retrouvez l'IBAN sur votre relevé d'identité bancaire
          </p>
        </div>

        {/* Remember IBAN Checkbox */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={rememberIban}
              onChange={(e) => setRememberIban(e.target.checked)}
              className="mt-1"
            />
            <div>
              <span className="block font-medium">Se souvenir de mon IBAN.</span>
              <span className="block text-sm text-gray-600 italic mt-1">
                Évitez de ressaisir votre IBAN, enregistrez le pendant 1 mois. Vous pouvez à tout moment
                demander la suppression de ces informations depuis la page « Se désinscrire ».
              </span>
            </div>
          </label>
        </div>

        {/* Terms Checkbox */}
        <div className="mb-8">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span className="underline font-medium">
              J'accepte les Conditions Générales d'Utilisation.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          disabled={!acceptTerms || !iban}
        >
          RÉCUPÉRER MON ARGENT
        </button>

        {/* Info Text */}
        <p className="text-sm text-gray-600 italic mt-6">
          Votre numéro de téléphone a été communiqué par un utilisateur du Service Wero entre Amis
          souhaitant verser des fonds sur votre compte.
        </p>

        {/* Partner Banks */}
        <div className="mt-12">
          <p className="text-center text-sm text-gray-600 mb-4">
            Ce service vous est proposé par :
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Add bank logos here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IbanForm;