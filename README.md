# Registro — Jornal de blockchain

Leitor editorial dos relatórios diários de Stellar, preparado visualmente para a cobertura de blockchain e economia digital.

Visual de jornal com tema de papel, tipografia serifada, arquivo de edições e
editorias extraídas automaticamente dos títulos `##` do Markdown. No celular,
a leitura aparece antes do arquivo. A identidade está documentada em `brand.md`.

A integração continua lendo `../Stellar-Daily/*.md`; a mudança de design não
altera o MCP nem adiciona outras fontes de notícias.

```bash
npm run dev    # http://localhost:3100
```

## O que faz

- **Busca full-text** em todos os relatórios, com destaque das ocorrências e
  contagem por dia. Ignora acento e caixa: `ressurgencia` acha `ressurgência`.
- **Filtro por data** (de / até) e **por fonte citada** — a lista de fontes é
  derivada dos domínios que aparecem nos links de cada relatório.
- **Atualização automática.** A cada 15s o cliente consulta só a assinatura do
  disco; quando muda, recarrega e mostra uma faixa apontando o relatório novo.
  Nenhum reinício é necessário quando a tarefa das 8h gera um arquivo.
- **Vista de pendências** — renderiza `_PENDENTES.md` com o contador de itens
  em aberto no cabeçalho.
- Tema claro/escuro, com a escolha guardada no navegador.
- Atalho `/` foca a busca; `Esc` sai do campo.

## Hierarquia da edição

As seções não têm todas o mesmo peso. O relatório não diz qual importa mais, mas
o resumo de 3 linhas carrega esse juízo: ele nomeia o que o dia teve de relevante.

`hierarquizar()` (em `src/components/Viewer.tsx`) cruza os termos distintivos do
resumo — nomes próprios, siglas, códigos tipo "Protocol 28" — com o corpo de cada
seção e classifica em três níveis:

- **destaque** — citada pelo resumo (mínimo 2 acertos, no máximo 3 seções, já que
  o resumo tem três linhas). Título maior, tarja "Destaque do dia", mais respiro.
- **normal** — tem matéria mas o resumo não citou. Ordenada por peso de conteúdo.
- **vazia** — "Nada relevante nesta janela". Recolhida numa linha só ao fim, e
  fora do índice de editorias, que levaria a uma tela em branco.

Quando **nenhuma** seção tem matéria, a edição inteira muda de tratamento: a
manchete passa a ser "Um dia sem notícia", com a lista de editorias vazias. Um dia
quieto é informação, não falha, e não deve custar sete seções repetindo a mesma frase.

Para ajustar o rigor, mexa no piso de acertos e no teto de 3 em `hierarquizar()`.

## Cadernos

A edição é dividida em dois cadernos, classificados pelo título da seção em
`cadernoOf()` (em `src/components/Viewer.tsx`):

- **O foco — Stellar**: tudo, por padrão.
- **O contexto — Blockchain e Web3**: só a seção "Blockchain e Web3 além da
  Stellar".

A aba de um caderno sem matéria não aparece — edições antigas, anteriores a essa
seção no relatório, seguem exibindo só o caderno principal. Para criar um novo
caderno, acrescente-o a `CADERNOS` e ensine `cadernoOf()` a reconhecê-lo.

## Navegação e filtros

"O jornal / Arquivo / Em apuração" fica junto do arquivo de edições, não no
cabeçalho — empilhada na coluna lateral no desktop, em linha dentro do painel no
mobile. O cabeçalho carrega só a busca.

"Arquivo" ali é rótulo do lugar onde você já está, então aparece apagado: o
realce da navegação indica a **vista** atual (jornal ou apuração), e dois
destaques com sentidos diferentes confundiriam.

Os atalhos de período (Todas / Semana / Mês / Ano) ficam fora do acordeão
"Filtrar arquivo" — atalho que exige abrir um acordeão deixa de ser atalho. Eles
preenchem o campo "De" com a janela correspondente, ancorada em hoje e aberta no
fim; editar as datas à mão muda o período para `custom`. São 2x2 no desktop
(4 em linha não cabem na coluna de 248px) e 4 em linha no painel do mobile.

## Mobile

Abaixo de 700px o arquivo e os filtros viram um painel deslizante, aberto pela
barra fixa no rodapé. Antes eles ficavam depois da edição no fluxo da página, o
que exigia rolar milhares de pixels para alcançá-los.

O painel fecha ao escolher uma edição, no botão Fechar, no fundo escurecido e com
`Esc`; a rolagem de fundo fica travada enquanto ele está aberto.

## Estúdio social

`public/modelo-social.html` gera a capa em PNG para redes, em três formatos
(1080×1080, 1080×1350, 1600×900). Servido pelo Next em `/modelo-social.html`.

Cada edição do jornal tem "Gerar imagem" junto da assinatura. O link abre o
estúdio já preenchido via query string: `data`, `edicao`, `manchete`, `resumo`,
e `l1..l3` / `d1..d3` (rótulo e chamada de cada destaque).

**A derivação mora no jornal, não no estúdio.** Quais seções viram destaque sai
de `hierarquizar()`; o estúdio é HTML puro e duplicar essa lógica em JS solto
viraria drift na primeira mudança. Sem parâmetros, o estúdio funciona sozinho com
os rótulos padrão.

A manchete sai da primeira frase do resumo e quase sempre passa dos 85
caracteres, então chega cortada — o estúdio avisa para revisá-la antes de baixar.
É a parte que merece escrita própria.

O card não traz a masthead "Registro": num feed, a manchete é a marca.

## Deploy e publicação automática

No ar em **https://stellar-daily-viewer.vercel.app** (público, sem login).
Repositório: [github.com/ThaisFReis/stellar-daily-viewer](https://github.com/ThaisFReis/stellar-daily-viewer)
(público).

**A fonte de dados do site é `data/reports/`, dentro deste repo — não mais a
pasta irmã `Workspace/Stellar-Daily/`.** O Vercel não tem disco persistente
nem acesso à sua máquina: só existe em produção o que está commitado no git.
`Stellar-Daily/` continua existindo como arquivo morto legível para humanos;
`data/reports/` é a cópia que alimenta o deploy.

**Pipeline de publicação**, executado pelas tarefas agendadas
(`stellar-daily-report` e `stellar-daily-check`) depois de escrever o
relatório:

```bash
cp Workspace/Stellar-Daily/<data>.md      Stellar-Daily-Viewer/data/reports/
cp Workspace/Stellar-Daily/_PENDENTES.md  Stellar-Daily-Viewer/data/reports/
git add data/reports/ && git commit -m "..." && git push
```

O push é o gatilho: o projeto está conectado ao GitHub via integração git do
Vercel, então todo push em `master` dispara um deploy de produção automático,
sem nenhum comando `vercel deploy` manual. As tarefas agendadas **nunca** rodam
`vercel deploy` ou `vercel --prod` diretamente — publicar site é ação de saída,
e o gatilho fica só no `git push`, que é reversível (`git revert` + push desfaz).

Deployment Protection (SSO do Vercel) foi desligado deliberadamente
(`ssoProtection: null` via API, já que a CLI não expõe esse toggle) — sem
isso, todo acesso ao site pedia login na sua conta Vercel.

Next.js fixado em `15.5.26`: a `15.5.4` original tinha uma CVE que o próprio
Vercel bloqueia no deploy (`"Vulnerable version of Next.js detected"`).

## Como lê os dados

Só leitura, de `../Stellar-Daily/*.md`. O app **nunca escreve** na pasta de
registros — ela pertence às tarefas agendadas.

O caminho é resolvido em `src/lib/reports.ts`. Se você mover uma das duas
pastas, ajuste `REPORTS_DIR` lá.

A página é `dynamic` de propósito: lê o disco a cada requisição, sem cache.
É o que permite um relatório novo aparecer sem rebuild.

## Cuidado ao rodar o build

`next build` e `next dev` compartilham a pasta `.next`. Rodar o build com o dev
server no ar apaga os manifests que ele usa e a página perde todo o CSS. Pare o
dev server antes de buildar, ou limpe com `rm -rf .next` depois.

## Estrutura

```
src/lib/reports.ts       leitura do disco, extração de prévia/seções/fontes
src/lib/text.ts          normalização de busca, datas, trechos
src/app/page.tsx         server component, lê e entrega ao viewer
src/app/api/reports/     JSON completo + endpoint só de assinatura (polling)
src/components/Viewer    UI: busca, filtros, lista, auto-atualização
src/components/ReportBody  markdown → HTML com destaque de busca
```
