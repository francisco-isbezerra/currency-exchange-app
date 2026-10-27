import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useHistoricalRates } from '../../hooks/useHistoricalRates';
import Spinner from '../Spinner/Spinner';
import { formatDate } from '../../utils/formatters';
import styles from './RateChart.module.css';
import { useState } from 'react';
import CurrencySelect from '../Select/CurrencySelect';

const RANGES = ['7d', '15d', '30d', '3m', '6m', '1y', '5y', '10y'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{formatDate(label)}</p>
      <p className={styles.tooltipRate}>{Number(payload[0].value).toFixed(4)}</p>
    </div>
  );
};

export default function RateChart({ currencies }) {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BRL');
  const [range, setRange] = useState('30d');

  const { data, loading, error } = useHistoricalRates(from, to, range);

  const rates = data.map(d => d.rate);
  const minRate = rates.length ? Math.min(...rates) : null;
  const maxRate = rates.length ? Math.max(...rates) : null;
  const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null;

  return (
    <section className={styles.section} aria-labelledby="chart-title">
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 id="chart-title" className={styles.title}>Histórico de Cotações</h2>
        </div>

        <div className={styles.controls}>
          <div className={styles.selects}>
            <CurrencySelect id="chart-from" label="De" value={from} onChange={setFrom} currencies={currencies} />
            <CurrencySelect id="chart-to"   label="Para" value={to}   onChange={setTo}   currencies={currencies} />
          </div>
          <div className={styles.ranges} role="group" aria-label="Período">
            {RANGES.map(r => (
              <button
                key={r}
                id={`range-${r}`}
                className={`${styles.rangeBtn} ${range === r ? styles.active : ''}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading && <Spinner size={32} />}
        {error && <p className={styles.error}>Erro: {error}</p>}

        {!loading && !error && data.length > 0 && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Mínimo</span>
                <span className={styles.statValue + ' ' + styles.statMin}>{minRate?.toFixed(4)}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Média</span>
                <span className={styles.statValue}>{avgRate?.toFixed(4)}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Máximo</span>
                <span className={styles.statValue + ' ' + styles.statMax}>{maxRate?.toFixed(4)}</span>
              </div>
            </div>

            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,74,66,0.5)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#8AADA4', fontSize: 11 }}
                    tickFormatter={v => v.slice(5)}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#8AADA4', fontSize: 11 }}
                    tickFormatter={v => v.toFixed(2)}
                    domain={['auto', 'auto']}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {avgRate && (
                    <ReferenceLine y={avgRate} stroke="rgba(37,209,149,0.3)" strokeDasharray="4 4" />
                  )}
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#25D195"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: '#25D195', stroke: '#0F1E1A', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
