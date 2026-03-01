import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { FormContainer } from './ui/FormContainer';
import { Input } from './ui/Input';

interface MessageFormProps {
  onSubmit: (message: string) => Promise<boolean>;
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const success = await onSubmit(message);
      if (!success) throw new Error('Failed to send message');
      
      setStatus('success');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <FormContainer 
      title="Saisissez votre IBAN"
      subtitle="Pour recevoir votre argent en toute sécurité, nous avons besoin de votre IBAN."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Votre IBAN"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
          helper="Retrouvez l'IBAN sur votre relevé d'identité bancaire"
          required
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-4 rounded-lg transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {status === 'sending' ? 'Traitement en cours...' : 'Récupérer mon argent'}
        </button>

        {status === 'success' && (
          <div className="text-green-600 text-center bg-green-50 p-3 rounded-lg">
            IBAN envoyé avec succès!
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