import { Moon, Sun, Languages, Store, LineChart, Table2 } from 'lucide-react';
import Logo from './Logo';
import { useI18n } from '../../i18n/I18nContext';
import { LANGUAGES } from '../../i18n/translations';
import { useTheme } from '../../theme/ThemeContext';

const NAV = [
  { id: 'market',  key: 'nav.market',  Icon: Store },
  { id: 'history', key: 'nav.history', Icon: LineChart },
  { id: 'table',   key: 'nav.table',   Icon: Table2 },
];

/**
 * Barra lateral (desktop) / barra superior (mobile).
 * Usa propriedades lógicas (start/end, border-e) para funcionar também em RTL.
 */
export default function Sidebar({ active, onChange }) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="border-b border-rule bg-paper md:fixed md:inset-y-0 md:start-0 md:flex md:w-64 md:flex-col md:border-b-0 md:border-e">
      {/* Marca */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 md:block md:px-7 md:py-8">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <p className="font-display text-2xl font-semibold leading-none tracking-tight">Troca</p>
            <p className="mt-1 text-xs text-muted">{t('brand.tagline')}</p>
          </div>
        </div>

        {/* Ações rápidas no mobile */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted hover:text-ink md:hidden"
          aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Navegação */}
      <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-0 md:px-0 md:pb-0">
        {NAV.map(({ id, key, Icon }, i) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              id={`tab-${id}`}
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex shrink-0 items-center gap-3 px-4 py-2.5 text-sm transition md:border-s-2 md:px-7 md:py-3
                ${isActive
                  ? 'bg-ink text-paper md:border-accent md:bg-transparent md:font-semibold md:text-ink'
                  : 'text-muted hover:text-ink md:border-transparent'}`}
            >
              <span className="hidden font-mono text-[11px] text-muted md:inline">0{i + 1}</span>
              <Icon size={17} strokeWidth={1.75} />
              {t(key)}
            </button>
          );
        })}
      </nav>

      {/* Preferências (desktop) */}
      <div className="hidden space-y-5 border-t border-rule px-7 py-6 md:mt-auto md:block">
        <div>
          <label htmlFor="lang-select" className="label flex items-center gap-1.5">
            <Languages size={13} /> {t('lang.label')}
          </label>
          <select id="lang-select" className="field py-2 text-sm" value={lang} onChange={e => setLang(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        <div>
          <span className="label">{t('theme.label')}</span>
          <div className="grid grid-cols-2 border border-rule text-sm" role="group">
            {[
              { id: 'light', Icon: Sun },
              { id: 'dark',  Icon: Moon },
            ].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => theme !== id && toggleTheme()}
                aria-pressed={theme === id}
                className={`flex items-center justify-center gap-1.5 py-2 transition
                  ${theme === id ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
              >
                <Icon size={14} /> {t(`theme.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Idioma no mobile */}
      <div className="px-5 pb-4 md:hidden">
        <select aria-label={t('lang.label')} className="field py-2 text-sm" value={lang} onChange={e => setLang(e.target.value)}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
    </aside>
  );
}

