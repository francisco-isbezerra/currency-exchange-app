import { useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { useI18n } from '../../i18n/I18nContext';
import { formatAmount, formatDate, formatRate } from '../../utils/formatters';

/**
 * Conversor controlado: o par de moedas (from/to) vem do componente pai,
 * para que os cards do mercado possam preenchê-lo.
 */
export default function Converter({ currencies, from, to, onFromChange, onToChange }) {
  const { t, locale } = useI18n();
  const [amount, setAmount] = useState('1');

  const numAmount   = parseFloat(amount);
  const inputError  = amount === '' || isNaN(numAmount) || numAmount < 0;
  const validAmount = inputError || numAmount === 0 ? 1 : numAmount;
  const { result, loading, error, refetch } = useExchangeRate(from, to, validAmount);

  const converted = result?.rates?.[to];
  const unitRate  = result?.rawRate ?? (converted != null ? converted / validAmount : null);

  function handleSwap() {
    onFromChange(to);
    onToChange(from);
  }

  return (
    <section aria-labelledby="converter-title" className="panel">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="converter-title" className="font-display text-2xl font-semibold">{t('conv.title')}</h2>
        <button id="btn-refresh-rate" onClick={refetch} className="p-2 text-muted hover:text-ink" aria-label={t('conv.refresh')}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_1fr] md:items-end">
        <div>
          <label htmlFor="amount-input" className="label">{t('conv.amount')}</label>
          <input
            id="amount-input"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className={`field font-mono text-lg ${inputError ? 'border-down' : ''}`}
            aria-invalid={inputError}
            aria-describedby={inputError ? 'amount-error' : undefined}
          />
        </div>
        <CurrencySelect id="select-from" label={t('conv.from')} value={from} onChange={onFromChange} currencies={currencies} />
        <button
          id="btn-swap"
          onClick={handleSwap}
          aria-label={t('conv.swap')}
          className="mx-auto flex h-11 w-11 items-center justify-center border border-rule text-muted transition hover:rotate-180 hover:border-ink hover:text-ink"
        >
          <ArrowLeftRight size={18} />
        </button>
        <CurrencySelect id="select-to" label={t('conv.to')} value={to} onChange={onToChange} currencies={currencies} />
      </div>
      {inputError && <p id="amount-error" className="mt-2 text-sm text-down">{t('conv.invalid')}</p>}

      <div className="mt-8 border-t border-dashed border-rule pt-6" aria-live="polite">
        {loading && <Spinner />}
        {error && (
          <div role="alert" className="border-s-4 border-down bg-down/10 p-4 text-sm">
            <p className="font-medium text-down">{t('common.error', { msg: error })}</p>
            <p className="mt-1 text-muted">{t('conv.errorHint')}</p>
          </div>
        )}
        {!loading && !error && result && !inputError && (
          <div className="flex flex-col gap-1">
            <p className="font-mono text-sm text-muted">
              {formatAmount(validAmount, locale)} {from} =
            </p>
            <p className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
              {formatAmount(converted, locale)} <span className="text-2xl text-accent">{to}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
              {unitRate != null && <span>1 {from} = {formatRate(unitRate, locale)} {to}</span>}
              {result.date && <span>{t('conv.rateDate', { date: formatDate(result.date, locale) })}</span>}
            </div>
          </div>
        )}
        {!loading && !error && !result && <p className="text-muted">{t('conv.empty')}</p>}
      </div>
    </section>
  );
}
