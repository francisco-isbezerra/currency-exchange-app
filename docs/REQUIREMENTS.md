# REQUIREMENTS.md — Troca

## Visão geral
SPA para conversão de moedas em tempo real e análise do histórico de cotações.
API: Frankfurter v2 (https://api.frankfurter.dev/v2) — gratuita, sem API key.

## Requisitos funcionais

### RF-01 — Mercado (tela inicial)
- Cards com as 5 moedas mais negociadas (USD, EUR, JPY, GBP, CNY; CHF substitui a moeda base se ela estiver na lista)
- Cada card mostra cotação na moeda base, variação vs. dia anterior e mini‑gráfico de 30 dias
- Moeda base selecionável (padrão BRL)
- Clicar em um card preenche o conversor

### RF-02 — Conversor de moedas
- Selecionar moedas de origem e destino
- Informar valor e ver o resultado em tempo real (validação de valor positivo)
- Botão para inverter as moedas e botão para atualizar a cotação
- Exibir cotação unitária e data da cotação

### RF-03 — Gráfico histórico
- Gráfico de linha (Recharts) da cotação ao longo do tempo
- Períodos: 7d, 15d, 30d, 3m, 6m, 1a, 5a, 10a
- Mínimo, média e máximo do período

### RF-04 — Tabela de dados
- Cotações diárias com ordenação, filtro por data e por faixa de valor, paginação
- Exportação para CSV (PapaParse)

### RF-05 — Internacionalização
- Seletor com Português + os 5 idiomas mais falados: inglês, mandarim, hindi, espanhol e árabe
- Todo o texto da interface muda conforme o idioma; números, datas e nomes de moedas usam `Intl`
- Árabe com layout da direita para a esquerda (RTL)
- Idioma salvo no `localStorage`

### RF-06 — Tema claro/escuro
- Alternância entre tema claro e escuro
- Respeita `prefers-color-scheme` na primeira visita e salva a escolha

## Requisitos não funcionais
- Responsivo (barra lateral no desktop, barra superior no mobile)
- Acessibilidade: rótulos em todos os campos, `aria-live` no resultado, `aria-pressed`/`aria-current` nos botões
- Tratamento de erros da API com timeout de 12 s e lista local de moedas como reserva

## Tecnologias
- React + JSX + Vite
- Tailwind CSS
- Recharts, Lucide React, date-fns, PapaParse
- fetch + async/await (sem Axios)

## Endpoints da API (v2)
- `GET /currencies`
- `GET /rate/{base}/{quote}`
- `GET /rates?base={base}&quotes={quote}&from={start}&to={end}`
