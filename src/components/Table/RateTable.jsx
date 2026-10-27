import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download, Search } from 'lucide-react';
import { useHistoricalRates } from '../../hooks/useHistoricalRates';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import { formatDate, formatRate } from '../../utils/formatters';
import { exportToCsv } from '../../utils/exportCsv';
import styles from './RateTable.module.css';

const PAGE_SIZE = 10;

export default function RateTable({ currencies }) {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BRL');
  const [range, setRange] = useState('30d');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useHistoricalRates(from, to, range);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) rows = rows.filter(r => r.date.includes(search));
    rows.sort((a, b) => sortDir === 'asc'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date)
    );
    return rows;
  }, [data, search, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort() {
    setSortDir(s => s === 'asc' ? 'desc' : 'asc');
    setPage(1);
  }

  function handleExport() {
    exportToCsv(
      filtered.map(r => ({ Date: r.date, From: from, To: to, Rate: r.rate })),
      `hermes_${from}_${to}_${range}`
    );
  }

  return (
    <section className={styles.section} aria-labelledby="table-title">
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 id="table-title" className={styles.title}>Tabela de Cotações</h2>
          <button id="btn-export-csv" className={styles.exportBtn} onClick={handleExport}>
            <Download size={16} /> Exportar CSV
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.selects}>
            <CurrencySelect id="table-from" label="De"   value={from} onChange={v => { setFrom(v); setPage(1); }} currencies={currencies} />
            <CurrencySelect id="table-to"   label="Para" value={to}   onChange={v => { setTo(v);   setPage(1); }} currencies={currencies} />
            <div className={styles.selectGroup}>
              <label htmlFor="table-range" className={styles.label}>Período</label>
              <select id="table-range" className={styles.rangeSelect} value={range} onChange={e => { setRange(e.target.value); setPage(1); }}>
                {['7d','15d','30d','3m','6m','1y'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              id="table-search"
              type="text"
              className={styles.searchInput}
              placeholder="Filtrar por data (YYYY-MM-DD)..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {loading && <Spinner />}
        {error  && <p className={styles.error}>Erro: {error}</p>}

        {!loading && !error && (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table} aria-label={`Cotações ${from} → ${to}`}>
                <thead>
                  <tr>
                    <th>
                      <button className={styles.sortBtn} onClick={toggleSort} id="btn-sort-date">
                        Data {sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </th>
                    <th>Moeda Base</th>
                    <th>Moeda Alvo</th>
                    <th className={styles.right}>Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr><td colSpan={4} className={styles.empty}>Nenhum dado encontrado.</td></tr>
                  )}
                  {paged.map(row => (
                    <tr key={row.date}>
                      <td>{formatDate(row.date)}</td>
                      <td><span className={styles.badge}>{from}</span></td>
                      <td><span className={styles.badge}>{to}</span></td>
                      <td className={styles.right + ' ' + styles.rateCell}>{formatRate(row.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <span className={styles.pageInfo}>{filtered.length} registros · página {page} de {totalPages || 1}</span>
              <div className={styles.pageButtons}>
                <button id="btn-prev-page" className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return p <= totalPages ? (
                    <button key={p} className={`${styles.pageBtn} ${page === p ? styles.activePage : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ) : null;
                })}
                <button id="btn-next-page" className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
