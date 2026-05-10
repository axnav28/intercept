import { useEffect, useRef } from "react";

import type { TranscriptLine } from "../../hooks/use-call-session";

type TranscriptPanelProps = {
  title: string;
  subtitle: string;
  lines: readonly TranscriptLine[];
  partialLine?: TranscriptLine | null;
  isComplete?: boolean;
};

export function TranscriptPanel({
  title,
  subtitle,
  lines,
  partialLine = null,
  isComplete = false
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [lines, partialLine]);

  return (
    <section className="flex h-full flex-col">
      <div className="border-b border-[var(--panel-border)] px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent-strong)]">
          Transcript
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">{subtitle}</p>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--panel-muted)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--panel-muted)] to-transparent" />

        <div ref={scrollRef} className="flex h-full flex-col gap-3 overflow-y-auto px-5 py-5 sm:px-6">
          {lines.map((line) => (
            <article
              key={line.id}
              className={`rounded-3xl border px-4 py-4 ${
                line.tone === "system"
                  ? "border-[var(--system-border)] bg-[var(--system-bg)]"
                  : "border-[var(--translated-border)] bg-[var(--translated-bg)]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
                  {line.tone === "system" ? "Dispatch prompt" : "Hindi translation"}
                </span>
                <time className="text-xs text-[var(--text-faint)]">{line.time}</time>
              </div>
              {line.sourceText ? (
                <div className="mt-3 rounded-2xl border border-[var(--source-border)] bg-[var(--source-bg)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Caller speaking in Tamil
                  </p>
                  <p className="mt-2 text-base leading-7 text-[var(--text-primary)] sm:text-lg">
                    {line.sourceText}
                  </p>
                </div>
              ) : null}
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Dispatcher view in Hindi
                </p>
                <p className="mt-2 text-base leading-7 text-[var(--text-primary)] sm:text-lg">
                  {line.translatedText}
                </p>
              </div>
            </article>
          ))}

          {partialLine ? (
            <article className="rounded-3xl border border-[var(--translated-border)] bg-[var(--translated-bg)] px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
                  Live bilingual transcript
                </span>
                <span className="inline-flex items-center gap-2 text-xs text-[var(--accent-strong)]">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
                  Streaming
                </span>
              </div>
              {partialLine.sourceText ? (
                <div className="mt-3 rounded-2xl border border-[var(--source-border)] bg-[var(--source-bg)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Caller speaking in Tamil
                  </p>
                  <p className="mt-2 text-base leading-7 text-[var(--text-primary)] sm:text-lg">
                    {partialLine.sourceText}
                  </p>
                </div>
              ) : null}
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Dispatcher view in Hindi
                </p>
                <p className="mt-2 text-base leading-7 text-[var(--text-primary)] sm:text-lg">
                  {partialLine.translatedText}
                </p>
              </div>
            </article>
          ) : null}

          {isComplete ? (
            <div className="rounded-3xl border border-[var(--panel-border)] bg-[var(--chip-bg)] px-4 py-4 text-sm text-[var(--text-secondary)]">
              Demo call complete. The dispatcher can replay the scenario to present the flow again.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
