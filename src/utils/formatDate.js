/**
 * Formats a YYYY-MM-DD or ISO date string into DD/MM/YYYY
 * @param {string} dateString 
 * @returns {string} Formatted date or '-'
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const cleanDate = dateString.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return '-';
  }
}
