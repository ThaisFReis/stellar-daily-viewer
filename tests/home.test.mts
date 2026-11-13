// Contrato da primeira página (02-designer.md). Roda com `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { frontPage, editionStories, isValidNote, automaticStories } from "../src/lib/home.ts";

const head = (block = "") => `# Stellar — o que rolou

> ⏳ Edição em andamento — atualizada às 10:00 (Brasília). Fechamento às 22h.

**Resumo em 3 linhas**
1. Primeira linha do resumo.
2. Segunda linha.
3. Terceira linha.
${block}
`;

const empty = `## 🚀 Lançamentos e produtos

Nada relevante nesta janela.

## 🛠️ Comunidade e devs

Nada relevante nesta janela. O stellar-core teve só um commit de ajuste de teste, sem release.

## 📅 Eventos

- **Hoje:** Town Hall às 18h.
`;

const news = `## 🗺️ Próximos passos e roadmap

- **RFPs do SCF #46 seguem abertas, com prazo em 20/11.** Faltam 7 dias.

## 📈 Mercado e regulação

- **Token Terminal diz que a Stellar é a 2ª rede.** Dado de terceiro.
`;

test("descarta nota que começa com 'Nada relevante', mesmo com frase extra", () => {
  assert.equal(isValidNote("Nada relevante nesta janela. O stellar-core teve um commit."), false);
  const { stories } = editionStories(head() + empty);
  assert.equal(stories.length, 0);
});

test("usa a nota indicada no bloco <!-- home -->", () => {
  const block = "<!-- home\nmanchete: 🗺️ | RFPs do SCF #46 seguem abertas, com prazo em 20/11\ndestaque: 📈 | Token Terminal diz\n-->";
  const page = frontPage([{ date: "2026-11-13", body: head(block) + empty + news }]);
  assert.equal(page?.source, "editor");
  assert.equal(page?.stories[0].headline, "RFPs do SCF #46 seguem abertas, com prazo em 20/11");
  assert.equal(page?.stories[1].section, "📈 Mercado e regulação");
  assert.equal(page?.stories.length, 2);
});

test("nota indicada não encontrada cai no automático e registra no log", () => {
  const logs: string[] = [];
  const block = "<!-- home\nmanchete: 🚀 | Algo que não existe\n-->";
  const { stories, source } = editionStories(head(block) + empty + news, (m) => logs.push(m));
  assert.equal(source, "automatico");
  assert.ok(stories.length > 0);
  assert.match(logs[0], /manchete não encontrada/);
});

test("edição sem bloco usa o automático, sem 📅 nem 'Nada relevante'", () => {
  const { stories, source } = editionStories(head() + empty + news);
  assert.equal(source, "automatico");
  assert.deepEqual(stories.map((s) => s.section).sort(), ["📈 Mercado e regulação", "🗺️ Próximos passos e roadmap"]);
});

test("edição vazia cai para a anterior e marca 'Da edição de'", () => {
  const page = frontPage([
    { date: "2026-11-13", body: head("<!-- home\nquieto\n-->") + empty },
    { date: "2026-11-12", body: head() + news },
  ]);
  assert.equal(page?.source, "anterior");
  assert.equal(page?.stories[0].fromDate, "2026-11-12");
  assert.equal(page?.stories.length, 1);
});

test("anterior com mais de 7 dias não conta: usa o Resumo como manchete", () => {
  const page = frontPage([
    { date: "2026-11-13", body: head() + empty },
    { date: "2026-11-01", body: head() + news },
  ]);
  assert.equal(page?.source, "resumo");
  assert.equal(page?.stories[0].headline, "Primeira linha do resumo.");
});

test("a home nunca mostra 'Nada relevante' como manchete", () => {
  const page = frontPage([{ date: "2026-11-13", body: head() + empty }]);
  for (const s of page?.stories ?? []) assert.doesNotMatch(s.headline, /nada relevante/i);
});

test("rótulo curto não vira título", () => {
  const body = head() + "## 📈 Mercado e regulação\n\n- **Spiko:** lançou fundo tokenizado na Stellar. Mais texto.\n";
  const { stories } = editionStories(body);
  assert.equal(stories[0].headline, "Spiko: lançou fundo tokenizado na Stellar");
});

test("nota do bloco com 'Fonte secundária' é aceita e rotulada", () => {
  const body = head("<!-- home\nmanchete: 🛠️ | A Tellus publicou um guia\n-->") +
    "## 🛠️ Comunidade e devs\n\n- **A Tellus publicou um guia sobre trustlines.** Conteúdo educativo. Fonte secundária ([LumenLoop](https://x)).\n";
  const page = frontPage([{ date: "2026-11-13", body }]);
  assert.equal(page?.source, "editor");
  assert.equal(page?.stories[0].headline, "A Tellus publicou um guia sobre trustlines");
  assert.equal(page?.stories[0].caveat, "Fonte secundária");
});

test("nota do bloco com 'não verificado' ou 'não achei' não é descartada", () => {
  const body = head("<!-- home\nmanchete: 📈 | Token Terminal\n-->") +
    "## 📈 Mercado e regulação\n\n- **Token Terminal diz que a Stellar é a 2ª rede.** Número não verificado por mim; não achei a planilha.\n";
  const page = frontPage([{ date: "2026-11-13", body }]);
  assert.equal(page?.source, "editor");
  assert.equal(page?.stories[0].caveat, undefined);
});

test("automático prefere nota sem ressalva e, sem ela, usa a com ressalva da mesma edição", () => {
  const both = head() +
    "## 🚀 Lançamentos e produtos\n\n- **Guia da Tellus.** Fonte secundária.\n\n## 📈 Mercado e regulação\n\n- **Spiko lança fundo.** Comunicado oficial.\n";
  assert.equal(automaticStories(both)[0].headline, "Spiko lança fundo");
  const onlyCaveat = head() + "## 🛠️ Comunidade e devs\n\n- **Guia da Tellus.** Fonte secundária.\n";
  const page = frontPage([
    { date: "2026-11-13", body: onlyCaveat },
    { date: "2026-11-12", body: head() + news },
  ]);
  assert.equal(page?.source, "automatico");
  assert.equal(page?.stories[0].caveat, "Fonte secundária");
  assert.equal(page?.stories[0].fromDate, undefined);
});

test("título automático para na primeira linha (lista depois de dois-pontos)", () => {
  const body = head() +
    "## 🛠️ Comunidade e devs\n\n- O canal **Rise In** publicou em 04/11 quatro palestras da SDF:\n  - Gemma Dobbs, sobre SCF;\n  - Outra palestra.\n";
  const [story] = automaticStories(body);
  assert.equal(story.headline, "O canal Rise In publicou em 04/11 quatro palestras da SDF");
  assert.match(story.note, /Gemma Dobbs/);
});
