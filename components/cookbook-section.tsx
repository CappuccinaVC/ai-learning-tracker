"use client";
import type { CookbookSection, CookbookBlock } from "@/lib/data/cookbook";
import { Check, Copy, Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import React from "react";

const TRACK_DOT: Record<string, string> = {
  main: "bg-orange-500",
  image: "bg-purple-500",
  video: "bg-blue-500",
  audio: "bg-emerald-500",
};

const TRACK_LABEL: Record<string, string> = {
  main: "Main",
  image: "Image",
  video: "Video",
  audio: "Audio",
};

interface Props {
  section: CookbookSection;
  /** Show id-anchor for deep linking */
  anchor?: boolean;
  /** Compact = used inside task expansion */
  compact?: boolean;
}

export function CookbookSectionView({ section, anchor = true, compact = false }: Props) {
  return (
    <article
      id={anchor ? `cookbook-${section.id}` : undefined}
      className={cn(
        "scroll-mt-24",
        compact ? "" : "rounded-xl border border-border bg-card p-5 sm:p-6"
      )}
    >
      <header className="space-y-2 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full", TRACK_DOT[section.track])} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {TRACK_LABEL[section.track]} · §{section.number}
          </span>
          {section.tags?.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
        <h2 className={cn("font-semibold tracking-tight", compact ? "text-lg" : "text-xl sm:text-2xl")}>
          {section.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{section.summary}</p>
      </header>

      <div className="space-y-4">
        {section.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>
    </article>
  );
}

// ----------------------------------------------------------------------------------

function BlockView({ block }: { block: CookbookBlock }) {
  switch (block.kind) {
    case "para":
      return <p className="text-sm leading-relaxed">{renderInline(block.text)}</p>;

    case "subheading":
      return (
        <h3 className="text-sm font-semibold tracking-tight text-foreground mt-2 mb-1">
          {block.text}
        </h3>
      );

    case "list":
      if (block.ordered) {
        return (
          <ol className="space-y-1.5 text-sm leading-relaxed list-none pl-0">
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
      return (
        <ul className="space-y-1 list-disc pl-5 marker:text-muted-foreground text-sm leading-relaxed">
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );

    case "code":
      return <CodeBlock block={block} />;

    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 align-top leading-relaxed">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout":
      return <CalloutBlock block={block} />;
  }
}

// ----------------------------------------------------------------------------------

function CodeBlock({ block }: { block: Extract<CookbookBlock, { kind: "code" }> }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-background">
      {block.title && (
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border bg-muted/40">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {block.title}
          </p>
          <span className="text-[10px] font-mono text-muted-foreground/80 uppercase">{block.language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="text-[12px] leading-relaxed font-mono p-4 overflow-x-auto whitespace-pre">
          <code className={cn(block.language === "json" && "language-json")}>{block.code}</code>
        </pre>
        <button
          onClick={copy}
          className="absolute top-2 right-2 inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition-colors"
          aria-label="Copy"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------------

const CALLOUT_STYLES = {
  tip: {
    container: "border-amber-500/40 bg-amber-500/[0.06]",
    icon: "text-amber-500",
    Icon: Lightbulb,
  },
  info: {
    container: "border-sky-500/40 bg-sky-500/[0.06]",
    icon: "text-sky-500",
    Icon: Info,
  },
  warn: {
    container: "border-rose-500/40 bg-rose-500/[0.06]",
    icon: "text-rose-500",
    Icon: AlertTriangle,
  },
};

function CalloutBlock({ block }: { block: Extract<CookbookBlock, { kind: "callout" }> }) {
  const style = CALLOUT_STYLES[block.tone];
  const Icon = style.Icon;
  return (
    <div className={cn("rounded-lg border p-4 flex items-start gap-3", style.container)}>
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", style.icon)} />
      <div className="space-y-1 text-sm leading-relaxed">
        {block.title && <p className="font-semibold">{block.title}</p>}
        <p>{renderInline(block.text)}</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------------

/** Inline parser for **bold**, _italic_, `code` */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={i++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
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
