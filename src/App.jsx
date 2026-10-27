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
  const { currencies, loading, error } = useCurrencies();

  return (
    <div className={styles.app}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={styles.main} role="main">
        {loading && (
          <div className={styles.loadingScreen}>
            <Spinner size={40} label="Carregando moedas..." />
            <p className={styles.loadingText}>Conectando à API...</p>
          </div>
        )}
        {error && (
          <div className={styles.errorScreen}>
            <p>❌ Erro ao carregar dados: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {activeTab === 'converter' && <Converter currencies={currencies} />}
            {activeTab === 'chart'     && <RateChart currencies={currencies} />}
            {activeTab === 'table'     && <RateTable currencies={currencies} />}
          </>
        )}
      </main>
      <footer className={styles.footer}>
        <p>Hermes © 2024 · Dados: <a href="https://www.frankfurter.app" target="_blank" rel="noreferrer">Frankfurter API</a></p>
      </footer>
    </div>
  );
}
