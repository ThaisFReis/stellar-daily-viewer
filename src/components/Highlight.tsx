import { fold } from "@/lib/text";

/**
 * Destaca ocorrências preservando o texto original (com acentos),
 * mesmo quando a busca veio sem eles.
 */
export default function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) return <>{text}</>;

  const haystack = fold(text);
  const needle = fold(query);
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let at = haystack.indexOf(needle);

  while (at !== -1) {
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(<mark key={`${at}-${cursor}`}>{text.slice(at, at + needle.length)}</mark>);
    cursor = at + needle.length;
    at = haystack.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));

  return <>{parts}</>;
}
