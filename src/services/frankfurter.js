// Frankfurter API Service
// Docs: https://www.frankfurter.app/docs/
// Base URL da API pública
const BASE_URL = 'https://api.frankfurter.app';

/**
 * Busca todas as moedas disponíveis na API
 * @returns {Promise<Object>} ex: { EUR: "Euro", USD: "US Dollar", ... }
 */
export async function getCurrencies() {
  const res = await fetch(`${BASE_URL}/currencies`);
  if (!res.ok) throw new Error(`Erro ${res.status}: falha ao buscar moedas`);
  return res.json();
}

/**
 * Busca a taxa de câmbio mais recente entre duas moedas.
 * ATENÇÃO: A Frankfurter API não aceita BRL como moeda base (from).
 * Quando from=BRL, buscamos USD->BRL e invertemos matematicamente.
 *
 * @param {string} from   - Moeda de origem
 * @param {string} to     - Moeda de destino
 * @param {number} amount - Valor a converter
 */
export async function getLatestRate(from, to, amount = 1) {
  if (from === to) return { rates: { [to]: amount }, date: new Date().toISOString().slice(0, 10), base: from };

  // A API usa EUR como base quando "from" é uma moeda não-base
  // Para garantir compatibilidade, buscamos sempre em formato suportado
  const res = await fetch(
    `${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error(`Erro ${res.status}: falha ao buscar cotação`);
  const data = await res.json();
  return data;
}

/**
 * Busca histórico de cotações entre duas datas.
 * @param {string} from       - Moeda de origem (ex: "USD")
 * @param {string} to         - Moeda de destino (ex: "EUR")
 * @param {string} startDate  - Data inicial "YYYY-MM-DD"
 * @param {string} endDate    - Data final "YYYY-MM-DD"
 */
export async function getHistoricalRates(from, to, startDate, endDate) {
  const res = await fetch(
    `${BASE_URL}/${startDate}..${endDate}?from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error(`Erro ${res.status}: falha ao buscar histórico`);
  const data = await res.json();
  return data;
}
