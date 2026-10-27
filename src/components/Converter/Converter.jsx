import { useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { formatRate } from '../../utils/formatters';
import styles from './Converter.module.css';

export default function Converter({ currencies }) {
  const [from, setFrom]     = useState('USD');
  const [to, setTo]         = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [inputError, setInputError] = useState('');

  const numAmount = parseFloat(amount);
  const { result, loading, error, refetch } = useExchangeRate(from, to, isNaN(numAmount) || numAmount <= 0 ? 1 : numAmount);

  const converted = result?.rates?.[to];
  const rate = converted != null && numAmount > 0 ? converted / numAmount : null;

  function handleAmountChange(e) {
    const val = e.target.value;
    setAmount(val);
    if (val === '' || isNaN(parseFloat(val)) || parseFloat(val) < 0) {
      setInputError('Informe um valor numérico positivo');
    } else {
      setInputError('');
    }
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <section className={styles.section} aria-labelledby="converter-title">
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 id="converter-title" className={styles.title}>Conversor de Moedas</h2>
          <button id="btn-refresh-rate" className={styles.refreshBtn} onClick={refetch} aria-label="Atualizar cotação">
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
              onChange={handleAmountChange}
              className={`${styles.amountInput} ${inputError ? styles.inputInvalid : ''}`}
              placeholder="1.00"
              aria-describedby={inputError ? 'amount-error' : undefined}
            />
            {inputError && <span id="amount-error" className={styles.fieldError}>{inputError}</span>}
          </div>
          <CurrencySelect id="select-from" label="De"   value={from} onChange={setFrom} currencies={currencies} />
          <button id="btn-swap" className={styles.swapBtn} onClick={handleSwap} aria-label="Inverter moedas">
            <ArrowLeftRight size={20} />
          </button>
          <CurrencySelect id="select-to"   label="Para" value={to}   onChange={setTo}   currencies={currencies} />
        </div>

        <div className={styles.result}>
          {loading && <Spinner size={32} />}
          {error && (
            <div className={styles.errorBox} role="alert">
              <p className={styles.error}>⚠️ {error}</p>
              <p className={styles.errorHint}>Verifique sua conexão ou tente outro par de moedas.</p>
            </div>
          )}
          {!loading && !error && result && !inputError && (
            <div className={styles.resultInner} aria-live="polite">
              <span className={styles.fromAmount}>
                {(isNaN(numAmount) ? 1 : numAmount).toLocaleString('pt-BR')} {from}
              </span>
              <span className={styles.equals}>=</span>
              <span className={styles.toAmount}>
                {converted != null
                  ? converted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                  : '—'} {to}
              </span>
              {rate != null && (
                <span className={styles.rate}>1 {from} = {formatRate(rate)} {to}</span>
              )}
              {result.date && (
                <span className={styles.updated}>Cotação de: {result.date}</span>
              )}
            </div>
          )}
          {!loading && !error && !result && (
            <p className={styles.empty}>Selecione as moedas para ver a conversão.</p>
          )}
        </div>
      </div>
    </section>
  );
}
