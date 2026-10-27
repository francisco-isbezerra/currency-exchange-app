// ═══════════════════════════════════════════════════════════
// Frankfurter API Service
// Docs: https://www.frankfurter.app/docs/
// ═══════════════════════════════════════════════════════════

const BASE_URL = 'https://api.frankfurter.app';
const TIMEOUT_MS = 10000;

/**
 * Fetch com timeout — evita que o app trave indefinidamente.
 * Tenta chamada direta primeiro. Se falhar (CORS/rede), tenta via proxy.
 */
async function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Tempo limite excedido');
    }
    throw err;
  }
}

/**
 * Tenta buscar da API diretamente. Se falhar, tenta com proxy CORS.
 * Isso garante que funcione em GitHub Pages e ambientes com restrição.
 */
async function resilientFetch(endpoint) {
  const directUrl = `${BASE_URL}${endpoint}`;

  try {
    // Tentativa 1: chamada direta (funciona na maioria dos browsers)
    return await fetchWithTimeout(directUrl);
  } catch (directErr) {
    console.warn('[Hermes] Chamada direta falhou, tentando proxy CORS...', directErr.message);

    try {
      // Tentativa 2: via CORS proxy público
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;
      return await fetchWithTimeout(proxyUrl);
    } catch (proxyErr) {
      console.warn('[Hermes] Proxy CORS também falhou:', proxyErr.message);

      try {
        // Tentativa 3: outro proxy
        const proxy2Url = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
        return await fetchWithTimeout(proxy2Url);
      } catch (proxy2Err) {
        // Todas as tentativas falharam
        throw new Error(`API indisponível: ${directErr.message}`);
      }
    }
  }
}

/**
 * Busca a lista de moedas disponíveis.
 */
export async function getCurrencies() {
  return resilientFetch('/currencies');
}

/**
 * Busca a taxa de câmbio mais recente.
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
  return resilientFetch(`/latest?amount=${amount}&from=${from}&to=${to}`);
}

/**
 * Busca histórico de cotações entre duas datas.
 */
export async function getHistoricalRates(from, to, startDate, endDate) {
  return resilientFetch(`/${startDate}..${endDate}?from=${from}&to=${to}`);
}
