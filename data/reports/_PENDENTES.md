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
| **USDT0 live na Stellar (LayerZero OFT, 26+ redes)** — AMA na reunião de devs de 08/10 | 2026-10-09 | 1 | `descartado` | Confirmado em 2026-10-10: go-live em **02/09/2026** (comunicado SDF); o AMA de 08/10 foi só discussão técnica. Ressurgência. | [Stellar](https://stellar.org/press/usdt0-goes-live-on-stellar-connecting-unified-dollar-liquidity-to-the-world-s-most-accessible-network) · [Docs](https://developers.stellar.org/launch/usdt0) |
| **PwC × EOS Group — liquidação de securitização de 30 dias para 1 dia na Stellar** (SDF, tokenforge, AllUnity; stablecoin euro MiCA) | 2026-10-10 | 3 | `confirmado` | Confirmado em 2026-10-11: comunicado de **07/10/2026**, fora da janela; ressurgência. | [PwC DE](https://www.pwc.de/de/pressemitteilungen/2026/von-30-tagen-auf-einen-tag-pwc-stellt-neue-loesung-fuer-automatisiertes-settlement-in-verbriefungen-vor.html) · [Coinalert 08/10](https://coinalertnews.com/news/2026/10/08/stellar-pwc-payout-institutional-adoption) |
| **State Street/Galaxy SWEEP ao vivo na Stellar** (citado em resumos semanais de 12–13/10; fundo lançado em maio/2026 na Solana) | 2026-10-12 | 2 | `descartado` | Fechado em 2026-10-14: expansão para a Stellar já datada em **29/09/2026** (ver linha de 13/10). Ressurgência. | [Crypto Briefing](https://cryptobriefing.com/state-street-galaxy-sweep-tokenized-fund/) |
| **SCF Instawards de outubro — 7 times do Vietnã** | 2026-10-12 | 24 | `descartado` | Descartado em 2026-11-05: mais de 14 dias sem fonte primária (SCF/SDF) com data da concessão. | [LumenLoop/X](https://x.com/i/article/2109701806528065537) |
| **State Street/Galaxy SWEEP na Stellar** (recirculando em resumo semanal de 13/10) | 2026-10-13 | 0 | `descartado` | Fato já datado: **29/09/2026** (Crypto Briefing). Registrado para não recircular como novo. | [Crypto Briefing](https://cryptobriefing.com/state-street-galaxy-sweep-tokenized-fund/) |
| **Chainlink ao vivo na Stellar — Data Feeds + Data Streams** (post SDF "Chainlink is now live on Stellar") | 2026-10-14 | 1 | `confirmado` | Confirmado em 2026-10-15: go-live na mainnet em **14/10/2026** (post SDF indexado com essa data; Crypto Briefing e outras coberturas fixam 14/10). Data Streams já estava disponível desde 25/02/2026. Entrou no relatório de 14/10 como notícia do dia. | [Stellar](https://stellar.org/blog/foundation-news/chainlink-is-now-live-on-stellar-unleashing-a-new-wave-of-defi-innovation) · [Crypto Briefing](https://cryptobriefing.com/stellar-integrates-chainlink-data-services-defi/) |
| **S&P Global — nota máxima ao fundo tokenizado da Spiko** (citado no boletim "Stellar en español" de 14/10) | 2026-10-15 | 5 | `descartado` | Resolvido em 2026-10-20 como ressurgência: o fundo é o eurSAFO (Spiko Amundi), avaliado AAAf/S1+ pela S&P e registrado na Stellar; o Stellar Weekly Roundup situa o rating na semana de 25/09/2026. Dia exato não localizado, mas está fora da janela de 14/10. | [Tellus](https://blog.telluscoop.com/p/stellar-en-espanol) · [yellow.com/eursafo](https://yellow.com/asset/eursafo) |
| **Alchemy — suporte à Stellar** (apareceu em buscas sobre devs de outubro) | 2026-10-16 | 0 | `descartado` | Fato já datado: **16/04/2026**. Registrado para não recircular como novo. | [Alchemy](https://alchemy.com/blog/stellar-support-is-live-on-alchemy) |
| **WisdomTree × MoonPay — distribuição do fundo WTGXX** (reaparece no retrospecto de Q3 da WisdomTree, de 22/10, e em agregadores como se fosse de outubro) | 2026-10-22 | 0 | `descartado` | Fato já tem data exata: anúncio em **17/09/2026**. Registrado para não recircular como novo. | [Nasdaq, 17/09](https://www.nasdaq.com/press-release/wisdomtree-and-moonpay-collaborate-expand-us-access-tokenized-funds-and-support) |
| **Stellar Passport — prêmio i³ for impact "no Meridian 2026"** (artigo de 16/10) | 2026-10-17 | 19 | `descartado` | Descartado em 2026-11-05: mais de 14 dias e nenhum comunicado datado da SDF sobre os vencedores do i³ 2026, nem após o Meridian (28–29/10). | [X, 16/10](https://x.com/i/article/2111176537257242624) |
| **Resultado da votação da testnet do Protocol 30 (Bell), marcada para 03/11 17h UTC** | 2026-11-04 | 1 | `aberto` | Em 2026-11-06, o Stellar Weekly Roundup (06/11) diz que a Bell "entrou na testnet" nesta semana. Indício forte, mas sem data exata nem comunicado da SDF. Falta fonte primária (blog SDF, Discord #protocol-next ou status da testnet). | [Bell upgrade guide](https://stellar.org/blog/developers/bell-protocol-30-upgrade-guide) · [Weekly Roundup 06/11](https://x.com/i/article/2118814241285345280) |
| **Lendwise lançado na mainnet da Stellar** (citado no Weekly Roundup de 06/11, "nesta semana") | 2026-11-05 | 0 | `aberto` | Falta fonte primária (site ou anúncio do Lendwise) com a data do lançamento. | [Weekly Roundup 06/11](https://x.com/i/article/2118814241285345280) |
