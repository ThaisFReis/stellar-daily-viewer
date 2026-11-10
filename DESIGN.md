# DESIGN — Íris

Documenta o que está em `src/app/globals.css`. O conceito da marca está em
`brand.md`.

## Visual theme

Jornal de nicho bem impresso, com uma coisa de cada vez na tela. Serifa de
leitura para a voz editorial, grotesca neutra para a mecânica da interface.
Uma única régua pesada sob o cabeçalho; o resto se separa por filete fino e
espaço. Sem sombra, sem gradiente, sem raio de canto.

A regra que guia o desenho: **a leitura é a página; todo o resto é margem.**
O arquivo é um trilho quieto ao lado, os filtros ficam recolhidos, e nada
acima do resumo do dia repete informação que não muda de uma edição para outra.

## Color palette

Estratégia: **restrained**. Neutros quentes carregam a superfície; um único acento
âmbar marca estado ativo, link e o ponto focal da marca.

| Papel | Claro | Escuro |
|---|---|---|
| `--background` | `#f1ede4` | `#1a1917` |
| `--surface` | `#e6e0d4` | `#252422` |
| `--foreground` | `#20242a` | `#dbd6cc` |
| `--muted-foreground` | `#555c66` | `#a8a399` |
| `--border` (filete) | `#d1cbbf` | `#383632` |
| `--border-control` | `#807c74` | `#7d7870` |
| `--rule` (régua pesada) | `#20242a` | `#8c877d` |
| `--accent` / `--ring` | `#805416` (âmbar escuro) | `#d6b27a` (âmbar) |
| `--mark` / `--mark-foreground` | `#e6cb92` / `#20242a` | `#54462f` / `#efe5d1` |

`--border` é decorativo e pode ser quase invisível; o que delimita um controle
(busca, campos de filtro, chips) usa `--border-control`, que cumpre 3:1.

Conforto de leitura decide os dois extremos. No claro, o papel fica um tom
abaixo do creme mais luminoso (L* ≈ 94) para a página não ofuscar. No escuro, o
fundo é fundo e quente, perto do preto (L* ≈ 9), e quem cede é o texto: marfim
suave em 12:1, nunca branco. Um grafite mais aberto foi testado e rejeitado
pelo leitor: parecia lavado. O texto secundário cumpre pelo menos 5:1 nos
dois temas, inclusive sobre `--surface`.

`--rule` é a régua pesada do cabeçalho e das editorias. No claro é a própria
tinta; no escuro recua para um meio-tom, porque uma barra de 3px na cor do
texto vira um risco de luz. O acento inverte de valor entre temas em vez de ser
a mesma cor nos dois.

## Typography

- **Editorial** (`--font-editorial`): Literata variável (eixos `wght` e `opsz`),
  carregada por `next/font/google` em `src/app/layout.tsx` e servida pelo
  próprio app. Fallback: Iowan Old Style → Palatino → Georgia.
  Usada nos títulos das notas e no corpo.
- **Display** (`--font-display`): Instrument Serif 400, servida de arquivo local
  via `next/font/local`. Usada na marca e na abertura da edição.
- **Dados** (`--font-data`): IBM Plex Mono 400/500, também via `next/font`.
  Rótulos, datas, contagens, antetítulos: a voz "onchain" do jornal, em
  contraste com a serifa. Sempre pequena (11–13px), quase sempre em caixa alta.
- **Interface**: Helvetica Neue → Helvetica. Navegação, filtros, tabelas.

Corpo: 19px / 1.72, coluna de até 660px (≈70 caracteres). Resumo do dia: 20px / 1.6.
Manchete da edição: `clamp(46px, 5.4vw, 64px)`, peso 400; até 54px no celular.
A data acompanha a manchete como metadado. Sem título completo na primeira nota
de destaque, a data continua sendo a abertura.

## Ritmo das seções

O ritmo vem de contraste de escala e de textura, nunca de ornamento. Referências:
os blocos rotulados da Semafor (fato separado de leitura), a manchete por item e
o "why it matters" das newsletters, a hierarquia manchete/nota/breve do jornal
impresso, e a camada de dados em monoespaçada da mídia cripto.

- **Nome da editoria** é rótulo em monoespaçada sobre uma régua: 3px, acento e
  ponto focal no destaque; 1px no resto. À direita, a contagem de notas.
- **Manchete da nota** (`.nota-titulo`): `clamp(27px, 3.2vw, 32px)` na nota que
  abre um destaque, 22px nas demais, 20px em seção comum.
- **Nota corrida** (`.nota-corrida`): parágrafo com negrito de abertura, sem manchete.
- **Livro-razão**: a lista sob um intertítulo (`.subhead`) usa 17.5px e filete
  entre as linhas. É como "Pendentes e ressurgências" se distingue das matérias.
- **Por que importa** (`.nota-porque`): bloco com fundo `--surface` e rótulo em
  acento. É o único fundo colorido na leitura, reservado para análise.

## Components

- `.topbar` — uma linha: marca, tagline, busca, botão de tema. Régua de 3px embaixo.
- `.iris-mark` — abertura óptica de seis lâminas (`IrisMark.tsx`).
- `.focus-point` — ponto âmbar de atenção editorial, usado em escala pequena.
- `.archive-column` — trilho fixo (`position: sticky`) com rolagem própria:
  "Última edição" / "Em observação", título do arquivo que abre os filtros, e as
  edições agrupadas por mês, uma por linha. O trecho da matéria só aparece no
  trilho quando há busca. Abaixo de 820px vira painel deslizante sobre barra
  fixa no rodapé.
- `.edition-heading` — rótulo Em foco, número, data e manchete da edição,
  seguidos de metadados e da ação "Gerar imagem".
- `.editorial-summary` — Primeira luz / O dia em poucas linhas, entre dois filetes.
- `.caderno-nav` — abas de texto: Stellar / Além da Stellar.
- `.section-nav` — editorias do caderno ativo, como filtro.
- `.story` / `.story-head` — seção da edição e seu rótulo sobre régua.
- `.edition-pager` — edição anterior / seguinte ao fim da leitura.

## Layout

- `.newspaper` — largura máxima 1200px, 48px de goteira.
- `.edition-layout` — grade 200px + 1fr, 88px de intervalo. A leitura é limitada
  a 660px; o caderno de apuração (`.is-wide`) usa a largura toda por causa da tabela.
- Abaixo de 1000px o trilho cai para 184px; abaixo de 820px vira coluna única.

## Motion

Duas transições: o painel do mobile (`.26s cubic-bezier(.32,.72,0,1)`) e o
giro do "＋" dos filtros. Tudo mais é instantâneo. Trocar de edição leva a
página ao topo sem animação. `prefers-reduced-motion: reduce` zera duração e
rolagem suave globalmente.
