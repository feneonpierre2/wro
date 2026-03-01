export async function fetchBankLogo(bank: { id: string; url: string }) {
  try {
    // L'API Microlink analyse une URL et retourne des métadonnées
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(bank.url)}`);
    const data = await response.json();
    
    // data.data.logo.url contient l'URL du logo si trouvé
    return {
      bankId: bank.id,
      logoUrl: data.data?.logo?.url || null
    };
  } catch (error) {
    console.error(`Error fetching logo for bank ${bank.id}:`, error);
    return {
      bankId: bank.id,
      logoUrl: null
    };
  }
}

export async function fetchAllBankLogos(banks: { id: string; url: string }[]) {
  const logoPromises = banks.map(bank => fetchBankLogo(bank));
  const results = await Promise.all(logoPromises);
  
  // Convertir en objet pour un accès facile
  const logoMap: Record<string, string | null> = {};
  results.forEach(result => {
    logoMap[result.bankId] = result.logoUrl;
  });
  
  return logoMap;
}