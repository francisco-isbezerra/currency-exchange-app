# Troca — câmbio sem complicação

> Projeto 01 — Disciplina de Desenvolvimento Web · Francisco Bezerra

SPA para conversão de moedas em tempo real e análise do histórico de cotações, com interface em **6 idiomas** e **tema claro/escuro**.

| Entrega | Link |
|---|---|
| 1. Repositório público | https://github.com/francisco-isbezerra/currency-exchange-app |
| 2. Aplicação funcionando | https://francisco-isbezerra.github.io/currency-exchange-app/ |
| 3. Documentação | este README + pasta [`docs/`](docs/) |
| 4. Protótipos no Figma | https://www.figma.com/design/iKfckirErKSlaFr2536Dvy/Sem-t%C3%ADtulo?node-id=0-1&t=i4k33X5VOLj2HAze-1 |
| 5. Collection do Postman | [`docs/postman_collection.json`](docs/postman_collection.json) |

---

## Funcionalidades

- **Mercado (tela inicial)** — cards com as 5 moedas mais negociadas do mundo (USD, EUR, JPY, GBP, CNY), já convertidas para a moeda escolhida (padrão: BRL), com variação diária e mini‑gráfico de 30 dias. Clicar em um card preenche o conversor.
- **Conversor** — valor, moeda de origem/destino, botão de inverter, cotação unitária e data da cotação.
- **Histórico** — gráfico de linha (Recharts) com períodos de 7 dias a 10 anos e estatísticas de mínimo, média e máximo.
- **Tabela** — cotações diárias com filtro por data e por faixa de valor, ordenação, paginação e exportação para CSV.
- **Idiomas** — Português + os 5 idiomas mais falados do mundo: inglês, mandarim, hindi, espanhol e árabe (com layout RTL). Números, datas e nomes de moedas também são traduzidos via `Intl`.
- **Tema claro/escuro** — respeita a preferência do sistema e salva a escolha no `localStorage`.

## Tecnologias

- **React 19 + Vite** (JSX)
- **Tailwind CSS 3** (estratégia `darkMode: 'class'` + variáveis CSS para a paleta)
- **Recharts** — gráficos
- **Lucide React** — ícones
- **date-fns** — manipulação de datas
- **PapaParse** — exportação CSV
- **Frankfurter API v2** — cotações gratuitas, sem API key
- i18n próprio com React Context (sem biblioteca externa)

## Como rodar

Requisitos: **Node.js 20.19+ ou 22.12+**.

```bash
npm install
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção (pasta dist/)
npm run deploy    # publica dist/ no GitHub Pages (branch gh-pages)
```

## Estrutura

```
src/
├── components/
│   ├── Layout/      Sidebar, PageHeader, Logo
│   ├── Market/      MarketPage (tela inicial) e MarketCards
│   ├── Converter/   Conversor
│   ├── Chart/       Gráfico histórico
│   ├── Table/       Tabela de cotações
│   ├── Select/      Seletor de moedas
│   └── Spinner/     Indicador de carregamento
├── hooks/           useCurrencies, useExchangeRate, useHistoricalRates, useMarketSnapshot
├── i18n/            translations.js + I18nContext
├── theme/           ThemeContext (claro/escuro)
├── services/        frankfurter.js (cliente da API)
├── utils/           formatters, exportCsv
└── data/            lista de moedas de reserva
```

## API — Frankfurter v2

Base: `https://api.frankfurter.dev/v2`

| Método | Endpoint | Uso no app |
|---|---|---|
| GET | `/currencies` | lista de moedas dos seletores |
| GET | `/rate/{base}/{quote}` | conversor |
| GET | `/rates?base=&quotes=&from=&to=` | gráfico, tabela e cards do mercado |

Detalhes e exemplos de resposta em [`docs/API_TESTS.md`](docs/API_TESTS.md).

### Testando com o Postman

1. Abra o Postman → **Import** → selecione [`docs/postman_collection.json`](docs/postman_collection.json).
2. A collection já traz as variáveis `baseUrl`, `base`, `quote`, `startDate` e `endDate`.
3. Clique em **Run collection** para executar todas as requisições e seus testes automáticos.

## Documentação complementar

- [Requisitos](docs/REQUIREMENTS.md)
- [Componentes](docs/COMPONENTS.md)
- [Testes da API](docs/API_TESTS.md)
- [Testes de funcionalidades](docs/FUNCTION_TESTS.md)
- [Protótipos no Figma](docs/FIGMA.md)
- [Uso de IA](docs/AI_USAGE.md)

## Fluxo Git

- `main` — branch estável
- `dev` — integração
- `feat/*` — novas funcionalidades
- `gh-pages` — build publicado (gerado pelo `npm run deploy`)
