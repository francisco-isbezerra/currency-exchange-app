import { useI18n } from '../../i18n/I18nContext';

export default function CurrencySelect({ id, label, value, onChange, currencies, disabled }) {
  const { currencyName } = useI18n();
  const entries = Object.entries(currencies);
  return (
    <div className="min-w-0 flex-1">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <select
        id={id}
        className="field cursor-pointer font-mono text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        {entries.map(([code, name]) => (
          <option key={code} value={code}>{code} · {currencyName(code, name)}</option>
        ))}
      </select>
    </div>
  );
}
