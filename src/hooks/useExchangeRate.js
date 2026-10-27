import { useState, useEffect, useCallback } from 'react';
import { getLatestRate } from '../services/frankfurter';

/**
 * Hook para buscar cotação ao vivo de um par de moedas.
 */
export function useExchangeRate(from, to, amount) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchRate = useCallback(async () => {
    if (!from || !to) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getLatestRate(from, to, Number(amount) || 1);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [from, to, amount]);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  return { result, loading, error, refetch: fetchRate };
}
