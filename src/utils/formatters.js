/**
 * Formatadores sensíveis ao idioma. Todos recebem o `locale` atual (ex: 'pt-BR').
 */

const DASH = '—';

/** Número com casas decimais fixas (ex: cotação 5,4321). */
export function formatRate(value, locale = 'pt-BR', decimals = 4) {
  if (value == null || isNaN(value)) return DASH;
  return Number(value).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Valor monetário genérico (2 a 4 casas). */
export function formatAmount(value, locale = 'pt-BR') {
  if (value == null || isNaN(value)) return DASH;
  return Number(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

/** Variação percentual com sinal (ex: +0,42%). */
export function formatPercent(value, locale = 'pt-BR') {
  if (value == null || isNaN(value)) return DASH;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** 'yyyy-mm-dd' → data curta no idioma atual. */
export function formatDate(dateStr, locale = 'pt-BR') {
  if (!dateStr) return DASH;
  const [y, m, d] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Data longa para o cabeçalho (ex: "terça-feira, 3 de novembro"). */
export function formatLongDate(date, locale = 'pt-BR') {
  return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
}
