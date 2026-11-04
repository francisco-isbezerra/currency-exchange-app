/** Marca do Troca: duas moedas sobrepostas. Usa currentColor para seguir o tema. */
export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="12.5" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="19.5" cy="16" r="8" className="fill-accent" />
      <path
        d="M19.5 11.8v8.4M17.4 13.6h3.2a1.4 1.4 0 0 1 0 2.8h-2.2a1.4 1.4 0 0 0 0 2.8h3.3"
        fill="none" stroke="rgb(var(--paper))" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}
