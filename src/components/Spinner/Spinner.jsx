import styles from './Spinner.module.css';

export default function Spinner({ size = 24, label = 'Carregando...' }) {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <span className={styles.spin} style={{ width: size, height: size }} />
    </div>
  );
}
