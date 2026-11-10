# DESIGN — Hubble

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
terroso marca estado ativo, link e a estrela da marca.

| Papel | Claro | Escuro |
|---|---|---|
| `--background` | `#faf9f6` | `#1a1918` |
| `--surface` | `#f0eee9` | `#262422` |
| `--foreground` | `#1c1b19` | `#e8e5de` |
| `--muted-foreground` | `#5c5a55` | `#aba79f` |
| `--border` (filete) | `#dedbd3` | `#383633` |
| `--border-control` | `#87847c` | `#7d7a74` |
| `--accent` / `--ring` | `#84382c` (terracota) | `#f1b29e` (rosé) |
| `--mark` / `--mark-foreground` | `#e1d6a0` / `#191919` | `#736c3c` / `#fff8db` |

`--border` é decorativo e pode ser quase invisível; o que delimita um controle
(busca, campos de filtro, chips) usa `--border-control`, que cumpre 3:1.

No escuro o texto é marfim um tom abaixo do branco: texto longo em fundo escuro
ofusca menos assim. O acento inverte de valor entre temas em vez de ser a mesma
cor nos dois.

## Typography

- **Editorial** (`--font-editorial`): Literata variável (eixos `wght` e `opsz`),
  carregada por `next/font/google` em `src/app/layout.tsx` e servida pelo
  próprio app. Fallback: Iowan Old Style → Palatino → Georgia.
  Usada na marca, na data da edição, nos títulos de seção e no corpo.
- **Dados** (`--font-data`): IBM Plex Mono 400/500, também via `next/font`.
  Rótulos, datas, contagens, antetítulos: a voz "onchain" do jornal, em
  contraste com a serifa. Sempre pequena (11–13px), quase sempre em caixa alta.
- **Interface**: Helvetica Neue → Helvetica. Navegação, filtros, tabelas.

Corpo: 19px / 1.72, coluna de até 660px (≈70 caracteres). Resumo do dia: 20px / 1.6.
Data da edição: `clamp(38px, 4.6vw, 50px)`, peso 600.

## Ritmo das seções

O ritmo vem de contraste de escala e de textura, nunca de ornamento. Referências:
os blocos rotulados da Semafor (fato separado de leitura), a manchete por item e
o "why it matters" das newsletters, a hierarquia manchete/nota/breve do jornal
impresso, e a camada de dados em monoespaçada da mídia cripto.

- **Nome da editoria** é rótulo em monoespaçada sobre uma régua: 3px, acento e
  estrela no destaque; 1px no resto. À direita, a contagem de notas.
- **Manchete da nota** (`.nota-titulo`): `clamp(27px, 3.2vw, 32px)` na nota que
  abre um destaque, 22px nas demais, 20px em seção comum.
- **Nota corrida** (`.nota-corrida`): parágrafo com negrito de abertura, sem manchete.
- **Livro-razão**: a lista sob um intertítulo (`.subhead`) usa 17.5px e filete
  entre as linhas. É como "Pendentes e ressurgências" se distingue das matérias.
- **Por que importa** (`.nota-porque`): bloco com fundo `--surface` e rótulo em
  acento. É o único fundo colorido na leitura, reservado para análise.

## Components

- `.topbar` — uma linha: marca, tagline, busca, botão de tema. Régua de 3px embaixo.
- `.estrela` — a estrela de quatro pontas da marca (SVG em `Viewer.tsx`).
- `.archive-column` — trilho fixo (`position: sticky`) com rolagem própria:
  "Última edição" / "Em apuração", título do arquivo que abre os filtros, e as
  edições agrupadas por mês, uma por linha. O trecho da matéria só aparece no
  trilho quando há busca. Abaixo de 820px vira painel deslizante sobre barra
  fixa no rodapé.
- `.edition-heading` — antetítulo (dia da semana / nº da edição), a data como
  manchete, e uma linha de metadados com a ação "Gerar imagem".
- `.editorial-summary` — o resumo de 3 linhas, entre dois filetes.
- `.caderno-nav` — abas de texto: Stellar / Blockchain e Web3.
- `.section-nav` — editorias do caderno ativo, como filtro.
- `.story` / `.story-head` — seção da edição e seu rótulo sobre régua.
- `.edition-pager` — edição anterior / seguinte ao fim da leitura.

## Layout

- `.newspaper` — largura máxima 1120px, 40px de goteira.
- `.edition-layout` — grade 208px + 1fr, 72px de intervalo. A leitura é limitada
  a 660px; o caderno de apuração (`.is-wide`) usa a largura toda por causa da tabela.
- Abaixo de 1000px o trilho cai para 184px; abaixo de 820px vira coluna única.

## Motion

Duas transições: o painel do mobile (`.26s cubic-bezier(.32,.72,0,1)`) e o
giro do "＋" dos filtros. Tudo mais é instantâneo. Trocar de edição leva a
página ao topo sem animação. `prefers-reduced-motion: reduce` zera duração e
rolagem suave globalmente.
