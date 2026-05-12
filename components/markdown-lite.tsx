"use client";
import React from "react";

/**
 * Tiny safe Markdown renderer for setup notes & templates.
 * Supports: paragraphs, **bold**, _italic_, `inline code`,
 *           numbered/bulleted lists, line breaks.
 * Intentionally does NOT support raw HTML or links (controlled environments).
 */
export function MarkdownLite({ text }: { text: string }) {
  const blocks = splitBlocks(text);
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "ul"; items: string[] };

function splitBlocks(text: string): Block[] {
  const out: Block[] = [];
  const paragraphs = text.split(/\n\s*\n/);
  for (const para of paragraphs) {
    const lines = para.split("\n").map((l) => l.trimEnd()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      out.push({ kind: "ol", items: lines.map((l) => l.replace(/^\s*\d+\.\s+/, "")) });
    } else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push({ kind: "ul", items: lines.map((l) => l.replace(/^\s*[-*]\s+/, "")) });
    } else {
      out.push({ kind: "p", lines });
    }
  }
  return out;
}

function renderBlock(block: Block, key: number) {
  if (block.kind === "ol") {
    return (
      <ol key={key} className="space-y-1.5 list-none pl-0">
        {block.items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md bg-foreground text-background text-[10px] font-medium tabular-nums">
              {i + 1}
            </span>
            <span>{renderInline(it)}</span>
          </li>
        ))}
      </ol>
    );
  }
  if (block.kind === "ul") {
    return (
      <ul key={key} className="space-y-1 list-disc pl-5 marker:text-muted-foreground">
        {block.items.map((it, i) => (
          <li key={i}>{renderInline(it)}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={key}>
      {block.lines.map((line, i) => (
        <React.Fragment key={i}>
          {renderInline(line)}
          {i < block.lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
}

/** Inline parser: **bold**, _italic_, `code`. Plain text otherwise. */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={i++} className="font-semibold">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("_")) {
      parts.push(<em key={i++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={i++} className="px-1 py-0.5 rounded bg-muted text-[12px] font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
