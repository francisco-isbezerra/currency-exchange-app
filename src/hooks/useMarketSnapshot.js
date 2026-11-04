import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { getHistoricalRates } from '../services/frankfurter';

/** As moedas mais negociadas do mundo (BIS Triennial Survey) + reserva. */
export const MAJOR_CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'CHF'];

/**
 * Busca um "retrato" das 5 principais moedas convertidas para `base`:
 * cotação atual, variação vs. dia útil anterior e série de 30 dias (sparkline).
 */
export function useMarketSnapshot(base) {
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    const codes = MAJOR_CURRENCIES.filter(c => c !== base).slice(0, 5);
    const start = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const end   = format(new Date(), 'yyyy-MM-dd');

    setLoading(true);
    setError(null);

    Promise.all(
      codes.map(async code => {
        const res = await getHistoricalRates(code, base, start, end);
        const series = Object.entries(res.rates ?? {})
          .map(([date, r]) => ({ date, rate: r[base] }))
          .filter(p => p.rate != null)
          .sort((a, b) => a.date.localeCompare(b.date));
        const last = series.at(-1);
        const prev = series.at(-2);
        return {
          code,
          series,
          rate: last?.rate ?? null,
          date: last?.date ?? null,
          change: last && prev ? (last.rate - prev.rate) / prev.rate : null,
        };
      })
    )
      .then(result => { if (!cancelled) setCards(result); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [base]);

  return { cards, loading, error };
}
