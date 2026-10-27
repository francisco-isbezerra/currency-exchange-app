# API_TESTS.md — Frankfurter API v2

## Base URL
\`https://api.frankfurter.dev/v2\`

## GET /v2/currencies
- URL: https://api.frankfurter.dev/v2/currencies
- Expected: 200 OK, Array de objetos [{iso_code, name, symbol, ...}]
- Exemplo: [{"iso_code":"USD","name":"United States Dollar",...}]

## GET /v2/rate/{base}/{quote}
- URL: https://api.frankfurter.dev/v2/rate/usd/eur
- Expected: 200 OK, { date, base, quote, rate }
- Exemplo: {"date":"2026-10-27","base":"USD","quote":"EUR","rate":0.89385}

## GET /v2/rates (Time Series)
- URL: https://api.frankfurter.dev/v2/rates?base=usd&quotes=eur&from=2026-10-01&to=2026-10-27
- Expected: 200 OK, Array [{date, base, quote, rate}, ...]
- Exemplo: [{"date":"2026-10-01","base":"USD","quote":"EUR","rate":0.88287}, ...]

## GET /v2/rates (Latest com base)
- URL: https://api.frankfurter.dev/v2/rates?base=usd
- Expected: 200 OK, Array com taxas mais recentes para todas as moedas

## Erros
- 400: Parâmetro inválido
- 404: Moeda não encontrada
- 422: Requisição compreendida mas não processável
- Formato: {"status": 422, "message": "invalid currency: ABC"}
