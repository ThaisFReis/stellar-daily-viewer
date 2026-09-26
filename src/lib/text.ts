/** Normaliza para busca: sem acento, sem caixa. "Ressurgência" acha "ressurgencia". */
export function fold(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function weekday(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
}

/** Trecho ao redor da primeira ocorrência, para a prévia na lista. */
export function snippet(body: string, query: string, radius = 90): string | null {
  if (!query) return null;
  const at = fold(body).indexOf(fold(query));
  if (at === -1) return null;
  const start = Math.max(0, at - radius);
  const end = Math.min(body.length, at + query.length + radius);
  const raw = body
    .slice(start, end)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${start > 0 ? "…" : ""}${raw}${end < body.length ? "…" : ""}`;
}

export function countMatches(body: string, query: string): number {
  if (!query) return 0;
  const f = fold(body);
  const q = fold(query);
  let count = 0;
  let i = f.indexOf(q);
  while (i !== -1) {
    count += 1;
    i = f.indexOf(q, i + q.length);
  }
  return count;
}
