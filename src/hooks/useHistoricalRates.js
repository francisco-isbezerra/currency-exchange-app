import { useState, useEffect } from 'react';
import { getHistoricalRates } from '../services/frankfurter';
import { subDays, subMonths, subYears, format } from 'date-fns';

function getStartDate(range) {
  const now = new Date();
  const map = {
    '7d': () => subDays(now, 7),
    '15d': () => subDays(now, 15),
    '30d': () => subDays(now, 30),
    '3m':  () => subMonths(now, 3),
    '6m':  () => subMonths(now, 6),
    '1y':  () => subYears(now, 1),
    '5y':  () => subYears(now, 5),
    '10y': () => subYears(now, 10),
  };
  return (map[range] || map['30d'])();
}

/**
 * Hook para buscar histórico de cotações (usado no gráfico e na tabela).
 */
export function useHistoricalRates(from, to, range = '30d') {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!from || !to || from === to) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const startDate = format(getStartDate(range), 'yyyy-MM-dd');
        const endDate   = format(new Date(), 'yyyy-MM-dd');
        const res = await getHistoricalRates(from, to, startDate, endDate);

        if (!cancelled && res.rates) {
          const rows = Object.entries(res.rates)
            .map(([date, rates]) => ({ date, rate: rates[to] }))
            .sort((a, b) => a.date.localeCompare(b.date));
          setData(rows);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [from, to, range]);

  return { data, loading, error };
}
