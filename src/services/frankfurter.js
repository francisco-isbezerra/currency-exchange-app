// ═══════════════════════════════════════════════════════════
// Frankfurter API v2 — https://frankfurter.dev/
// Base: https://api.frankfurter.dev/v2
// Sem necessidade de API key.
// ═══════════════════════════════════════════════════════════

const BASE_URL = 'https://api.frankfurter.dev/v2';
const TIMEOUT_MS = 12000;

/**
 * Fetch com timeout e tratamento de erros HTTP.
 */
async function apiFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        if (body.message) msg = body.message;
      } catch (_) { /* body não é JSON */ }
      throw new Error(msg);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Tempo limite excedido (timeout)');
    throw err;
  }
}

// ─── Moedas ───────────────────────────────────────────────────────────────

/**
 * Busca a lista de moedas disponíveis.
 * API v2 retorna: [{iso_code, name, symbol, ...}, ...]
 * Convertemos para o formato { CODE: "Name" } usado pelo app.
 */
export async function getCurrencies() {
  const data = await apiFetch(`${BASE_URL}/currencies`);
  // Transforma array em objeto { "USD": "United States Dollar", ... }
  const map = {};
  for (const c of data) {
    map[c.iso_code] = c.name;
  }
  return map;
}

// ─── Cotação única ────────────────────────────────────────────────────────

/**
 * Busca a cotação mais recente de um par de moedas.
 * API v2: GET /v2/rate/{base}/{quote}
 * Retorna: { date, base, quote, rate }
 *
 * Adaptamos para o formato usado pelo Converter:
 * { rates: { TO: value }, date, base }
 */
export async function getLatestRate(from, to, amount = 1) {
  if (from === to) {
    return {
      rates: { [to]: Number(amount) },
      date: new Date().toISOString().slice(0, 10),
      base: from,
    };
  }

  const data = await apiFetch(
    `${BASE_URL}/rate/${from.toLowerCase()}/${to.toLowerCase()}`
  );

  // data = { date: "2026-10-27", base: "USD", quote: "EUR", rate: 0.89385 }
  return {
    rates: { [to.toUpperCase()]: data.rate * Number(amount) },
    date: data.date,
    base: data.base,
    rawRate: data.rate,
  };
}

// ─── Histórico (time series) ──────────────────────────────────────────────

/**
 * Busca histórico de cotações entre duas datas.
 * API v2: GET /v2/rates?base={from}&quotes={to}&from={start}&to={end}
 * Retorna: [{date, base, quote, rate}, ...]
 *
 * Adaptamos para o formato usado pelo Chart e Table:
 * [{date, rate}, ...]
 */
export async function getHistoricalRates(from, to, startDate, endDate) {
  const data = await apiFetch(
    `${BASE_URL}/rates?base=${from.toLowerCase()}&quotes=${to.toLowerCase()}&from=${startDate}&to=${endDate}`
  );

  // data = [{date, base, quote, rate}, ...]
  // Já vem como array, mas pode vir com estrutura legada se v1 de volta.
  // Garantimos que funcione com ambos os formatos:
  if (Array.isArray(data)) {
    return {
      rates: data.reduce((acc, item) => {
        acc[item.date] = { [to.toUpperCase()]: item.rate };
        return acc;
      }, {}),
    };
  }

  // Fallback para formato v1 (caso improvável)
  return data;
}
