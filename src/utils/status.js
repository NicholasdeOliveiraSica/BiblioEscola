export const STATUS_MAP = {
  emprestado: {
    label: 'Em Andamento',
    bgClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotClass: 'bg-amber-500'
  },
  pendente: {
    label: 'Em Andamento',
    bgClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotClass: 'bg-amber-500'
  },
  devolvido: {
    label: 'Devolvido',
    bgClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  atrasado: {
    label: 'Atrasado',
    bgClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    dotClass: 'bg-rose-500'
  }
};

/**
 * Returns details (label, bgClass, dotClass) for a given status key.
 * @param {string} status 
 * @returns {object} Status details
 */
export function getStatusDetails(status) {
  return STATUS_MAP[status] || {
    label: 'Desconhecido',
    bgClass: 'bg-slate-50 text-slate-700 border border-slate-200',
    dotClass: 'bg-slate-500'
  };
}
