import type { TranscriptLine } from "../../hooks/use-transcript-simulation";

type TranscriptPanelProps = {
  title: string;
  subtitle: string;
  lines: readonly TranscriptLine[];
  partialText?: string;
};

export function TranscriptPanel({ title, subtitle, lines, partialText = "" }: TranscriptPanelProps) {
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

        <div className="flex h-full flex-col gap-3 overflow-y-auto px-5 py-5 sm:px-6">
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
              <p className="mt-3 text-base leading-7 text-[var(--text-primary)] sm:text-lg">{line.text}</p>
            </article>
          ))}

          {partialText ? (
            <article className="rounded-3xl border border-[var(--translated-border)] bg-[var(--translated-bg)] px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
                  Live translation
                </span>
                <span className="inline-flex items-center gap-2 text-xs text-[var(--accent-strong)]">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
                  Streaming
                </span>
              </div>
              <p className="mt-3 text-base leading-7 text-[var(--text-primary)] sm:text-lg">
                {partialText}
              </p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
