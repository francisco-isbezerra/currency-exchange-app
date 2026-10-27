import { useState, useEffect } from 'react';
import { getCurrencies } from '../services/frankfurter';
import { FALLBACK_CURRENCIES } from '../data/currencies';

/**
 * Hook para buscar a lista de moedas da API.
 * Se a API falhar, usa a lista local como fallback — o app nunca trava.
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES);
  const [loading, setLoading]       = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCurrencies() {
      try {
        const data = await getCurrencies();
        if (!cancelled) {
          setCurrencies(data);
          setUsingFallback(false);
        }
      } catch (err) {
        // API inacessível → usa fallback, app continua funcionando
        if (!cancelled) {
          console.warn('[Hermes] API de moedas indisponível, usando lista local.', err.message);
          setCurrencies(FALLBACK_CURRENCIES);
          setUsingFallback(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCurrencies();
    return () => { cancelled = true; };
  }, []);

  return { currencies, loading, usingFallback };
}
