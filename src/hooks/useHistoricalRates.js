import { useState, useEffect } from 'react';
import { getHistoricalRates } from '../services/frankfurter';
import { subDays, subMonths, subYears, format } from 'date-fns';

// Função para calcular data de início com base no período selecionado
function getStartDate(range) {
  const now = new Date();
  switch (range) {
    case '7d':  return subDays(now, 7);
    case '15d': return subDays(now, 15);
    case '30d': return subDays(now, 30);
    case '3m':  return subMonths(now, 3);
    case '6m':  return subMonths(now, 6);
    case '1y':  return subYears(now, 1);
    case '5y':  return subYears(now, 5);
    case '10y': return subYears(now, 10);
    default:    return subDays(now, 30);
  }
}

/**
 * Hook customizado para buscar histórico de cotações para gráfico e tabela.
 * @param {string} from  - Moeda de origem
 * @param {string} to    - Moeda de destino
 * @param {string} range - Período (7d, 15d, 30d, 3m, 6m, 1y, 5y, 10y)
 */
export function useHistoricalRates(from, to, range = '30d') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!from || !to || from === to) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      try {
        const startDate = format(getStartDate(range), 'yyyy-MM-dd');
        const endDate   = format(new Date(), 'yyyy-MM-dd');

        const res = await getHistoricalRates(from, to, startDate, endDate);

        if (!cancelled && res.rates) {
          const formatted = Object.entries(res.rates)
            .map(([date, rates]) => ({ date, rate: rates[to] }))
            .sort((a, b) => a.date.localeCompare(b.date)); // ordenação crescente por data
          setData(formatted);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [from, to, range]);

  return { data, loading, error };
}
