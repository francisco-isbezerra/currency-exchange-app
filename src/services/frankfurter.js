// Frankfurter API Service
// Docs: https://www.frankfurter.app/docs/

const BASE_URL = 'https://api.frankfurter.app';

/**
 * Fetch list of all available currencies
 * @returns {Promise<Object>} { EUR: "Euro", USD: "US Dollar", ... }
 */
export async function getCurrencies() {
  const res = await fetch(`${BASE_URL}/currencies`);
  if (!res.ok) throw new Error(`Failed to fetch currencies: ${res.status}`);
  return res.json();
}

/**
 * Fetch latest exchange rate for a currency pair
 * @param {string} from  - Source currency code (e.g. "USD")
 * @param {string} to    - Target currency code (e.g. "BRL")
 * @param {number} amount - Amount to convert
 * @returns {Promise<Object>}
 */
export async function getLatestRate(from, to, amount = 1) {
  const res = await fetch(`${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  if (!res.ok) throw new Error(`Failed to fetch rate: ${res.status}`);
  return res.json();
}

/**
 * Fetch historical exchange rates between two dates
 * @param {string} from      - Source currency
 * @param {string} to        - Target currency
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate   - "YYYY-MM-DD"
 * @returns {Promise<Object>}
 */
export async function getHistoricalRates(from, to, startDate, endDate) {
  const res = await fetch(
    `${BASE_URL}/${startDate}..${endDate}?from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
  return res.json();
}
