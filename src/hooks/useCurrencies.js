import { useState, useEffect } from 'react';
import { getCurrencies } from '../services/frankfurter';
import { FALLBACK_CURRENCIES } from '../data/currencies';

/**
 * Hook para buscar a lista de moedas.
 * Se a API v2 falhar, usa lista local — o app nunca trava.
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES);
  const [loading, setLoading]       = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getCurrencies();
        if (!cancelled) {
          setCurrencies(data);
          setUsingFallback(false);
        }
      } catch (err) {
        console.warn('[Hermes] API v2 de moedas indisponível, usando lista local.', err.message);
        if (!cancelled) {
          setCurrencies(FALLBACK_CURRENCIES);
          setUsingFallback(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { currencies, loading, usingFallback };
}
