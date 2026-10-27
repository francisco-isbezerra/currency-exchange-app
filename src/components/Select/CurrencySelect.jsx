import styles from './CurrencySelect.module.css';

export default function CurrencySelect({ id, label, value, onChange, currencies, disabled }) {
  const entries = Object.entries(currencies);
  return (
    <div className={styles.group}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        {entries.map(([code, name]) => (
          <option key={code} value={code}>{code} — {name}</option>
        ))}
      </select>
    </div>
  );
}
