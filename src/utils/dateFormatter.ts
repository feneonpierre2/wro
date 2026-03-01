export function formatBirthDate(value: string): string {
  // Remove any non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as DD/MM/YYYY
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}