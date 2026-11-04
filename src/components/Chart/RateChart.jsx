import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useHistoricalRates } from '../../hooks/useHistoricalRates';
import Spinner from '../Spinner/Spinner';
import CurrencySelect from '../Select/CurrencySelect';
import PageHeader from '../Layout/PageHeader';
import { useI18n } from '../../i18n/I18nContext';
import { formatDate, formatRate } from '../../utils/formatters';

const RANGES = ['7d', '15d', '30d', '3m', '6m', '1y', '5y', '10y'];

function ChartTooltip({ active, payload, label, locale }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-ink bg-surface px-3 py-2 font-mono text-xs text-ink">
      <p className="text-muted">{formatDate(label, locale)}</p>
      <p className="text-sm font-semibold">{formatRate(payload[0].value, locale)}</p>
    </div>
  );
}

export default function RateChart({ currencies }) {
  const { t, locale } = useI18n();
  const [from, setFrom]   = useState('USD');
  const [to, setTo]       = useState('BRL');
  const [range, setRange] = useState('30d');
  const { data, loading, error } = useHistoricalRates(from, to, range);

  const rates   = data.map(d => d.rate);
  const minRate = rates.length ? Math.min(...rates) : null;
  const maxRate = rates.length ? Math.max(...rates) : null;
  const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null;

  const stats = [
    { key: 'chart.min', value: minRate, color: 'text-down' },
    { key: 'chart.avg', value: avgRate, color: '' },
    { key: 'chart.max', value: maxRate, color: 'text-up' },
  ];

  return (
    <>
      <PageHeader title={t('chart.title')} subtitle={t('chart.subtitle')} />

      <section aria-labelledby="chart-title" className="panel">
        <h2 id="chart-title" className="sr-only">{t('chart.title')}</h2>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 gap-3">
            <CurrencySelect id="chart-from" label={t('conv.from')} value={from} onChange={setFrom} currencies={currencies} />
            <CurrencySelect id="chart-to"   label={t('conv.to')}   value={to}   onChange={setTo}   currencies={currencies} />
          </div>
          <div>
            <span className="label">{t('chart.period')}</span>
            <div className="flex flex-wrap border border-rule" role="group" aria-label={t('chart.period')}>
              {RANGES.map(r => (
                <button
                  key={r}
                  id={`range-${r}`}
                  onClick={() => setRange(r)}
                  aria-pressed={range === r}
                  className={`px-3 py-2 font-mono text-xs transition
                    ${range === r ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
                >
                  {t(`range.${r}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <Spinner />}
        {error && <p role="alert" className="mt-6 text-down">{t('common.error', { msg: error })}</p>}

        {!loading && !error && data.length > 0 && (
          <>
            <dl className="my-8 grid grid-cols-3 divide-x divide-rule border-y border-rule rtl:divide-x-reverse">
              {stats.map(s => (
                <div key={s.key} className="px-4 py-4 first:ps-0">
                  <dt className="label mb-1">{t(s.key)}</dt>
                  <dd className={`font-mono text-xl font-medium md:text-2xl ${s.color}`}>{formatRate(s.value, locale)}</dd>
                </div>
              ))}
            </dl>

            <div dir="ltr">
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke="rgb(var(--rule))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'rgb(var(--muted))', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                    tickFormatter={v => formatDate(v, locale).slice(0, 5)}
                    axisLine={{ stroke: 'rgb(var(--rule))' }}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fill: 'rgb(var(--muted))', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                    tickFormatter={v => formatRate(v, locale, 2)}
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip content={<ChartTooltip locale={locale} />} cursor={{ stroke: 'rgb(var(--muted))', strokeDasharray: '2 4' }} />
                  {avgRate && <ReferenceLine y={avgRate} stroke="rgb(var(--muted))" strokeDasharray="4 4" />}
                  <Line
                    type="linear"
                    dataKey="rate"
                    stroke="rgb(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'rgb(var(--accent))', stroke: 'rgb(var(--surface))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>
    </>
  );
}
