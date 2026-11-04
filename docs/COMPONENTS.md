# COMPONENTS.md

## Árvore de componentes
```
main.jsx
└── ThemeProvider            — tema claro/escuro (classe `dark` no <html>)
    └── I18nProvider         — idioma atual, t(), locale, direção (ltr/rtl)
        └── App
            ├── Sidebar      — marca, navegação, seletor de idioma e de tema
            │   └── Logo
            ├── MarketPage   — tela inicial (aba "Mercado")
            │   ├── PageHeader
            │   ├── CurrencySelect   (moeda base dos cards)
            │   ├── MarketCards      — 5 cards: cotação, variação diária, sparkline
            │   └── Converter        — valor + par de moedas + resultado ao vivo
            ├── RateChart    — aba "Histórico": gráfico + mín/média/máx
            │   ├── PageHeader
            │   └── CurrencySelect, Recharts, Spinner
            └── RateTable    — aba "Tabela": filtros, ordenação, paginação, CSV
                ├── PageHeader
                └── CurrencySelect, Spinner
```

## Hooks
| Hook | Função |
|------|--------|
| `useCurrencies` | Lista de moedas da API (com lista local de reserva) |
| `useExchangeRate` | Cotação ao vivo de um par |
| `useHistoricalRates` | Série histórica para gráfico e tabela |
| `useMarketSnapshot` | Dados dos 5 cards da tela inicial (cotação, variação, 30 dias) |
| `useI18n` | `t(chave)`, `locale`, `dir`, `currencyName(code)` |
| `useTheme` | `theme`, `toggleTheme()` |

## Estilo
- **Tailwind CSS** em todos os componentes (CSS Modules foram removidos).
- Paleta definida por variáveis CSS em `src/index.css` (`--paper`, `--ink`, `--accent`…), trocadas pela classe `.dark`.
- Classes reutilizáveis em `@layer components`: `.field`, `.label`, `.btn`, `.panel`.
- Propriedades lógicas (`ms-*`, `ps-*`, `start-*`, `border-e`) para o layout funcionar em RTL (árabe).

## Serviços
- `frankfurter.js` — chamadas à API v2 (`getCurrencies`, `getLatestRate`, `getHistoricalRates`)

## Utils
- `formatters.js` — `formatRate`, `formatAmount`, `formatPercent`, `formatDate`, `formatLongDate` (todos recebem o locale)
- `exportCsv.js` — `exportToCsv` (PapaParse)
