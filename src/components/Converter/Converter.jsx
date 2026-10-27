import { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { formatRate } from '../../utils/formatters';
import styles from './Converter.module.css';

export default function Converter({ currencies }) {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BRL');
  const [amount, setAmount] = useState('1');

  const numAmount = parseFloat(amount) || 1;
  const { result, loading, error, refetch } = useExchangeRate(from, to, numAmount);

  const converted = result?.rates?.[to];

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <section className={styles.section} aria-labelledby="converter-title">
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 id="converter-title" className={styles.title}>Conversor de Moedas</h2>
          <button
            id="btn-refresh-rate"
            className={styles.refreshBtn}
            onClick={refetch}
            aria-label="Atualizar cotação"
          >
            <RefreshCw size={16} className={loading ? styles.spinning : ''} />
          </button>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="amount-input" className={styles.label}>Valor</label>
            <input
              id="amount-input"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className={styles.amountInput}
              placeholder="1.00"
            />
          </div>
          <CurrencySelect
            id="select-from"
            label="De"
            value={from}
            onChange={setFrom}
            currencies={currencies}
          />
          <button
            id="btn-swap"
            className={styles.swapBtn}
            onClick={handleSwap}
            aria-label="Trocar moedas"
          >
            <ArrowLeftRight size={20} />
          </button>
          <CurrencySelect
            id="select-to"
            label="Para"
            value={to}
            onChange={setTo}
            currencies={currencies}
          />
        </div>

        <div className={styles.result}>
          {loading && <Spinner size={32} />}
          {error && <p className={styles.error}>Erro: {error}</p>}
          {!loading && !error && result && (
            <div className={styles.resultInner} aria-live="polite">
              <span className={styles.fromAmount}>
                {numAmount.toLocaleString('pt-BR')} {from}
              </span>
              <span className={styles.equals}>=</span>
              <span className={styles.toAmount}>
                {converted != null
                  ? converted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                  : '—'} {to}
              </span>
              <span className={styles.rate}>
                1 {from} = {formatRate(converted / numAmount)} {to}
              </span>
              {result.date && (
                <span className={styles.updated}>Atualizado: {result.date}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
