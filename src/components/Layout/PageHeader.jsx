import { useI18n } from '../../i18n/I18nContext';
import { formatLongDate } from '../../utils/formatters';

/** Cabeçalho editorial de cada página: data, título grande e subtítulo. */
export default function PageHeader({ title, subtitle, children }) {
  const { locale } = useI18n();
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-ink pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
          {formatLongDate(new Date(), locale)}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-muted">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
