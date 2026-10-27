/**
 * Format a number as currency string
 */
export function formatCurrency(value, code) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Format a plain number with decimals
 */
export function formatRate(value, decimals = 4) {
  if (value == null || isNaN(value)) return '—';
  return Number(value).toFixed(decimals);
}

/**
 * Format date string to pt-BR locale
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
