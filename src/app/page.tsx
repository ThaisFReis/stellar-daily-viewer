import Link from "next/link";
import { getReports } from "@/lib/reports";
import { homeData } from "@/lib/home";
import { formatDate } from "@/lib/text";
import IrisMark from "@/components/IrisMark";
import ReportBody from "@/components/ReportBody";
import HomeTheme from "@/components/HomeTheme";
import "./home.css";
export const dynamic = "force-dynamic";
export default async function Home(){
 const reports=await getReports(); const report=reports[0]; const data=report?homeData(report.body):null;
 const href=report?`/edicoes?date=${report.date}`:"/edicoes";
 return <div className="home-paper"><a className="skip-link" href="#home-content">Ir para as notícias</a>
 <header className="home-header"><Link href="/" className="home-brand"><IrisMark/>Íris</Link><span>Um olhar sobre a Stellar</span><Link href="/edicoes">Arquivo e busca</Link><HomeTheme/></header>
 <main id="home-content">{report&&data?<>
 <div className="home-state"><time dateTime={report.date}>{formatDate(report.date)}</time><details><summary>{data.status.startsWith("✅")?"Edição fechada":data.status.startsWith("⏳")?"Edição em andamento":"Fechamento não informado"}</summary><p>{data.status}</p></details><span>{Math.max(1,Math.ceil(report.body.split(/\s+/).length/220))} min de leitura</span></div>
 <div className="home-access"><div><span className="home-label">A edição por inteiro</span><p>Todos os assuntos, fontes e contexto do dia.</p></div><Link className="home-cta" href={href}>Ler caderno completo <span aria-hidden="true">↗</span></Link></div>
 <div className="home-opening"><section className="home-summary"><span className="home-label">Primeira luz</span><h2>O dia em poucas linhas</h2><ol>{data.summary.map((s,i)=><li key={i}>{s}</li>)}</ol></section>
 <div className="home-news">{data.stories.length? <><article className="home-lead"><span className="home-label">Manchete · {data.stories[0].title}</span><h1><Link href={href}>{data.stories[0].headline}</Link></h1>{data.stories[0].headline.includes("Byetery") && /bateria.*reciclagem/.test(data.stories[0].note) && <figure className="home-visual"><svg viewBox="0 0 400 340" role="img" aria-label="Byetery: devolução da bateria e reciclagem, com rastreamento em Soroban"><circle cx="200" cy="170" r="120" fill="none" stroke="currentColor" strokeDasharray="4 7"/><rect x="155" y="105" width="90" height="130" rx="6" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M205 125 L177 178 H204 L190 220 L225 162 H200 Z" fill="currentColor"/><text x="200" y="30" textAnchor="middle">DEVOLUÇÃO</text><text x="200" y="320" textAnchor="middle">RECICLAGEM</text></svg><figcaption>Byetery · rastreamento em Soroban e recompensa em cada etapa. Diagrama da descrição publicada.</figcaption></figure>}<ReportBody markdown={data.stories[0].note} query=""/><Link className="home-read" href={href}>Continuar no caderno ↗</Link></article><div className="home-highlights">{data.stories.slice(1).map((s,i)=><article key={s.title}><span className="home-label">{i+2} · {s.title}</span><h2><Link href={href}>{s.headline}</Link></h2><ReportBody markdown={s.note} query=""/></article>)}</div></>:<article className="home-lead"><h1>Um dia sem notícia.</h1><p>Nenhuma novidade nas editorias principais desta edição.</p></article>}</div></div>
 {data.agenda&&<section className="home-section"><header><div><span className="home-label">Próximos dias</span><h2>Agenda da edição</h2></div><Link href={href}>Ver edição completa ↗</Link></header><ReportBody markdown={data.agenda.body} query=""/></section>}
 <section className="home-section"><header><div><span className="home-label">Dias anteriores</span><h2>Últimas edições</h2></div><Link href="/edicoes">Arquivo completo ↗</Link></header><div className="home-archive">{reports.slice(1,5).map(r=><Link key={r.date} href={`/edicoes?date=${r.date}`}><strong>{r.date.slice(8)}</strong><time>{formatDate(r.date)}</time><p>{homeData(r.body).stories[0]?.headline??homeData(r.body).summary[0]??"Ler edição"}</p></Link>)}</div></section>
 {data.beyond&&<section className="home-section"><header><div><span className="home-label">Além da Stellar</span><h2>Outras redes, mesmo dia</h2></div><Link className="home-cta home-outline" href={`${href}&caderno=web3`}>Ler Além da Stellar ↗</Link></header><ReportBody markdown={data.beyond.body} query=""/></section>}
 </>:<section className="home-section"><h1>A próxima edição começa aqui.</h1><p>As notícias aparecerão assim que a primeira edição for publicada.</p></section>}</main>
 <footer className="home-footer">Íris · Um olhar sobre a Stellar</footer></div>
}
