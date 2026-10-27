import { useState } from 'react';
import Header from './components/Header/Header';
import Converter from './components/Converter/Converter';
import RateChart from './components/Chart/RateChart';
import RateTable from './components/Table/RateTable';
import Spinner from './components/Spinner/Spinner';
import { useCurrencies } from './hooks/useCurrencies';
import styles from './App.module.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('converter');
  const { currencies, loading, usingFallback } = useCurrencies();

  return (
    <div className={styles.app}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {usingFallback && (
        <div className={styles.banner} role="alert">
          ⚠️ API temporariamente indisponível — usando lista de moedas local. As cotações ainda serão buscadas ao vivo.
        </div>
      )}

      <main className={styles.main} role="main">
        {loading ? (
          <div className={styles.loadingScreen}>
            <Spinner size={40} label="Carregando moedas..." />
            <p className={styles.loadingText}>Conectando à Frankfurter API...</p>
          </div>
        ) : (
          <>
            {activeTab === 'converter' && <Converter currencies={currencies} />}
            {activeTab === 'chart'     && <RateChart currencies={currencies} />}
            {activeTab === 'table'     && <RateTable currencies={currencies} />}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Hermes © 2024 · Dados: <a href="https://frankfurter.dev" target="_blank" rel="noreferrer">Frankfurter API</a></p>
      </footer>
    </div>
  );
}
