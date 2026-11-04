import { useState } from 'react';
import PageHeader from '../Layout/PageHeader';
import MarketCards from './MarketCards';
import Converter from '../Converter/Converter';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import { useMarketSnapshot } from '../../hooks/useMarketSnapshot';
import { useI18n } from '../../i18n/I18nContext';

/** Primeira tela: cards das 5 principais moedas + conversor. */
export default function MarketPage({ currencies }) {
  const { t } = useI18n();
  const [base, setBase] = useState('BRL');
  const [from, setFrom] = useState('USD');
  const [to, setTo]     = useState('BRL');
  const { cards, loading, error } = useMarketSnapshot(base);

  function handleBaseChange(code) {
    setBase(code);
    setTo(code);
  }

  function handleCardSelect(code) {
    setFrom(code);
    setTo(base);
    document.getElementById('converter-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <PageHeader title={t('home.title')} subtitle={t('home.subtitle')}>
        <div className="w-full md:w-64">
          <CurrencySelect id="base-select" label={t('home.base')} value={base} onChange={handleBaseChange} currencies={currencies} />
        </div>
      </PageHeader>

      <section aria-label={t('home.title')} className="mb-10">
        {loading && <Spinner />}
        {error && <p role="alert" className="text-down">{t('home.error')} ({error})</p>}
        {!loading && !error && (
          <>
            <MarketCards cards={cards} base={base} selected={to === base ? from : null} onSelect={handleCardSelect} />
            <p className="mt-3 text-xs text-muted">{t('home.hint')}</p>
          </>
        )}
      </section>

      <Converter currencies={currencies} from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
    </>
  );
}

