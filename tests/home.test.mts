// Contrato da primeira página (02-designer.md). Roda com `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { frontPage, editionStories, isValidNote } from "../src/lib/home.ts";

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

test("descarta nota de 'não achei' e não usa rótulo curto como título", () => {
  assert.equal(isValidNote("**XLM:** não achei cotação primária datada de 11/11."), false);
  const body = head() + "## 📈 Mercado e regulação\n\n- **Spiko:** lançou fundo tokenizado na Stellar. Mais texto.\n";
  const { stories } = editionStories(body);
  assert.equal(stories[0].headline, "Spiko: lançou fundo tokenizado na Stellar");
});
