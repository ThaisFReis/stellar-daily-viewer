"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Report, Pending } from "@/lib/reports";
import { fold, formatDate, weekday, snippet, countMatches } from "@/lib/text";
import ReportBody from "./ReportBody";
import Highlight from "./Highlight";

const POLL_MS = 15_000;

type View = { kind: "report"; date: string } | { kind: "pending" };

export default function Viewer({
  initialReports,
  initialPending,
}: {
  initialReports: Report[];
  initialPending: Pending;
}) {
  const [reports, setReports] = useState(initialReports);
  const [pending, setPending] = useState(initialPending);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const [view, setView] = useState<View>(
    initialReports[0]
      ? { kind: "report", date: initialReports[0].date }
      : { kind: "pending" },
  );
  const [freshDates, setFreshDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [editionSection, setEditionSection] = useState("all");
  // No mobile o arquivo vira painel deslizante; no desktop o CSS ignora isto.
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [caderno, setCaderno] = useState<CadernoId>("stellar");
  const [periodo, setPeriodo] = useState<PeriodoId>("all");

  const searchRef = useRef<HTMLInputElement>(null);
  const signatureRef = useRef(
    initialReports.map((r) => `${r.date}:${Math.round(r.mtimeMs)}`).join("|"),
  );

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("sd-theme", next ? "dark" : "light");
    } catch {
      // Sem localStorage (janela privada) o tema simplesmente não persiste.
    }
  }

  const refresh = useCallback(async () => {
    const res = await fetch("/api/reports", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: { reports: Report[]; pending: Pending; signature: string } =
      await res.json();

    const known = new Set(reports.map((r) => r.date));
    const arrived = data.reports.map((r) => r.date).filter((d) => !known.has(d));

    const live = new Set(data.reports.map((r) => r.date));
    setReports(data.reports);
    setPending(data.pending);
    signatureRef.current = data.signature;
    // Um aviso só vale enquanto o arquivo existe: se o relatório sumiu do
    // disco, o aviso some junto, em vez de virar um link para lugar nenhum.
    setFreshDates((prev) => {
      const kept = prev.filter((d) => live.has(d));
      return arrived.length ? [...new Set([...arrived, ...kept])] : kept;
    });
    return arrived;
  }, [reports]);

  // Verifica só a assinatura do disco; baixa tudo apenas quando algo mudou.
  useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/reports?signature=1", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { signature } = (await res.json()) as { signature: string };
        if (cancelled || signature === signatureRef.current) return;
        await refresh();
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? `Sem contato com o servidor (${err.message})`
              : "Sem contato com o servidor",
          );
        }
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refresh]);

  // "/" foca a busca, como em leitor de notícias.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && typing) {
        (target as HTMLInputElement).blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!archiveOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setArchiveOpen(false);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [archiveOpen]);

  const sources = useMemo(() => {
    const all = new Set<string>();
    for (const r of reports) for (const s of r.sources) all.add(s);
    return [...all].sort();
  }, [reports]);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    return reports.filter((r) => {
      if (from && r.date < from) return false;
      if (until && r.date > until) return false;
      if (source !== "all" && !r.sources.includes(source)) return false;
      if (q && !fold(r.body).includes(q)) return false;
      return true;
    });
  }, [reports, query, source, from, until]);

  const current =
    view.kind === "report"
      ? (filtered.find((r) => r.date === view.date) ??
        filtered[0] ??
        null)
      : null;

  const hasFilters = Boolean(query || from || until || source !== "all");
  // Recorte de período ou fonte, sem contar a busca: é o que mantém o painel
  // de filtros aberto. Digitar na busca não deve escancarar os filtros.
  const recorteAtivo = Boolean(from || until || source !== "all");

  function clearFilters() {
    setQuery("");
    setSource("all");
    setFrom("");
    setUntil("");
    setPeriodo("all");
  }

  function aplicarPeriodo(id: PeriodoId) {
    setPeriodo(id);
    const dias = PERIODOS.find((item) => item.id === id)?.dias;
    if (!dias) {
      setFrom("");
      setUntil("");
      return;
    }
    // Janela ancorada em hoje e aberta no fim: uma edição de hoje nunca
    // deve cair fora de "últimos 7 dias" por causa de fuso ou arredondamento.
    const limite = new Date();
    limite.setDate(limite.getDate() - (dias - 1));
    setFrom(limite.toISOString().slice(0, 10));
    setUntil("");
  }

  const allSections = current ? splitEdition(current.body) : [];
  // Um caderno sem matéria nenhuma não vira aba: numa edição antiga, ou num dia
  // em que nada passou no funil, o caderno de contexto simplesmente não existe.
  const cadernosComMateria = CADERNOS.filter((item) =>
    allSections.some((section) => section.caderno === item.id),
  );
  const activeCaderno = cadernosComMateria.some((item) => item.id === caderno)
    ? caderno
    : (cadernosComMateria[0]?.id ?? "stellar");
  const introduction = current?.body.split(/^##\s+/m)[0].replace(/^#\s+[^\n]*\n/, "").trim() ?? "";
  const sections = hierarquizar(
    allSections.filter((section) => section.caderno === activeCaderno),
    introduction,
  );
  const activeSection = sections.some((section) => section.title === editionSection)
    ? editionSection : "all";
  const displayedSections = activeSection === "all"
    ? sections
    : sections.filter((section) => section.title === activeSection);
  const comMateria = sections.filter((section) => section.tier !== "vazia");

  // Três slots do card: destaques primeiro, completados pelas seções seguintes.
  const paraOCard = comMateria.slice(0, 3);
  const numeroEdicao = current
    ? String(reports.length - reports.findIndex((r) => r.date === current.date)).padStart(3, "0")
    : "";
  const urlEstudio = (() => {
    if (!current) return "";
    const p = new URLSearchParams({
      data: current.date,
      edicao: numeroEdicao,
      manchete: encurtar(primeiraFrase(introduction), 85),
      resumo: encurtar(
        introduction
          .replace(/\*\*Resumo em 3 linhas\*\*\s*[—–-]?\s*/, "")
          .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
          .replace(/[*_`#>]/g, "")
          .replace(/\s+/g, " ")
          .trim(),
        150,
      ),
    });
    paraOCard.forEach((secao, i) => {
      p.set(`l${i + 1}`, secao.title);
      p.set(`d${i + 1}`, chamada(secao.body));
    });
    return `/modelo-social.html?${p.toString()}`;
  })();
  // Dia em que nada passou no funil: o vazio vira a notícia, em vez de o leitor
  // atravessar sete seções repetindo "Nada relevante nesta janela".
  const edicaoQuieta = sections.length > 0 && comMateria.length === 0;
  // A lista vem da mais nova para a mais antiga: a anterior está uma posição adiante.
  const posicao = current ? filtered.findIndex((r) => r.date === current.date) : -1;
  const anterior = posicao >= 0 ? filtered[posicao + 1] : undefined;
  const seguinte = posicao > 0 ? filtered[posicao - 1] : undefined;
  const readingMinutes = current ? Math.max(1, Math.ceil(current.body.split(/\s+/).length / 220)) : 0;

  function abrirUltimaEdicao() {
    if (!reports[0]) return;
    clearFilters();
    openEdition(reports[0].date);
  }

  function abrirApuracao() {
    setView({ kind: "pending" });
    setArchiveOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openEdition(date: string) {
    setView({ kind: "report", date });
    setEditionSection("all");
    setCaderno("stellar");
    // Escolher uma edição no painel do mobile já devolve a tela para a leitura.
    setArchiveOpen(false);
    // O trilho fica parado enquanto a leitura rola: trocar de edição no meio de
    // uma matéria precisa devolver o leitor ao topo da nova.
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="newspaper">
      <a className="skip-link" href="#leitura">Ir para a leitura</a>
      <header className="topbar">
        <h1 className="wordmark">Hubble<Estrela /></h1>
        <p className="tagline">Um olhar diário sobre o universo onchain</p>
        <label className="search-box" htmlFor="busca">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
          <span className="sr-only">Buscar nas edições</span>
          <input id="busca" ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no jornal" autoComplete="off" />
          <kbd aria-hidden="true">/</kbd>
        </label>
        <button className="theme-button" type="button" onClick={toggleTheme}
          aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}>
          <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
        </button>
      </header>

      {freshDates.length > 0 && <div role="status" className="notice">
        Uma nova edição chegou. <button onClick={() => { clearFilters(); openEdition(freshDates[0]); setFreshDates([]); }}>Ler {formatDate(freshDates[0])} ↗</button>
        <button className="dismiss" aria-label="Dispensar aviso" onClick={() => setFreshDates([])}>×</button>
      </div>}
      {error && <div role="alert" className="notice error">{error}<button onClick={() => {
        refresh().then(() => setError(null)).catch(() => setError("Não foi possível atualizar. Tente novamente."));
      }}>Tentar novamente ↻</button></div>}

      <div className="mobile-archive-bar">
        <button onClick={() => setArchiveOpen(true)}>
          <span>Arquivo e filtros</span>
          <span className="mobile-archive-count">
            {hasFilters ? `${filtered.length}/${reports.length}` : String(reports.length).padStart(2, "0")}
            {hasFilters && <i aria-hidden="true" />}
          </span>
        </button>
      </div>

      <div className="edition-layout">
        {archiveOpen && <button className="archive-scrim" aria-label="Fechar arquivo" onClick={() => setArchiveOpen(false)} />}
        <aside
          id="arquivo"
          className={`archive-column${archiveOpen ? " is-open" : ""}`}
          aria-label="Arquivo de edições"
        >
          <div className="archive-grip" aria-hidden="true" />
          <button className="archive-close" onClick={() => setArchiveOpen(false)}>Fechar ×</button>
          <nav className="archive-nav" aria-label="Navegação principal">
            <button className={view.kind === "report" && current?.date === reports[0]?.date ? "selected" : ""} onClick={abrirUltimaEdicao}>
              Última edição
            </button>
            {pending && <button className={view.kind === "pending" ? "selected" : ""} onClick={abrirApuracao}>
              Em apuração <span>{pending.openCount}</span>
            </button>}
          </nav>
          {/* Período, datas e fonte ficam recolhidos: no dia a dia o trilho é só
              a lista de edições. Abrem sozinhos quando há um recorte ativo. */}
          <details className="filters" open={recorteAtivo || undefined}>
            <summary>
              <span className="archive-title">Arquivo <span>{String(reports.length).padStart(2, "0")}</span></span>
              <span className="filters-toggle">Filtrar <span aria-hidden="true">＋</span></span>
            </summary>
            <div className="periodo-chips" role="group" aria-label="Período">
              {PERIODOS.map((item) => (
                <button
                  key={item.id}
                  className={periodo === item.id ? "selected" : ""}
                  aria-pressed={periodo === item.id}
                  onClick={() => aplicarPeriodo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="date-filters">
              <label htmlFor="de">De<input id="de" type="date" value={from} max={until || undefined} onChange={(event) => { setFrom(event.target.value); setPeriodo("custom"); }} /></label>
              <label htmlFor="ate">Até<input id="ate" type="date" value={until} min={from || undefined} onChange={(event) => { setUntil(event.target.value); setPeriodo("custom"); }} /></label>
            </div>
            <label className="source-filter" htmlFor="fonte">Fonte citada<select id="fonte" value={source} onChange={(event) => setSource(event.target.value)}>
              <option value="all">Todas as fontes</option>{sources.map((item) => <option key={item} value={item}>{item}</option>)}
            </select></label>
          </details>
          {hasFilters && <div className="filter-status" role="status"><span>{filtered.length} de {reports.length} edições</span><button onClick={clearFilters}>Limpar ×</button></div>}
          <nav aria-label="Edições" className="edition-list">
            {filtered.map((report, indice) => {
              const active = current?.date === report.date && view.kind === "report";
              const hits = countMatches(report.body, query.trim());
              // Raio curto: no trilho estreito a ocorrência precisa cair nas primeiras linhas.
              const trecho = snippet(report.body, query.trim(), 45);
              const abreMes = report.date.slice(0, 7) !== filtered[indice - 1]?.date.slice(0, 7);
              return <Fragment key={report.date}>
                {abreMes && <h3 className="edition-month">{monthLabel(report.date)}</h3>}
                <button className={`edition-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => openEdition(report.date)}>
                  <span className="edition-day">{report.date.slice(8)}</span>
                  <span className="edition-weekday">{weekday(report.date).replace("-feira", "")}</span>
                  {report.date === reports[0]?.date && <span className="edition-latest">Última</span>}
                  {trecho && <span className="edition-snippet"><Highlight text={trecho} query={query.trim()} /></span>}
                  {hits > 0 && <span className="edition-hits">{hits} {hits === 1 ? "ocorrência" : "ocorrências"}</span>}
                </button>
              </Fragment>;
            })}
          </nav>
          {!filtered.length && <div className="archive-empty">{reports.length ? "Nenhuma edição encontrada. Ajuste os filtros para continuar." : "As próximas edições aparecerão aqui."}</div>}
        </aside>

        <main id="leitura" className={`reading-column${view.kind === "pending" && pending ? " is-wide" : ""}`} tabIndex={-1}>
          {view.kind === "pending" && pending ? <>
            <div className="eyebrow accent">Caderno de apuração <span>/</span> {pending.openCount} em aberto</div>
            <article className="pending-article"><ReportBody markdown={pending.body} query={query.trim()} /></article>
          </> : current ? <>
            {/* A data é a manchete: ela muda todo dia, um título fixo não. */}
            <header className="edition-heading">
              <div className="eyebrow accent">{weekday(current.date)} <span>/</span> Edição nº {numeroEdicao}</div>
              <h2>{longDate(current.date)}</h2>
              {edicaoQuieta && <p className="edition-description">
                Um dia sem notícia. Nenhuma editoria registrou matéria nesta janela. Um dia quieto também é informação: nada mudou que exigisse sua atenção.
              </p>}
              <div className="byline">
                <span>{readingMinutes} min de leitura</span>
                <span>{current.sources.length} fontes</span>
                {comMateria.length > 0 && (
                  <a className="byline-acao" href={urlEstudio} target="_blank" rel="noopener noreferrer">
                    Gerar imagem ↗
                  </a>
                )}
              </div>
            </header>
            {introduction && <section className="editorial-summary" aria-label="Resumo da edição"><span className="eyebrow">Em poucas linhas</span><ReportBody markdown={introduction.replace(/\*\*Resumo em 3 linhas\*\*\s*[—–-]?\s*/, "")} query={query.trim()} /></section>}
            {edicaoQuieta && (
              <div className="edicao-quieta">
                <span className="eyebrow">Editorias sem matéria</span>
                <ul>
                  {sections.map((section) => <li key={`quieta-${section.id}`}>{section.title}</li>)}
                </ul>
              </div>
            )}
            {cadernosComMateria.length > 1 && <nav className="caderno-nav" aria-label="Cadernos da edição">
              {cadernosComMateria.map((item) => {
                const total = allSections.filter((section) => section.caderno === item.id).length;
                return <button
                  key={item.id}
                  className={activeCaderno === item.id ? "selected" : ""}
                  aria-pressed={activeCaderno === item.id}
                  onClick={() => { setCaderno(item.id); setEditionSection("all"); }}
                >
                  <span className="caderno-label">{item.label}</span>
                  <span className="caderno-count">{String(total).padStart(2, "0")}</span>
                </button>;
              })}
            </nav>}
            {comMateria.length > 1 && <nav className="section-nav" aria-label="Editorias da edição">
              <button aria-pressed={activeSection === "all"} onClick={() => setEditionSection("all")}>Tudo</button>
              {/* Só editorias com matéria: oferecer uma seção vazia aqui levaria a
                  uma tela em branco. As vazias aparecem recolhidas ao fim. */}
              {comMateria.map((section) => <button key={section.id} aria-pressed={activeSection === section.title} onClick={() => setEditionSection(section.title)}>{section.title}</button>)}
            </nav>}
            <div className="stories">
              {displayedSections.filter((section) => section.tier !== "vazia").map((section) => (
                <article
                  key={`${current.date}-${section.id}`}
                  className={`story story-${section.tier}`}
                >
                  {/* O nome da editoria é rótulo; as manchetes são das notas. */}
                  <header className="story-head">
                    <h3>{section.tier === "destaque" && <Estrela />}{section.title}</h3>
                    <span>{section.tier === "destaque" && "Destaque"}{section.tier === "destaque" && contarNotas(section.body) > 0 && " · "}{rotuloNotas(section.body)}</span>
                  </header>
                  <ReportBody markdown={section.body} query={query.trim()} notas />
                </article>
              ))}
            </div>

            {/* As seções sem matéria viram uma linha só. Estão registradas,
                sem ocupar a tela repetindo a mesma frase. */}
            {displayedSections.some((section) => section.tier === "vazia") && !edicaoQuieta && (
              <div className="secoes-vazias">
                <span className="eyebrow">Sem matéria nesta edição</span>
                <ul>
                  {displayedSections.filter((section) => section.tier === "vazia").map((section) => (
                    <li key={`vazia-${section.id}`}>{section.title}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="endnote"><Estrela /> Fim da edição <Estrela /></div>
            {(anterior || seguinte) && <nav className="edition-pager" aria-label="Edições vizinhas">
              {anterior && <button onClick={() => openEdition(anterior.date)}><span>← Edição anterior</span>{shortDate(anterior.date)}</button>}
              {seguinte && <button className="pager-next" onClick={() => openEdition(seguinte.date)}><span>Edição seguinte →</span>{shortDate(seguinte.date)}</button>}
            </nav>}
          </> : <div className="empty-state"><span className="eyebrow">HUBBLE / ARQUIVO</span><h2>{reports.length ? "Uma nova busca, outra perspectiva." : "A próxima edição começa aqui."}</h2><p>{reports.length ? "Nenhuma edição corresponde aos filtros selecionados." : "Assim que o primeiro relatório chegar, as notícias aparecerão automaticamente neste espaço."}</p>{hasFilters && <button onClick={clearFilters}>Limpar filtros ↗</button>}</div>}
        </main>
      </div>
      <footer className="newspaper-footer"><a href="#" className="footer-brand">Hubble<Estrela /></a><span>Blockchain, Stellar e economia digital.</span><span>UM TELESCÓPIO APONTADO PARA A STELLAR.</span></footer>
    </div>
  );
}

/**
 * A marca do jornal: o Hubble observa estrelas, e a Stellar é a que ele
 * acompanha. A estrela ocupa o lugar do ponto final do nome. SVG, e não um
 * glifo "✦", para não depender da fonte de símbolos de cada sistema.
 */
function Estrela() {
  return (
    <svg className="estrela" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12C7.2 11.1 11.1 7.2 12 0Z" />
    </svg>
  );
}

/** Itens de primeiro nível da seção: cada um é uma nota. */
function contarNotas(body: string) {
  return (body.match(/^[-*]\s+/gm) ?? []).length;
}

function rotuloNotas(body: string) {
  const total = contarNotas(body);
  if (!total) return "";
  return `${total} ${total === 1 ? "nota" : "notas"}`;
}

function monthLabel(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function longDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(new Date(`${date}T12:00:00`));
}

function splitEdition(markdown: string) {
  const blocks = markdown.split(/^##\s+/m).slice(1);
  return blocks.map((block, id) => {
    const newline = block.indexOf("\n");
    const rawTitle = newline === -1 ? block : block.slice(0, newline);
    const title = rawTitle.replace(/^[^\p{L}\p{N}]+/u, "").trim();
    return {
      id,
      title,
      caderno: cadernoOf(title),
      body: newline === -1 ? "" : block.slice(newline + 1).trim(),
    };
  });
}

/**
 * Cadernos do jornal. A Stellar é o foco, então tudo pertence ao caderno
 * principal por padrão; só o material explicitamente de fora vai para o
 * caderno de contexto. Classificar pelo título mantém isto alinhado com os
 * títulos que o relatório já usa, sem exigir marcação extra no markdown.
 */
export const CADERNOS = [
  { id: "stellar", label: "Stellar" },
  { id: "web3", label: "Blockchain e Web3" },
] as const;

export type CadernoId = (typeof CADERNOS)[number]["id"];

function cadernoOf(title: string): CadernoId {
  const t = title.toLowerCase();
  const foraDaStellar =
    (t.includes("blockchain") && t.includes("web3")) ||
    t.includes("além da stellar") ||
    t.includes("alem da stellar");
  return foraDaStellar ? "web3" : "stellar";
}

/** Atalhos de período. `dias` ausente = sem recorte. */
export type PeriodoId = "all" | "7d" | "30d" | "365d" | "custom";

export const PERIODOS: readonly { id: PeriodoId; label: string; dias?: number }[] = [
  { id: "all", label: "Todas" },
  { id: "7d", label: "Semana", dias: 7 },
  { id: "30d", label: "Mês", dias: 30 },
  { id: "365d", label: "Ano", dias: 365 },
];

/* ---------------------------------------------------------------
 * Hierarquia da edição
 *
 * O relatório não diz qual seção importa mais, mas o resumo de 3 linhas já
 * carrega esse juízo: ele nomeia o que o dia teve de relevante. Cruzando os
 * termos distintivos do resumo com o corpo de cada seção descobrimos quais
 * seções o próprio relatório elegeu, sem precisar de marcação nova no markdown.
 * ------------------------------------------------------------- */

const PARADAS = new Set([
  "dia", "stellar", "para", "com", "uma", "que", "foi", "sem", "nova", "como",
  "mesmo", "depois", "ainda", "entre", "sobre", "pelos", "pela", "mais", "seu", "sua",
]);

/** Nomes próprios, siglas e códigos ("Protocol 28", "CAP-83", "USBDC"). */
function termosDistintivos(resumo: string): string[] {
  const brutos = resumo.match(/\b[A-ZÀ-Ý][\wÀ-ÿ.\-]{2,}(?:\s+\d+)?\b|\b[A-Z]{2,}[\w\-]*\b/g) ?? [];
  const vistos = new Set<string>();
  for (const bruto of brutos) {
    const termo = bruto.replace(/^[\s.,;:]+|[\s.,;:]+$/g, "");
    if (termo.length < 3 || PARADAS.has(termo.toLowerCase())) continue;
    vistos.add(termo);
  }
  return [...vistos];
}

/** Uma seção sem matéria. O relatório usa esta frase exata quando o dia não deu nada. */
function secaoVazia(body: string): boolean {
  return /nada relevante nesta janela/i.test(body) || body.trim().length < 40;
}

export type Tier = "destaque" | "normal" | "vazia";

/**
 * Ordena as seções: destaques do resumo primeiro, depois o resto por peso de
 * conteúdo, e as vazias por último — recolhidas, não repetidas em tamanho real.
 */
function hierarquizar<T extends { id: number; title: string; body: string }>(
  secoes: T[],
  resumo: string,
): (T & { tier: Tier })[] {
  const termos = termosDistintivos(resumo);
  const pontuadas = secoes.map((secao) => {
    const corpo = secao.body.toLowerCase();
    const acertos = termos.filter((termo) => corpo.includes(termo.toLowerCase())).length;
    return { secao, acertos, peso: secao.body.length, vazia: secaoVazia(secao.body) };
  });

  const maior = Math.max(0, ...pontuadas.filter((p) => !p.vazia).map((p) => p.acertos));
  // Teto de 3: o resumo tem três linhas, então no máximo três destaques.
  // Piso de 2 acertos evita promover uma seção por uma menção solta.
  const destaques = new Set(
    pontuadas
      .filter((p) => !p.vazia && p.acertos >= 2 && p.acertos >= maior * 0.5)
      .sort((a, b) => b.acertos - a.acertos || a.secao.id - b.secao.id)
      .slice(0, 3)
      .map((p) => p.secao.id),
  );

  const tier = (p: (typeof pontuadas)[number]): Tier =>
    p.vazia ? "vazia" : destaques.has(p.secao.id) ? "destaque" : "normal";

  const ordem: Record<Tier, number> = { destaque: 0, normal: 1, vazia: 2 };
  return pontuadas
    .sort((a, b) => {
      const d = ordem[tier(a)] - ordem[tier(b)];
      if (d !== 0) return d;
      if (tier(a) === "destaque") return a.secao.id - b.secao.id;
      return b.peso - a.peso;
    })
    .map((p) => ({ ...p.secao, tier: tier(p) }));
}

/* ---------------------------------------------------------------
 * Ponte para o estúdio social (public/modelo-social.html)
 *
 * A derivação mora aqui, não lá: o estúdio é HTML puro e duplicar
 * `hierarquizar()` em JS solto viraria drift na primeira mudança.
 * O jornal calcula e entrega pronto pela URL.
 * ------------------------------------------------------------- */

function primeiraFrase(resumo: string): string {
  const limpo = resumo
    .replace(/\*\*Resumo em 3 linhas\*\*\s*[—–-]?\s*/, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  // Corta só em fim de frase ou ponto e vírgula. Dois-pontos separa oração
  // ("Dia tecnicamente quieto: sem lançamento…") e cortar nele deixa um toco.
  const frase = limpo.split(/(?<=[.;!?])\s+/)[0] ?? limpo;
  return frase.trim();
}

function encurtar(texto: string, limite: number): string {
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite - 1);
  const espaco = corte.lastIndexOf(" ");
  return `${(espaco > limite * 0.6 ? corte.slice(0, espaco) : corte).replace(/[\s.,;:]+$/, "")}…`;
}

/** Primeira frase de uma seção, para virar linha de destaque no card. */
function chamada(body: string): string {
  const texto = body
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const frase = texto.split(/(?<=[.;!?])\s+/)[0] ?? texto;
  return encurtar(frase.trim(), 70);
}
