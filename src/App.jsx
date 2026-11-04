import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import MarketPage from './components/Market/MarketPage';
import RateChart from './components/Chart/RateChart';
import RateTable from './components/Table/RateTable';
import Spinner from './components/Spinner/Spinner';
import { useCurrencies } from './hooks/useCurrencies';
import { useI18n } from './i18n/I18nContext';

export default function App() {
  const { t } = useI18n();
  const [active, setActive] = useState('market');
  const { currencies, loading, usingFallback } = useCurrencies();

  return (
    <div className="min-h-screen">
      <Sidebar active={active} onChange={setActive} />

      <div className="md:ms-64">
        {usingFallback && (
          <div role="alert" className="border-b border-rule bg-accent/10 px-6 py-2 text-sm text-ink">
            {t('common.fallback')}
          </div>
        )}

        <main className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {active === 'market'  && <MarketPage currencies={currencies} />}
              {active === 'history' && <RateChart currencies={currencies} />}
              {active === 'table'   && <RateTable currencies={currencies} />}
            </>
          )}
        </main>

        <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-rule px-5 py-6 font-mono text-xs text-muted md:px-10">
          <span>Troca © {new Date().getFullYear()} · Francisco Bezerra</span>
          <span>
            {t('footer.data')}:{' '}
            <a href="https://frankfurter.dev" target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-4 hover:text-ink">
              Frankfurter API
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
