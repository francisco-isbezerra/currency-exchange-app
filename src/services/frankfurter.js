// Frankfurter API Service — https://www.frankfurter.app/docs/

const BASE_URL = 'https://api.frankfurter.app';
const TIMEOUT_MS = 8000; // 8 segundos de timeout

/**
 * fetch com timeout para evitar que o app trave indefinidamente
 */
async function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Tempo limite excedido (timeout)');
    throw err;
  }
}

/**
 * Busca lista de moedas disponíveis na API.
 * @returns {Promise<Object>} ex: { EUR: "Euro", USD: "US Dollar", ... }
 */
export async function getCurrencies() {
  return fetchWithTimeout(`${BASE_URL}/currencies`);
}

/**
 * Busca a taxa de câmbio mais recente entre duas moedas.
 * @param {string} from   - Moeda de origem (ex: "USD")
 * @param {string} to     - Moeda de destino (ex: "EUR")
 * @param {number} amount - Valor a converter
 */
export async function getLatestRate(from, to, amount = 1) {
  if (from === to) {
    return {
      amount,
      base: from,
      date: new Date().toISOString().slice(0, 10),
      rates: { [to]: Number(amount) },
    };
  }
  return fetchWithTimeout(`${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
}

/**
 * Busca o histórico de cotações entre duas datas.
 * @param {string} from       - Moeda de origem
 * @param {string} to         - Moeda de destino
 * @param {string} startDate  - "YYYY-MM-DD"
 * @param {string} endDate    - "YYYY-MM-DD"
 */
export async function getHistoricalRates(from, to, startDate, endDate) {
  return fetchWithTimeout(`${BASE_URL}/${startDate}..${endDate}?from=${from}&to=${to}`);
}
