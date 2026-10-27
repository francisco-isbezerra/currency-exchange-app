# COMPONENTS.md

## Component Tree
```
App
├── Header          — sticky nav with tab switching
├── Converter       — currency pair + amount + live result
│   ├── CurrencySelect
│   └── Spinner
├── RateChart       — historical line chart
│   ├── CurrencySelect
│   ├── Recharts (LineChart)
│   └── Spinner
└── RateTable       — historical data table with pagination + CSV export
    ├── CurrencySelect
    └── Spinner
```

## Custom Hooks
| Hook | Purpose |
|------|---------|
| useCurrencies | Fetch list of currencies from API |
| useExchangeRate | Fetch live rate for a pair |
| useHistoricalRates | Fetch historical rates for chart & table |

## Services
- frankfurter.js — All API calls (getCurrencies, getLatestRate, getHistoricalRates)

## Utils
- formatters.js — formatCurrency, formatRate, formatDate
- exportCsv.js  — exportToCsv (PapaParse)
