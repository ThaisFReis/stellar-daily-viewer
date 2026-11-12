# PRODUCT — Íris

## Register

**product** — o design serve à tarefa.

A Íris tem identidade editorial forte (masthead, serifa, cadernos), mas a
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

Editorial, calmo, confiante. A Íris observa a Stellar e acompanha o que mudou.
O nome une a referência à missão espacial IRIS à ideia do olhar. A assinatura é
"Um olhar sobre a Stellar". O símbolo é uma abertura óptica com ponto âmbar.

Tom da interface: seco e específico. Sem exclamação, sem incentivo, sem hype.
O conteúdo já trata de cripto; a interface é o contrapeso sóbrio.

## Anti-references

- **Dashboard de cripto** — vela, verde/vermelho, número piscando, densidade de terminal.
- **Feed genérico** — cartões idênticos em grade, thumbnail, "leia mais", scroll infinito.
- **SaaS moderno** — gradiente, hero com métrica gigante, card de ícone+título+texto.
- **Pastiche de jornal** — textura de papel, sépia, ornamento vitoriano. A referência é
  editorial na estrutura e na tipografia, não na imitação de papel.
- **Fantasia espacial** — fundo estrelado, nebulosa, gradiente roxo, foguete. O conceito
  de observação mora no nome, na abertura óptica e no tom; não na decoração.

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


## Home aprovada — novembro de 2026
A primeira página em `/` apresenta Primeira luz lateral, manchete, até dois destaques, agenda, arquivo e Além da Stellar. O botão destacado abre `/edicoes`; data e caderno são preservados na URL de entrada. Pendências ficam somente nos arquivos internos, fora da leitura e da API pública. A home usa papel #f8f5ef, grafite #2b2e35, filetes pontilhados e contraste de escala; escuro #1e2024 e marfim #d8d5cd. Imagens dependem de licença; o diagrama Byetery só aparece quando a nota descreve esse fluxo. Não há gráfico ou foto genérica para outras matérias. Manchetes e notas vêm do relatório, com no máximo três editorias noticiosas; agenda e recaps não competem pelo destaque.
