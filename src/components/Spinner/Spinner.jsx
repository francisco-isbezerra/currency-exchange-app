import { useI18n } from '../../i18n/I18nContext';

/** Indicador de carregamento discreto: três barras pulsando. */
export default function Spinner({ label }) {
  const { t } = useI18n();
  const text = label ?? t('common.loading');
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-muted" role="status" aria-label={text}>
      <span className="flex h-4 items-end gap-1">
        {[0, 150, 300].map(delay => (
          <span key={delay} className="h-full w-1 animate-pulse bg-accent" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}
