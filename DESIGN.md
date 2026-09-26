# DESIGN — Registro

Derivado do código existente (`src/app/globals.css`). O desenho é do usuário;
este arquivo documenta o que já está lá, não propõe substituto.

## Visual theme

Jornal de nicho bem impresso. Serifa humanista para voz editorial, grotesca neutra
para a mecânica da interface. Régua horizontal pesada separando blocos, do jeito
que uma edição impressa separa cadernos. Sem sombra, sem gradiente, sem raio de
canto: a separação vem de linha e de espaço.

## Color palette

Estratégia: **restrained**. Neutros quentes carregam a superfície; um único acento
terroso marca estado ativo e link.

Os neutros não são cinza puro — puxam para o quente (papel no claro, tinta no
escuro), o que sustenta a leitura editorial e evita o azulado de interface.

| Papel | Claro | Escuro |
|---|---|---|
| `--background` | `#faf9f6` | `#181818` |
| `--surface` | `#eeece7` | `#242424` |
| `--foreground` | `#191919` | `#f1efea` |
| `--muted-foreground` | `#505050` | `#c5c2bb` |
| `--border` | `#b8b5ae` | `#67645f` |
| `--accent` / `--ring` | `#84382c` (terracota) | `#f1b29e` (rosé) |
| `--mark` / `--mark-foreground` | `#e1d6a0` / `#191919` | `#736c3c` / `#fff8db` |

O acento inverte de valor entre temas — escuro e saturado no claro, claro e suave
no escuro — em vez de ser a mesma cor nos dois. É o que mantém contraste nos dois
sentidos.

`color-scheme` é declarado em cada tema, então controles nativos (`input[type=date]`,
`select`, barra de rolagem) acompanham sem CSS extra.

## Typography

- **Editorial** (`--font-editorial`): Iowan Old Style → Palatino → Book Antiqua →
  Times New Roman. Pilha do sistema, sem webfont: zero requisição, zero flash.
  Usada na masthead, títulos de edição, corpo do texto e no selo.
- **Interface**: Helvetica Neue → Helvetica. Rótulos, navegação, metadados, chips.

Marcadores de interface usam caixa alta, 11–13px, `letter-spacing` de .06–.14em.
Títulos usam `letter-spacing` negativo (até -.075em na masthead).

Escala da masthead: `clamp(70px, 8vw, 112px)`, `line-height: .93`.

## Components

- `.masthead` — grade 1fr/2fr/1fr: nota à esquerda, título ao centro, selo à direita.
- `.edition-bar` — faixa com borda superior de 3px: data, status de atualização, contagem.
- `.desk-bar` — só a busca (a navegação mora na coluna do arquivo).
- `.archive-column` — navegação, chips de período, filtros, lista de edições.
  Abaixo de 700px vira painel deslizante sobre barra fixa no rodapé.
- `.caderno-nav` — divisão de primeiro nível: Stellar (o foco) / Blockchain e Web3 (o contexto).
- `.section-nav` — editorias do caderno ativo.
- `.story` — matéria com número ordinal ao lado.
- `.periodo-chips` — Todas / Semana / Mês / Ano. 2x2 no desktop, 4 em linha no painel.

## Layout

- `.newspaper` — largura máxima 1440px, 56px de goteira.
- `.edition-layout` — grade 248px + 1fr, 42px de intervalo; 270px acima de 1440px.
- Abaixo de 1000px a coluna cai para 205px; abaixo de 700px vira coluna única.

## Motion

Uma transição só, no painel do mobile: `.26s cubic-bezier(.32,.72,0,1)`.
Tudo mais é instantâneo. `prefers-reduced-motion: reduce` zera duração e
comportamento de rolagem globalmente.
