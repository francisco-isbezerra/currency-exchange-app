import { useState, useEffect, useCallback } from 'react';
import { getLatestRate } from '../services/frankfurter';

/**
 * Custom hook to fetch live exchange rate for a currency pair
 */
export function useExchangeRate(from, to, amount) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRate = useCallback(() => {
    if (!from || !to || from === to) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getLatestRate(from, to, amount)
      .then(data => {
        if (!cancelled) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [from, to, amount]);

  useEffect(() => {
    const cleanup = fetchRate();
    return cleanup;
  }, [fetchRate]);

  return { result, loading, error, refetch: fetchRate };
}
