/**
 * Primeira página do Íris.
 *
 * Quem escolhe a manchete e os destaques é o Hubble, no bloco
 * `<!-- home ... -->` logo depois do Resumo (contrato em 02-designer.md).
 * Este módulo só localiza as notas indicadas e, quando falta escolha válida,
 * aplica a rede de segurança: a home nunca fica vazia.
 *
 * Sem imports locais de propósito: os testes rodam direto no Node
 * (`npm test`), sem bundler.
 */

export type Section = { title: string; body: string };

export type Story = {
  /** Título da seção de origem, com emoji. */
  section: string;
  /** Texto em negrito da nota (ou a primeira frase), sem reescrever. */
  headline: string;
  /** Restante da nota, em markdown. */
  note: string;
  /** Data da edição de origem, quando não é a edição mais recente. */
  fromDate?: string;
  /** Ressalva da nota, mostrada em texto (ex.: "Fonte secundária"). */
  caveat?: string;
};

export type HomeChoice = { emoji: string; start: string };

export type HomeBlock = {
  manchete: HomeChoice | null;
  destaques: HomeChoice[];
};

export type FrontSource = "editor" | "automatico" | "anterior" | "resumo" | "vazio";

export type FrontPage = {
  summary: string[];
  stories: Story[];
  /** De onde veio a manchete. */
  source: FrontSource;
  status: string;
  agenda?: Section;
  beyond?: Section;
};

export type ReportLike = { date: string; body: string };

/** Seções que podem dar manchete ou destaque (sem o seletor de variação). */
const NEWS_EMOJIS = ["🚀", "🤝", "🗺", "🛠", "📈"];

/** Nota vazia: nunca vai para a primeira página, nem por escolha do editor. */
const EMPTY_START = /^nada relevante/i;

/** Ressalvas: só pesam na escolha automática e no fallback. */
const CAVEATS: [RegExp, string][] = [
  [/fonte secund[áa]ria/i, "Fonte secundária"],
  [/n[ãa]o verificad[oa]/i, "Não verificado"],
  [/nada novo|sem fato novo/i, "Sem fato novo"],
  [/n[ãa]o achei|n[ãa]o encontrei/i, "Com ressalva"],
];

/** Quantos dias a home volta procurando notícia antes de usar o Resumo. */
export const FALLBACK_DAYS = 7;

export function plain(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s+/, "")
    .replace(/[*_`>]/g, "")
    .trim();
}

/** 🗺️ e 🗺 são o mesmo emoji: ignora o seletor de variação. */
function bareEmoji(text: string): string {
  return text.replace(/️/g, "").trim();
}

/** Normaliza para comparar o início da nota: sem acento, caixa e pontuação final. */
function fold(text: string): string {
  return plain(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.:!?]+$/, "")
    .toLowerCase()
    .trim();
}

export function parseSections(body: string): Section[] {
  return body
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [title, ...lines] = block.split("\n");
      return { title: title.trim(), body: lines.join("\n").trim() };
    });
}

export function parseSummary(body: string): string[] {
  const intro = body.split(/^## /m)[0];
  const after = intro.split(/\*\*Resumo em 3 linhas\*\*/)[1] ?? "";
  const item = /^\s*(?:\d+[.)]|-)\s+/;
  return after
    .split("\n")
    .filter((line) => item.test(line))
    .map((line) => plain(line.replace(item, "")));
}

export function parseStatus(body: string): string {
  const intro = body.split(/^## /m)[0];
  const line = intro.match(/^>\s*[⏳✅].+$/m)?.[0];
  return line ? line.replace(/^>\s*/, "") : "Estado de fechamento não informado";
}

/** Lê `<!-- home ... -->`. Devolve null quando a edição não tem o bloco. */
export function parseHomeBlock(body: string): HomeBlock | null {
  const raw = body.match(/<!--\s*home\b([\s\S]*?)-->/)?.[1];
  if (raw === undefined) return null;

  const block: HomeBlock = { manchete: null, destaques: [] };
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*(manchete|destaque)\s*:\s*([^|]+)\|\s*(.+?)\s*$/i);
    if (!match) continue; // `quieto` e linhas soltas não escolhem nada.
    const choice = { emoji: bareEmoji(match[2]), start: match[3] };
    if (match[1].toLowerCase() === "manchete") block.manchete ??= choice;
    else if (block.destaques.length < 2) block.destaques.push(choice);
  }
  return block;
}

/** Notas de uma seção: cada item de lista de primeiro nível, ou o parágrafo inteiro. */
export function sectionNotes(section: Section): string[] {
  const items = section.body
    .split(/^[-*]\s+/m)
    .slice(1)
    .map((note) => note.trim())
    .filter(Boolean);
  if (items.length) return items;
  return section.body ? [section.body] : [];
}

/** Nota com conteúdo: não vazia e não começa com "Nada relevante". */
export function isValidNote(note: string): boolean {
  const text = plain(note);
  return text.length > 0 && !EMPTY_START.test(text);
}

/** Rótulo da primeira ressalva encontrada na nota, ou undefined. */
export function caveatOf(note: string): string | undefined {
  return CAVEATS.find(([re]) => re.test(note))?.[1];
}

function isNewsSection(section: Section): boolean {
  const title = bareEmoji(section.title);
  return NEWS_EMOJIS.some((emoji) => title.startsWith(emoji));
}

/** Primeira frase de um texto, parando também na quebra de linha. */
function firstSentence(text: string): string {
  const line = text.split("\n")[0].trim();
  return line.split(/(?<=[.!?])\s/)[0].replace(/[.:,;]$/, "").trim();
}

/** Separa o negrito de abertura do resto da nota, sem reescrever o texto. */
export function toStory(section: Section, note: string, fromDate?: string): Story {
  const caveat = caveatOf(note);
  const bold = note.match(/^\*\*([^*\n]+)\*\*\s*/);
  // "**XLM:**" é rótulo, não título: aí vale a primeira frase da nota.
  const isLabel = bold && /:$/.test(bold[1].trim()) && bold[1].split(/\s+/).length <= 4;
  if (bold && !isLabel) {
    return {
      section: section.title,
      headline: firstSentence(plain(bold[1])),
      note: note.slice(bold[0].length).trim(),
      fromDate,
      caveat,
    };
  }
  const [firstLine, ...restLines] = note.split("\n");
  const headline = firstSentence(plain(firstLine));
  const lineText = plain(firstLine);
  // Se o título é a linha inteira, o resto da nota segue em markdown (listas, links).
  const sameLine = lineText.replace(/[.:]$/, "").trim() === headline;
  const remainder = sameLine
    ? restLines.join("\n")
    : `${lineText.slice(lineText.indexOf(headline) + headline.length).replace(/^[.:]\s*/, "")}\n${restLines.join("\n")}`;
  return {
    section: section.title,
    headline,
    note: remainder.trim(),
    fromDate,
    caveat,
  };
}

/** Procura a nota indicada pelo editor: mesma seção, negrito que começa com o texto. */
export function findChoice(sections: Section[], choice: HomeChoice): Story | null {
  const section = sections.find((s) => bareEmoji(s.title).startsWith(choice.emoji));
  if (!section) return null;
  const wanted = fold(choice.start);
  const note = sectionNotes(section).find((n) => {
    const bold = n.match(/^\*\*([^*\n]+)\*\*/)?.[1] ?? n;
    return fold(bold).startsWith(wanted);
  });
  if (!note || !isValidNote(note)) return null;
  const story = toStory(section, note);
  // Escolha do editor: só a marca de fonte secundária vira rótulo.
  return { ...story, caveat: story.caveat === "Fonte secundária" ? story.caveat : undefined };
}

/** Escolha automática: a melhor nota válida de cada seção de notícia, ordenadas pelo Resumo. */
export function automaticStories(body: string): Story[] {
  const terms = parseSummary(body).join(" ").match(/\b[A-Z][\w-]{3,}/g) ?? [];
  const score = (note: string) => terms.filter((t) => note.includes(t)).length;
  // Nota sem ressalva vem sempre antes; dentro de cada grupo, vale o Resumo.
  const rank = (note: string) => (caveatOf(note) ? 0 : 1000) + score(note);

  const picks: { section: Section; note: string }[] = [];
  for (const section of parseSections(body).filter(isNewsSection)) {
    const notes = sectionNotes(section).filter(isValidNote);
    const best = [...notes].sort((a, b) => rank(b) - rank(a))[0];
    if (best) picks.push({ section, note: best });
  }

  return picks
    .sort((a, b) => rank(b.note) - rank(a.note))
    .map(({ section, note }) => toStory(section, note));
}

/** Manchete e destaques de uma só edição: escolha do editor, senão automático. */
export function editionStories(
  body: string,
  log: (msg: string) => void = () => {},
): { stories: Story[]; source: "editor" | "automatico" } {
  const block = parseHomeBlock(body);
  const sections = parseSections(body);

  if (block?.manchete) {
    const lead = findChoice(sections, block.manchete);
    if (lead) {
      const rest: Story[] = [];
      for (const choice of block.destaques) {
        const story = findChoice(sections, choice);
        if (story) rest.push(story);
        else log(`[home] destaque não encontrado: ${choice.emoji} | ${choice.start}`);
      }
      return { stories: [lead, ...rest], source: "editor" };
    }
    log(`[home] manchete não encontrada: ${block.manchete.emoji} | ${block.manchete.start}`);
  }
  return { stories: automaticStories(body).slice(0, 3), source: "automatico" };
}

function daysBetween(newer: string, older: string): number {
  const ms = Date.parse(`${newer}T12:00:00Z`) - Date.parse(`${older}T12:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/**
 * Monta a primeira página. `reports` vem da mais nova para a mais antiga.
 * Rede de segurança: escolha do editor → automático da edição →
 * edições anteriores (até FALLBACK_DAYS) → Resumo em 3 linhas.
 */
export function frontPage(
  reports: ReportLike[],
  log: (msg: string) => void = () => {},
): FrontPage | null {
  const [latest, ...older] = reports;
  if (!latest) return null;

  const sections = parseSections(latest.body);
  const base = {
    summary: parseSummary(latest.body),
    status: parseStatus(latest.body),
    agenda: sections.find((s) => s.title.includes("📅")),
    beyond: sections.find((s) => /além da Stellar/i.test(s.title)),
  };

  const own = editionStories(latest.body, log);
  if (own.stories.length) return { ...base, ...own };

  for (const report of older) {
    if (daysBetween(latest.date, report.date) > FALLBACK_DAYS) break;
    const [lead] = editionStories(report.body).stories;
    if (lead) {
      return { ...base, stories: [{ ...lead, fromDate: report.date }], source: "anterior" };
    }
  }

  if (base.summary.length) {
    const [headline, ...rest] = base.summary;
    const story = { section: "Resumo em 3 linhas", headline, note: rest.join("\n\n") };
    return { ...base, stories: [story], source: "resumo" };
  }
  return { ...base, stories: [], source: "vazio" };
}

/** Título curto para o cartão do arquivo. */
export function archiveTitle(body: string): string {
  return editionStories(body).stories[0]?.headline ?? parseSummary(body)[0] ?? "Ler edição";
}
