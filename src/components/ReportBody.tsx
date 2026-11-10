"use client";

import { Children, isValidElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight from "./Highlight";

/** Aplica o destaque só em filhos que são texto puro, sem tocar na estrutura. */
function withHighlight(children: React.ReactNode, query: string): React.ReactNode {
  if (!query.trim()) return children;
  if (typeof children === "string") return <Highlight text={children} query={query} />;
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? (
        <Highlight key={i} text={child} query={query} />
      ) : (
        child
      ),
    );
  }
  return children;
}

/**
 * Parágrafo que é só um negrito: o relatório usa isso como intertítulo dentro
 * da seção ("**Resolvidas sem virar notícia nova**" seguido de uma lista).
 */
function soNegrito(children: React.ReactNode): boolean {
  const unico = Array.isArray(children)
    ? (children.length === 1 ? children[0] : null)
    : children;
  return isValidElement(unico) && unico.type === "strong";
}

/** Texto plano de um nó, para testar pontuação sem depender da estrutura. */
function textoDe(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textoDe).join("");
  if (isValidElement<{ children?: React.ReactNode }>(node)) return textoDe(node.props.children);
  return "";
}

/** A frase que o relatório usa para dizer o que o fato muda para quem lê. */
const PORQUE = /(Por que importa[^:.]{0,40}):\s*/;

/**
 * Um item de lista do relatório vira uma nota de jornal:
 *
 * - "**Templar lança o Precept.** É um protocolo…" — o negrito é uma frase
 *   completa, então sobe para manchete da nota e o resto vira o corpo.
 * - "**DTCC tokeniza…** está recirculando" ou "**Bell:** nada novo" — o negrito
 *   é sujeito ou rótulo de uma frase que continua; separar quebraria a
 *   gramática, então fica corrido.
 * - "Por que importa para dev BR: …" sai do meio do parágrafo e vira um bloco
 *   rotulado: é leitura, não fato, e a página mostra a diferença.
 */
function Nota({ children, query }: { children: React.ReactNode; query: string }) {
  const filhos = Children.toArray(children);
  // Lista "solta" (itens com parágrafos) ou com sublista: não dá para
  // reorganizar sem aninhar bloco dentro de parágrafo. Fica como veio.
  const temBloco = filhos.some(
    (filho) => isValidElement(filho) && ["p", "ul", "ol"].includes(String(filho.type)),
  );
  if (temBloco) return <li>{withHighlight(children, query)}</li>;

  const primeiro = filhos[0];
  const abreEmNegrito = isValidElement<{ children?: React.ReactNode }>(primeiro) && primeiro.type === "strong";
  const ehManchete = abreEmNegrito && /[.!?]["”')]?$/.test(textoDe(primeiro).trim());

  let titulo: React.ReactNode[] | null = null;
  let corpo = filhos;
  if (ehManchete) {
    titulo = Children.toArray(primeiro.props.children);
    const fim = titulo[titulo.length - 1];
    if (typeof fim === "string") titulo[titulo.length - 1] = fim.replace(/\.$/, "");
    corpo = filhos.slice(1);
    if (typeof corpo[0] === "string") corpo[0] = corpo[0].trimStart();
  }

  let rotulo: string | null = null;
  let leitura: React.ReactNode[] = [];
  const onde = corpo.findIndex((filho) => typeof filho === "string" && PORQUE.test(filho));
  if (onde !== -1) {
    const texto = corpo[onde] as string;
    const achado = PORQUE.exec(texto)!;
    rotulo = achado[1];
    leitura = [texto.slice(achado.index + achado[0].length), ...corpo.slice(onde + 1)];
    corpo = [...corpo.slice(0, onde), texto.slice(0, achado.index).trimEnd()];
  }

  if (!titulo && !rotulo) return <li className="nota-corrida">{withHighlight(children, query)}</li>;

  const temCorpo = corpo.some((filho) => typeof filho !== "string" || filho.trim());
  return (
    <li className={titulo ? "nota" : "nota-corrida"}>
      {titulo && <h4 className="nota-titulo">{withHighlight(titulo, query)}</h4>}
      {temCorpo && <p>{withHighlight(corpo, query)}</p>}
      {rotulo && (
        <p className="nota-porque">
          <span>{rotulo}</span>
          {withHighlight(leitura, query)}
        </p>
      )}
    </li>
  );
}

export default function ReportBody({
  markdown,
  query,
  notas = false,
}: {
  markdown: string;
  query: string;
  /** Trata cada item de lista como nota de jornal. Só nas seções da edição. */
  notas?: boolean;
}) {
  const components: Components = {
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    ),
    p: ({ children }) => (
      <p className={soNegrito(children) ? "subhead" : undefined}>
        {withHighlight(children, query)}
      </p>
    ),
    li: ({ children }) =>
      notas ? <Nota query={query}>{children}</Nota> : <li>{withHighlight(children, query)}</li>,
    td: ({ children }) => <td>{withHighlight(children, query)}</td>,
    h2: ({ children }) => (
      <h2 className="scroll-mt-24 border-b border-border pb-2">{children}</h2>
    ),
  };

  return (
    <div
      className="report-prose"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
