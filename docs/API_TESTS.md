# API_TESTS.md

## Frankfurter API Tests

### GET /currencies
- URL: https://api.frankfurter.app/currencies
- Expected: 200 OK, JSON object with currency codes

### GET /latest
- URL: https://api.frankfurter.app/latest?amount=1&from=USD&to=BRL
- Expected: { amount, base, date, rates: { BRL: number } }

### GET /historical
- URL: https://api.frankfurter.app/2024-01-01..2024-01-31?from=USD&to=BRL
- Expected: { amount, base, start_date, end_date, rates: { "YYYY-MM-DD": { BRL: number } } }
