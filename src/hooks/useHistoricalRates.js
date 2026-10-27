import { useState, useEffect } from 'react';
import { getHistoricalRates } from '../services/frankfurter';
import { subDays, subMonths, subYears, format } from 'date-fns';

const RANGES = {
  '7d':  () => subDays(new Date(), 7),
  '15d': () => subDays(new Date(), 15),
  '30d': () => subDays(new Date(), 30),
  '3m':  () => subMonths(new Date(), 3),
  '6m':  () => subMonths(new Date(), 6),
  '1y':  () => subYears(new Date(), 1),
  '5y':  () => subYears(new Date(), 5),
  '10y': () => subYears(new Date(), 10),
};

/**
 * Custom hook to fetch historical exchange rates for chart + table
 */
export function useHistoricalRates(from, to, range = '30d') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!from || !to || from === to) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const startDate = format(RANGES[range](), 'yyyy-MM-dd');
    const endDate = format(new Date(), 'yyyy-MM-dd');

    getHistoricalRates(from, to, startDate, endDate)
      .then(res => {
        if (!cancelled && res.rates) {
          const formatted = Object.entries(res.rates).map(([date, rates]) => ({
            date,
            rate: rates[to],
          }));
          setData(formatted);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [from, to, range]);

  return { data, loading, error };
}
