import { extractHeadline } from "./text";
export function plain(text: string) { return text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`#>]/g, "").trim(); }
export function homeData(body: string) {
 const intro = body.split(/^## /m)[0];
 const summary = (intro.split(/\*\*Resumo em 3 linhas\*\*/)[1] ?? "").split("\n").filter(l => /^\s*(?:\d+[.)]|-)\s/.test(l)).map(l => plain(l.replace(/^\s*(?:\d+[.)]|-)\s+/, "")));
 const sections = body.split(/^## /m).slice(1).map(block => { const [title, ...lines] = block.split("\n"); return {title, body: lines.join("\n").trim()}; });
 const news = sections.filter(s => /^[🚀🤝🗺🛠📈]/u.test(s.title) && !/^Nada relevante nesta janela[.!]?$/i.test(s.body.trim()) && s.body.length > 0);
 const terms = summary.join(" ").match(/\b[A-Z][\w-]{3,}/g) ?? [];
 news.sort((a,b) => terms.filter(t=>b.body.includes(t)).length - terms.filter(t=>a.body.includes(t)).length);
 const stories = news.slice(0,3).map(s => {const note = s.body.match(/^[-*] (.+)$/m)?.[1] ?? s.body; const headline = extractHeadline("- " + note); return {...s, headline: headline ?? plain(note).split(/(?<=[.!?])\s/)[0], note: headline ? note.replace(/^\*\*[^*]+\*\*\s*/, "") : note};});
 return {summary, stories, status: intro.match(/^>\s*[⏳✅].+$/m)?.[0].replace(/^>\s*/, "") ?? "Estado de fechamento não informado", agenda: sections.find(s=>s.title.includes("📅")), beyond: sections.find(s=>/além da Stellar/i.test(s.title))};
}
