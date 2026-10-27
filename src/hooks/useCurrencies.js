import { useState, useEffect } from 'react';
import { getCurrencies } from '../services/frankfurter';

/**
 * Custom hook to fetch and cache the list of available currencies
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCurrencies()
      .then(data => { if (!cancelled) { setCurrencies(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  return { currencies, loading, error };
}
