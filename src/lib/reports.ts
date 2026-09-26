import fs from "node:fs/promises";
import path from "node:path";

/**
 * Fonte de dados: `data/reports/` DENTRO deste repo, não mais a pasta irmã
 * Workspace/Stellar-Daily/.
 *
 * Motivo: o Vercel empacota só o que está no repositório git — não existe
 * disco persistente nem acesso à máquina local em produção. `Stellar-Daily/`
 * continua existindo como arquivo morto legível para humanos; as tarefas
 * agendadas sincronizam cada relatório novo para cá e fazem commit + push,
 * o que dispara o deploy automático no Vercel.
 *
 * Local dev lê daqui também, então o que você vê rodando `npm run dev` é
 * exatamente o que vai para produção — sem depender de a pasta irmã existir.
 */
export const REPORTS_DIR = path.resolve(process.cwd(), "data", "reports");

const REPORT_FILE = /^(\d{4}-\d{2}-\d{2})\.md$/;

export type Report = {
  /** Data COBERTA pelo relatório, que é o nome do arquivo. */
  date: string;
  body: string;
  /** Primeiro parágrafo depois do resumo, para a prévia na lista. */
  excerpt: string;
  sections: string[];
  /** Domínios citados — viram faceta de fonte. */
  sources: string[];
  mtimeMs: number;
};

function stripMarkdown(input: string): string {
  return input
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExcerpt(body: string): string {
  const afterTitle = body.replace(/^#[^\n]*\n/, "");
  const resumo = afterTitle.match(
    /\*\*Resumo em 3 linhas\*\*([\s\S]*?)(?=\n##|\n---)/,
  );
  const raw = resumo ? resumo[1] : afterTitle;
  const text = stripMarkdown(raw);
  return text.length > 240 ? `${text.slice(0, 240)}…` : text;
}

function extractSections(body: string): string[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)]
    .map((m) => m[1].trim())
    .filter(Boolean);
}

function extractSources(body: string): string[] {
  const hosts = new Set<string>();
  for (const m of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    try {
      hosts.add(new URL(m[1]).hostname.replace(/^www\./, ""));
    } catch {
      // URL malformada no relatório: ignora em silêncio, não vale quebrar a página.
    }
  }
  return [...hosts].sort();
}

/**
 * Lê o disco a cada chamada, sem cache: um relatório novo aparece
 * na próxima requisição sem precisar reiniciar o servidor.
 */
export async function getReports(): Promise<Report[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(REPORTS_DIR);
  } catch {
    return [];
  }

  const reports = await Promise.all(
    entries
      .filter((name) => REPORT_FILE.test(name))
      .map(async (name) => {
        const full = path.join(REPORTS_DIR, name);
        const [body, stat] = await Promise.all([
          fs.readFile(full, "utf8"),
          fs.stat(full),
        ]);
        const date = name.replace(/\.md$/, "");
        return {
          date,
          body,
          excerpt: extractExcerpt(body),
          sections: extractSections(body),
          sources: extractSources(body),
          mtimeMs: stat.mtimeMs,
        } satisfies Report;
      }),
  );

  return reports.sort((a, b) => b.date.localeCompare(a.date));
}

export type Pending = { body: string; openCount: number } | null;

export async function getPending(): Promise<Pending> {
  try {
    const body = await fs.readFile(
      path.join(REPORTS_DIR, "_PENDENTES.md"),
      "utf8",
    );
    // Conta linhas de tabela marcadas como `aberto`.
    const openCount = (body.match(/\|\s*`aberto`\s*\|/g) ?? []).length;
    return { body, openCount };
  } catch {
    return null;
  }
}

/** Assinatura barata do estado do disco, para o polling do cliente. */
export async function getSignature(): Promise<string> {
  const reports = await getReports();
  return reports.map((r) => `${r.date}:${Math.round(r.mtimeMs)}`).join("|");
}
