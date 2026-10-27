import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download, Search, X } from 'lucide-react';
import { useHistoricalRates } from '../../hooks/useHistoricalRates';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import { formatDate, formatRate } from '../../utils/formatters';
import { exportToCsv } from '../../utils/exportCsv';
import styles from './RateTable.module.css';

const PAGE_SIZE = 10;

export default function RateTable({ currencies }) {
  const [from, setFrom]       = useState('USD');
  const [to, setTo]           = useState('EUR');
  const [range, setRange]     = useState('30d');
  const [search, setSearch]   = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir]     = useState('desc');
  const [page, setPage]       = useState(1);

  const { data, loading, error } = useHistoricalRates(from, to, range);

  // Aplica todos os filtros e ordena
  const filtered = useMemo(() => {
    let rows = [...data];

    // Filtro por data
    if (search.trim()) {
      rows = rows.filter(r => r.date.includes(search.trim()));
    }
    // Filtro por cotação mínima
    if (minRate !== '') {
      rows = rows.filter(r => r.rate >= parseFloat(minRate));
    }
    // Filtro por cotação máxima
    if (maxRate !== '') {
      rows = rows.filter(r => r.rate <= parseFloat(maxRate));
    }

    // Ordenação
    rows.sort((a, b) => {
      const aVal = sortField === 'rate' ? a.rate : a.date;
      const bVal = sortField === 'rate' ? b.rate : b.date;
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [data, search, minRate, maxRate, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setMinRate('');
    setMaxRate('');
    setPage(1);
  }

  function handleExport() {
    if (filtered.length === 0) {
      alert('Nenhum dado para exportar. Ajuste os filtros.');
      return;
    }
    exportToCsv(
      filtered.map(r => ({ Data: r.date, Origem: from, Destino: to, Cotacao: r.rate })),
      `hermes_${from}_${to}_${range}`
    );
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const hasFilters = search || minRate || maxRate;

  return (
    <section className={styles.section} aria-labelledby="table-title">
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 id="table-title" className={styles.title}>Tabela de Cotações</h2>
          <button id="btn-export-csv" className={styles.exportBtn} onClick={handleExport}>
            <Download size={16} /> Exportar CSV
          </button>
        </div>

        {/* Seletores de moeda e período */}
        <div className={styles.controlsRow}>
          <CurrencySelect id="table-from" label="De"   value={from} onChange={v => { setFrom(v); setPage(1); }} currencies={currencies} />
          <CurrencySelect id="table-to"   label="Para" value={to}   onChange={v => { setTo(v);   setPage(1); }} currencies={currencies} />
          <div className={styles.selectGroup}>
            <label htmlFor="table-range" className={styles.label}>Período</label>
            <select id="table-range" className={styles.rangeSelect} value={range} onChange={e => { setRange(e.target.value); setPage(1); }}>
              {['7d','15d','30d','3m','6m','1y'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filtersRow}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              id="table-search-date"
              type="text"
              className={styles.searchInput}
              placeholder="Filtrar por data (ex: 2024-01)..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className={styles.rateFilters}>
            <div className={styles.filterGroup}>
              <label htmlFor="filter-min" className={styles.label}>Cotação Mín.</label>
              <input
                id="filter-min"
                type="number"
                step="any"
                className={styles.filterInput}
                placeholder="0.00"
                value={minRate}
                onChange={e => { setMinRate(e.target.value); setPage(1); }}
              />
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="filter-max" className={styles.label}>Cotação Máx.</label>
              <input
                id="filter-max"
                type="number"
                step="any"
                className={styles.filterInput}
                placeholder="999.99"
                value={maxRate}
                onChange={e => { setMaxRate(e.target.value); setPage(1); }}
              />
            </div>
            {hasFilters && (
              <button id="btn-clear-filters" className={styles.clearBtn} onClick={clearFilters} title="Limpar filtros">
                <X size={16} /> Limpar
              </button>
            )}
          </div>
        </div>

        {loading && <Spinner />}
        {error  && <p className={styles.error}>Erro ao carregar dados: {error}</p>}

        {!loading && !error && (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table} aria-label={`Cotações ${from} → ${to}`}>
                <thead>
                  <tr>
                    <th>
                      <button className={styles.sortBtn} onClick={() => handleSort('date')} id="btn-sort-date">
                        Data <SortIcon field="date" />
                      </button>
                    </th>
                    <th>Origem</th>
                    <th>Destino</th>
                    <th className={styles.right}>
                      <button className={styles.sortBtn} onClick={() => handleSort('rate')} id="btn-sort-rate">
                        Cotação <SortIcon field="rate" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr><td colSpan={4} className={styles.empty}>Nenhum registro encontrado com esses filtros.</td></tr>
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
              <span className={styles.pageInfo}>
                {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''} · página {page} de {totalPages || 1}
              </span>
              <div className={styles.pageButtons}>
                <button id="btn-prev-page" className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, Math.max(1, totalPages - 4))) + i;
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
