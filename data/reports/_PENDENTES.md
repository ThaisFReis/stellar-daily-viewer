# Pendentes de confirmação

Livro-razão dos itens que apareceram num relatório diário mas **não puderam ser
confirmados com data exata**. Mantido pela tarefa `stellar-daily-report`.

Existe porque uma notícia grande sem data não pode simplesmente evaporar quando o
dia dela passa. Fica aberta, é re-verificada toda manhã, e só sai quando confirma
ou cai.

**Ciclo de vida:** `aberto` → `confirmado` (fonte nomeada + data exata, e vira item
normal do relatório do dia) ou `descartado` (14 dias sem confirmação, ou fonte
confiável contradiz).

Linhas `confirmado` e `descartado` ficam 30 dias como histórico, depois são removidas.

| Item | Visto em | Dias | Status | O que falta | Fontes |
|---|---|---|---|---|---|
| **DTCC + Stellar — tokenização do Russell 1000** (cifra citada: US$ 114 tri até 2027) | 2026-09-16 | 2 | `confirmado` | Confirmado em 2026-09-17: anúncio ocorreu em **27/05/2026**, não em setembro. | [DTCC (oficial)](https://www.dtcc.com/press-releases/2026/tokenization-service-to-connect-with-stellar-public-blockchain-as-dtc-advances-multi-chain-strategy) · [Ledger Insights](https://www.ledgerinsights.com/dtc-tokenization-service-to-add-stellar-as-second-public-blockchain/) |
| **SEC/CFTC listam XLM entre 16 _digital commodities_** | 2026-09-16 | 2 | `confirmado` | Confirmado em 2026-09-17: guia interpretativo conjunto SEC/CFTC de 68 páginas, emitido em **17/03/2026**. | [TradingView/Coinpedia](https://www.tradingview.com/news/coinpedia:8f05e3db8094b:0-sec-cftc-crypto-commodity-list-2026-all-16-digital-assets-named-and-what-it-means/) |
| **Pyth Pro/Indices ao vivo na Stellar mainnet** (3.500+ feeds) | 2026-09-18 | 3 | `confirmado` | Confirmado em 2026-09-21: post oficial da Pyth traz atualização de **08/09/2026** (ressurgência, fora da janela). | [Pyth](https://www.pyth.network/blog/pyth-pro-and-pyth-indices-bring-24-7-pricing-to-stellar-s-4b-rwa-ecosystem) · [Stellar](https://stellar.org/blog/developers/real-time-prices-for-stellars-4b-tokenized-assets-economy) |
| **LI.FI ao vivo na Stellar (60+ chains)** | 2026-09-18 | 8 | `aberto` | Reverificado em 2026-09-26: updates públicos da LI.FI (até maio/2026) mencionam contratação para "Stellar Ecosystem" mas nenhuma fonte traz data de lançamento da integração. | [Roundup](https://x.com/i/article/2101054031334690816) |
| **Zebec/AllUnity EURAU — benefício governamental na Europa** | 2026-09-18 | 1 | `descartado` | Ressurgência: fato de **25/06/2026**, fora da janela. | [Business Wire](https://www.businesswire.com/news/home/20260625883682/en/AllUnity-and-Zebec-Deploy-EURAU-Powered-Employee-Benefits-and-Enterprise-Payment-Solutions-on-Stellar) |
| **U.S. Bank — piloto público na Stellar (USBDC)** | 2026-09-18 | 1 | `descartado` | Ressurgência: transação de **09/09/2026**, cobertura de ~11/09; piloto interno do banco. | [Gokhshtein](https://gokhshtein.com/news/2026-09-11-us-bank-completes-usbdc-cross-border-pilot-on-stellar) · [Cryptoslate](https://cryptoslate.com/us-bank-moves-usbdc-across-borders-on-stellar-but-only-inside-its-own-walls/) |
| **Recorde de 216+ TPS em 18/09** | 2026-09-18 | 8 | `aberto` | Reverificado em 2026-09-26: cobertura continua sustentando só 211 TPS (ligado à ativação do Protocol 28), sem post oficial da SDF citando um número exato. Falta fonte primária. | [Cryptoslate](https://cryptoslate.com/stellar-activates-protocol-28-as-network-hits-record-throughput-and-rwa-value-climbs/) |
| **HOT Wallet — bridging Stellar via HOT Bridge/NEAR Intents** | 2026-09-23 | 4 | `descartado` | Confirmado em 2026-09-26: Stellar entrou no NEAR Intents em **19/08/2025**, com HOT Bridge como conexão principal pouco depois — infraestrutura já operante desde fim de 2025, não anúncio novo. | [HOT Labs](https://hot-labs.org/blog/hot-on-stellar-the-first-stellar-bridge-mission) · [Outposts.io](https://outposts.io/article/near-intents-adopts-hot-bridge-for-stellar-network-902b5b37-e4fc-48ab-a9d4-ca0ef7e9c6bb) |
| **Integração Stellar × BVNK** (apresentada em ampla cobertura de 24–25/09 como se fosse notícia do dia) | 2026-09-25 | 0 | `descartado` | Não é pendência de data incerta — o fato já tem data exata: anúncio oficial da BVNK em **22/09/2026**. Registrado para não recircular como novo em relatórios futuros. | [crypto.news](https://crypto.news/xlm-price-climbs-bvnk-adds-stellar-for-global-payments/) |
| **SCF #45 — US$ 4,04M para 40 projetos** (recirculando em roundups de 25/09 como se fosse do dia) | 2026-09-26 | 0 | `descartado` | Fato já tem data exata: SCF #45 Round Recap publicado em **23/09/2026**. Registrado para não recircular como novo. | [SCF #45 Round Recap, Medium](https://medium.com/stellar-community/scf-45-round-recap-1ecf281821ab) |
| **Pods Finance × Pix (Brasil) na Stellar** | 2026-09-26 | 0 | `aberto` | Citado apenas em roundup agregado (x.com, 25/09), sem fonte independente com nome exato e data. Precisa de confirmação primária antes de entrar no relatório. | [Roundup, x.com](https://x.com/i/article/2103529193464344576) |
