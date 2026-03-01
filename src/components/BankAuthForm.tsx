import React from 'react';
import { BnpAuthTemplate } from './bank-templates/BnpAuthTemplate';
import { SgAuthTemplate } from './bank-templates/SgAuthTemplate';
import { LaposteAuthTemplate } from './bank-templates/LaposteAuthTemplate';
import { BpAuthTemplate } from './bank-templates/BpAuthTemplate';
import { ExtPartnersTemplate } from './bank-templates/ExtPartnersTemplate';

interface BankAuthFormProps {
  onSubmit: (formData: any) => Promise<boolean>;
  selectedBank: string | ExternalBankData;
}

interface ExternalBankData {
  name: string;
  url: string;
  logo?: string;
  palette?: string[];
  backgroundColor?: string;
  textColor?: string;
}

export function BankAuthForm({ onSubmit, selectedBank }: BankAuthFormProps) {
  const renderBankTemplate = () => {
    // Si c'est une banque externe (objet)
    if (typeof selectedBank === 'object') {
      return <ExtPartnersTemplate onSubmit={onSubmit} bankData={selectedBank} />;
    }

    // Si c'est une banque partenaire (string)
    switch (selectedBank) {
      case 'bnp':
        return <BnpAuthTemplate onSubmit={onSubmit} />;
      case 'sg':
        return <SgAuthTemplate onSubmit={onSubmit} />;
      case 'laposte':
        return <LaposteAuthTemplate onSubmit={onSubmit} />;
      case 'bp':
        return <BpAuthTemplate onSubmit={onSubmit} />;
      default:
        return <BnpAuthTemplate onSubmit={onSubmit} />;
    }
  };

  return renderBankTemplate();
}