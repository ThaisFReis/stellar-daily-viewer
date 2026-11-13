import Link from "next/link";
import { getReports, type Report } from "@/lib/reports";
import { archiveTitle, frontPage, type FrontPage, type Story } from "@/lib/home";
import { formatDate } from "@/lib/text";
import IrisMark from "@/components/IrisMark";
import ReportBody from "@/components/ReportBody";
import HomeTheme from "@/components/HomeTheme";
import "./home.css";

export const dynamic = "force-dynamic";

const editionHref = (date: string) => `/edicoes?date=${date}`;

function statusLabel(status: string): string {
  if (status.startsWith("✅")) return "Edição fechada";
  if (status.startsWith("⏳")) return "Edição em andamento";
  return "Fechamento não informado";
}

function readingMinutes(body: string): number {
  return Math.max(1, Math.ceil(body.split(/\s+/).length / 220));
}

/** "Da edição de 12/11": a origem vai em texto, não só em cor. */
function originLabel(story: Story): string | null {
  return story.fromDate ? `Da edição de ${formatDate(story.fromDate).slice(0, 5)}` : null;
}

function HomeHeader() {
  return (
    <header className="home-header">
      <Link href="/" className="home-brand">
        <IrisMark />
        Íris
      </Link>
      <span>Um olhar sobre a Stellar</span>
      <Link href="/edicoes">Arquivo e busca</Link>
      <HomeTheme />
    </header>
  );
}

function EditionState({ report, data }: { report: Report; data: FrontPage }) {
  return (
    <div className="home-state">
      <time dateTime={report.date}>{formatDate(report.date)}</time>
      <details>
        <summary>{statusLabel(data.status)}</summary>
        <p>{data.status}</p>
      </details>
      <span>{readingMinutes(report.body)} min de leitura</span>
    </div>
  );
}

function EditionAccess({ href }: { href: string }) {
  return (
    <div className="home-access">
      <div>
        <span className="home-label">A edição por inteiro</span>
        <p>Todos os assuntos, fontes e contexto do dia.</p>
      </div>
      <Link className="home-cta" href={href}>
        Ler caderno completo <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}

function FirstLight({ summary }: { summary: string[] }) {
  return (
    <section className="home-summary">
      <span className="home-label">Primeira luz</span>
      <h2>O dia em poucas linhas</h2>
      <ol>
        {summary.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </section>
  );
}

function Lead({ story, href }: { story: Story; href: string }) {
  const origin = originLabel(story);
  const link = story.fromDate ? editionHref(story.fromDate) : href;
  return (
    <article className="home-lead">
      <span className="home-label">Manchete · {story.section}</span>
      {origin && <p className="home-origin">{origin}</p>}
      <h1>
        <Link href={link}>{story.headline}</Link>
      </h1>
      {story.note && <ReportBody markdown={story.note} query="" />}
      <Link className="home-read" href={link}>
        Continuar no caderno ↗
      </Link>
    </article>
  );
}

function Highlights({ stories, href }: { stories: Story[]; href: string }) {
  if (!stories.length) return null;
  return (
    <div className="home-highlights">
      {stories.map((story, i) => (
        <article key={story.section}>
          <span className="home-label">
            {i + 2} · {story.section}
          </span>
          <h2>
            <Link href={href}>{story.headline}</Link>
          </h2>
          <ReportBody markdown={story.note} query="" />
        </article>
      ))}
    </div>
  );
}

function Opening({ data, href }: { data: FrontPage; href: string }) {
  const [lead, ...rest] = data.stories;
  // Quando o Resumo já é a manchete, não repete a Primeira luz ao lado.
  const showSummary = data.source !== "resumo" && data.summary.length > 0;
  const layout = rest.length ? "is-full" : "is-single";
  return (
    <div className={`home-opening ${layout}`} data-stories={data.stories.length}>
      {showSummary && <FirstLight summary={data.summary} />}
      <div className="home-news">
        {lead ? (
          <>
            <Lead story={lead} href={href} />
            <Highlights stories={rest} href={href} />
          </>
        ) : (
          <article className="home-lead">
            <h1>A edição está sendo preparada.</h1>
            <p>As notícias aparecem aqui assim que o editor publicar o primeiro plantão.</p>
          </article>
        )}
      </div>
    </div>
  );
}

function Agenda({ data, href }: { data: FrontPage; href: string }) {
  if (!data.agenda) return null;
  return (
    <section className="home-section">
      <header>
        <div>
          <span className="home-label">Próximos dias</span>
          <h2>Agenda da edição</h2>
        </div>
        <Link href={href}>Ver edição completa ↗</Link>
      </header>
      <ReportBody markdown={data.agenda.body} query="" />
    </section>
  );
}

function Archive({ reports }: { reports: Report[] }) {
  return (
    <section className="home-section">
      <header>
        <div>
          <span className="home-label">Dias anteriores</span>
          <h2>Últimas edições</h2>
        </div>
        <Link href="/edicoes">Arquivo completo ↗</Link>
      </header>
      <div className="home-archive">
        {reports.map((r) => (
          <Link key={r.date} href={editionHref(r.date)}>
            <strong>{r.date.slice(8)}</strong>
            <time>{formatDate(r.date)}</time>
            <p>{archiveTitle(r.body)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Beyond({ data, href }: { data: FrontPage; href: string }) {
  if (!data.beyond) return null;
  return (
    <section className="home-section">
      <header>
        <div>
          <span className="home-label">Além da Stellar</span>
          <h2>Outras redes, mesmo dia</h2>
        </div>
        <Link className="home-cta home-outline" href={`${href}&caderno=web3`}>
          Ler Além da Stellar ↗
        </Link>
      </header>
      <ReportBody markdown={data.beyond.body} query="" />
    </section>
  );
}

function NoEdition() {
  return (
    <section className="home-section">
      <h1>A próxima edição começa aqui.</h1>
      <p>As notícias aparecerão assim que a primeira edição for publicada.</p>
    </section>
  );
}

export default async function Home() {
  const reports = await getReports();
  const report = reports[0];
  const data = frontPage(reports, (msg) => console.warn(msg));
  const href = report ? editionHref(report.date) : "/edicoes";

  return (
    <div className="home-paper">
      <a className="skip-link" href="#home-content">
        Ir para as notícias
      </a>
      <HomeHeader />
      <main id="home-content">
        {report && data ? (
          <>
            <EditionState report={report} data={data} />
            <EditionAccess href={href} />
            <Opening data={data} href={href} />
            <Agenda data={data} href={href} />
            <Archive reports={reports.slice(1, 5)} />
            <Beyond data={data} href={href} />
          </>
        ) : (
          <NoEdition />
        )}
      </main>
      <footer className="home-footer">Íris · Um olhar sobre a Stellar</footer>
    </div>
  );
}
