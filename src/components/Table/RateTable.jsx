import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Download, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHistoricalRates } from '../../hooks/useHistoricalRates';
import CurrencySelect from '../Select/CurrencySelect';
import Spinner from '../Spinner/Spinner';
import PageHeader from '../Layout/PageHeader';
import { useI18n } from '../../i18n/I18nContext';
import { formatDate, formatRate } from '../../utils/formatters';
import { exportToCsv } from '../../utils/exportCsv';

const PAGE_SIZE = 10;
const TABLE_RANGES = ['7d', '15d', '30d', '3m', '6m', '1y'];

export default function RateTable({ currencies }) {
  const { t, locale, dir } = useI18n();
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [range, setRange] = useState('30d');
  const [search, setSearch] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useHistoricalRates(from, to, range);

  // Aplica todos os filtros e ordena
  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) rows = rows.filter(r => r.date.includes(search.trim()));
    if (minRate !== '') rows = rows.filter(r => r.rate >= parseFloat(minRate));
    if (maxRate !== '') rows = rows.filter(r => r.rate <= parseFloat(maxRate));

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

  // Envolve um setter para sempre voltar à página 1 ao mudar um filtro
  const resetting = setter => value => { setter(value); setPage(1); };

  function handleSort(field) {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  }

  function clearFilters() {
    setSearch(''); setMinRate(''); setMaxRate(''); setPage(1);
  }

  function handleExport() {
    if (filtered.length === 0) {
      alert(t('table.noExport'));
      return;
    }
    exportToCsv(
      filtered.map(r => ({ Data: r.date, Origem: from, Destino: to, Cotacao: r.rate })),
      `troca_${from}_${to}_${range}`
    );
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const hasFilters = search || minRate || maxRate;
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <>
      <PageHeader title={t('table.title')} subtitle={t('table.subtitle')}>
        <button id="btn-export-csv" className="btn" onClick={handleExport}>
          <Download size={16} /> {t('table.export')}
        </button>
      </PageHeader>

      <section aria-labelledby="table-title" className="panel">
        <h2 id="table-title" className="sr-only">{t('table.title')}</h2>

        {/* Moedas e período */}
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_10rem]">
          <CurrencySelect id="table-from" label={t('conv.from')} value={from} onChange={resetting(setFrom)} currencies={currencies} />
          <CurrencySelect id="table-to" label={t('conv.to')} value={to} onChange={resetting(setTo)} currencies={currencies} />
          <div>
            <label htmlFor="table-range" className="label">{t('chart.period')}</label>
            <select id="table-range" className="field font-mono text-sm" value={range} onChange={e => resetting(setRange)(e.target.value)}>
              {TABLE_RANGES.map(r => <option key={r} value={r}>{t(`range.${r}`)}</option>)}
            </select>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-4 grid gap-3 border-t border-dashed border-rule pt-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="table-search-date"
              type="text"
              className="field ps-9 text-sm"
              placeholder={t('table.search')}
              value={search}
              onChange={e => resetting(setSearch)(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filter-min" className="label">{t('table.minRate')}</label>
            <input id="filter-min" type="number" step="any" className="field font-mono text-sm" placeholder="0.00"
              value={minRate} onChange={e => resetting(setMinRate)(e.target.value)} />
          </div>
          <div>
            <label htmlFor="filter-max" className="label">{t('table.maxRate')}</label>
            <input id="filter-max" type="number" step="any" className="field font-mono text-sm" placeholder="999.99"
              value={maxRate} onChange={e => resetting(setMaxRate)(e.target.value)} />
          </div>
          <button id="btn-clear-filters" onClick={clearFilters} disabled={!hasFilters} className="btn h-[42px] border-rule">
            <X size={16} /> {t('table.clear')}
          </button>
        </div>

        {loading && <Spinner />}
        {error && <p role="alert" className="mt-6 text-down">{t('common.error', { msg: error })}</p>}

        {!loading && !error && (
          <>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm" aria-label={`${from} → ${to}`}>
                <thead>
                  <tr className="border-b-2 border-ink text-start">
                    <th className="py-3 pe-4 text-start">
                      <button id="btn-sort-date" onClick={() => handleSort('date')} className="label mb-0 inline-flex items-center gap-1 hover:text-ink">
                        {t('table.date')} <SortIcon field="date" />
                      </button>
                    </th>
                    <th className="label mb-0 py-3 pe-4 text-start">{t('table.origin')}</th>
                    <th className="label mb-0 py-3 pe-4 text-start">{t('table.target')}</th>
                    <th className="py-3 text-end">
                      <button id="btn-sort-rate" onClick={() => handleSort('rate')} className="label mb-0 inline-flex items-center gap-1 hover:text-ink">
                        {t('table.rate')} <SortIcon field="rate" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr><td colSpan={4} className="py-10 text-center text-muted">{t('table.empty')}</td></tr>
                  )}
                  {paged.map(row => (
                    <tr key={row.date} className="border-b border-rule transition hover:bg-paper">
                      <td className="py-3 pe-4 font-mono">{formatDate(row.date, locale)}</td>
                      <td className="py-3 pe-4"><span className="border border-rule px-1.5 py-0.5 font-mono text-xs">{from}</span></td>
                      <td className="py-3 pe-4"><span className="border border-rule px-1.5 py-0.5 font-mono text-xs">{to}</span></td>
                      <td className="py-3 text-end font-mono font-medium">{formatRate(row.rate, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="font-mono text-xs text-muted">
                {t('table.summary', { n: filtered.length, page, total: totalPages || 1 })}
              </span>
              <div className="flex">
                <button id="btn-prev-page" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center border border-rule text-muted hover:text-ink disabled:opacity-30" aria-label="‹">
                  <PrevIcon size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, Math.max(1, totalPages - 4))) + i;
                  return p <= totalPages ? (
                    <button key={p} onClick={() => setPage(p)} aria-current={page === p ? 'page' : undefined}
                      className={`-ms-px h-9 w-9 border font-mono text-xs
                        ${page === p ? 'z-10 border-ink bg-ink text-paper' : 'border-rule text-muted hover:text-ink'}`}>
                      {p}
                    </button>
                  ) : null;
                })}
                <button id="btn-next-page" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                  className="-ms-px flex h-9 w-9 items-center justify-center border border-rule text-muted hover:text-ink disabled:opacity-30" aria-label="›">
                  <NextIcon size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
