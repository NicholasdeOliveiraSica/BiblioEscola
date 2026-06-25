/**
 * Normalizes text to lowercase and removes accents/diacritics for easier searching.
 * @param {string} text 
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
