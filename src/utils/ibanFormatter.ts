export const formatIban = (value: string): string => {
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};