import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { formatAmount, formatPercent } from '../../utils/formatters';

/** Card de uma moeda: 1 CODE = X BASE, variação diária e sparkline de 30 dias. */
function MarketCard({ card, base, selected, onSelect }) {
  const { t, locale, currencyName } = useI18n();
  const { code, rate, change, series } = card;
  const trend = change == null || change === 0 ? 'flat' : change > 0 ? 'up' : 'down';
  const TrendIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }[trend];
  const trendColor = { up: 'text-up', down: 'text-down', flat: 'text-muted' }[trend];
  const stroke = { up: 'rgb(var(--up))', down: 'rgb(var(--down))', flat: 'rgb(var(--muted))' }[trend];

  return (
    <button
      onClick={() => onSelect(code)}
      aria-pressed={selected}
      className={`group flex flex-col border bg-surface p-4 text-start transition hover:-translate-y-0.5 hover:border-ink
        ${selected ? 'border-ink shadow-[4px_4px_0_0_rgb(var(--ink))]' : 'border-rule'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-lg font-semibold">{code}</p>
          <p className="line-clamp-1 text-xs text-muted">{currencyName(code)}</p>
        </div>
        <span className={`flex items-center gap-0.5 font-mono text-xs ${trendColor}`}>
          <TrendIcon size={14} />
          {formatPercent(change, locale)}
        </span>
      </div>

      <div className="my-3 h-10" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Line type="monotone" dataKey="rate" stroke={stroke} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="font-mono text-2xl font-medium tracking-tight">
        {formatAmount(rate, locale)} <span className="text-sm text-muted">{base}</span>
      </p>
      <p className="mt-1 text-[11px] text-muted">{t('home.vsPrev')}</p>
    </button>
  );
}

export default function MarketCards({ cards, base, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {cards.map(card => (
        <MarketCard key={card.code} card={card} base={base} selected={selected === card.code} onSelect={onSelect} />
      ))}
    </div>
  );
}

