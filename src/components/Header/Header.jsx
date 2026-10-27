import styles from './Header.module.css';

export default function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'converter', label: 'Converter' },
    { id: 'chart',     label: 'Histórico' },
    { id: 'table',     label: 'Tabela' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>₿</span>
          <span className={styles.name}>Hermes</span>
          <span className={styles.tagline}>Currency Exchange</span>
        </div>
        <nav className={styles.nav} role="navigation" aria-label="Main navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
