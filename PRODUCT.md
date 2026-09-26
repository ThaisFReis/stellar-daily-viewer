# PRODUCT — Registro

## Register

**product** — o design serve à tarefa.

O Registro tem identidade editorial forte (masthead, serifa, cadernos), mas a
superfície é uma ferramenta: arquivo, busca, filtros, leitura diária recorrente.
A identidade existe para tornar a leitura agradável, não para ser o produto.

*Inferido do código e do uso; corrija se discordar.*

## Users

Uma pessoa: a mantenedora do Karn, construindo na Stellar. Lê de manhã, no
desktop, no começo do trabalho, para saber o que mudou no ecossistema desde
ontem. Não é público, não é compartilhado, não tem onboarding a resolver.

Conhece o domínio a fundo. Não precisa que termos sejam explicados, precisa que
o que mudou salte aos olhos.

## Product purpose

Ler os relatórios diários gerados pela tarefa `stellar-daily-report` e responder,
em segundos, três perguntas: **o que aconteceu ontem, o que disso importa, e o
que mudou em relação aos dias anteriores.**

Os dados vivem fora do app, em `../Stellar-Daily/*.md`. O app só lê.

## Brand personality

Editorial, calmo, confiante. "Leitura sem ruído" é a promessa impressa na
própria masthead. Um jornal de nicho bem impresso, não um terminal nem um feed.

Tom da interface: seco e específico. Sem exclamação, sem incentivo, sem hype.
O conteúdo já trata de cripto; a interface é o contrapeso sóbrio.

## Anti-references

- **Dashboard de cripto** — vela, verde/vermelho, número piscando, densidade de terminal.
- **Feed genérico** — cartões idênticos em grade, thumbnail, "leia mais", scroll infinito.
- **SaaS moderno** — gradiente, hero com métrica gigante, card de ícone+título+texto.
- **Pastiche de jornal** — textura de papel, sépia, ornamento vitoriano. A referência é
  editorial na estrutura e na tipografia, não na imitação de papel.

## Strategic design principles

1. **Hierarquia vinda do dia, não do gabarito.** As seções não podem ter todas o
   mesmo peso. A manchete sai do resumo de 3 linhas; o peso do conteúdo ordena o
   resto e encolhe o que veio vazio. *(Principal insatisfação declarada.)*

2. **O vazio é notícia.** Dia quieto assume o vazio com presença editorial, em vez
   de repetir "Nada relevante nesta janela" em cada seção. Um dia sem notícia é
   informação, não falha.

3. **Fato separado de leitura.** O relatório distingue fato confirmado, ressurgência
   e pendência. A interface precisa preservar essa distinção visualmente; achatá-la
   destrói o principal valor do sistema.

4. **Desktop é o contexto real.** Mobile precisa funcionar bem, mas as decisões de
   densidade e ritmo se otimizam para monitor grande, de manhã.

5. **Sem fricção de leitura.** Contraste AA, foco visível, `prefers-reduced-motion`
   respeitado. O básico bem feito, sem necessidades especiais declaradas.
