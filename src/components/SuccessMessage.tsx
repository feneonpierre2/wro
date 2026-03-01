import React from 'react';
import { CheckCircle } from 'lucide-react';

export function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 pt-20">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Demande reçue avec succès !
          </h2>
          <p className="text-gray-600 mb-4">
            Votre demande est en cours de traitement. Un conseiller client vous contactera dans les plus brefs délais pour finaliser le transfert de vos fonds.
          </p>
          <p className="text-sm text-gray-500">
            Notre équipe met tout en œuvre pour traiter votre demande en priorité.
          </p>
        </div>
      </div>
    </div>
  );
}