"use client";

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

export default function ReportBody({
  markdown,
  query,
}: {
  markdown: string;
  query: string;
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
    p: ({ children }) => <p>{withHighlight(children, query)}</p>,
    li: ({ children }) => <li>{withHighlight(children, query)}</li>,
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
