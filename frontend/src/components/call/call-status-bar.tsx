import type { ReactNode } from "react";

type CallStatusBarProps = {
  modeLabel: string;
  connectionLabel: string;
  contextLabel: string;
  phaseLabel: string;
  rightSlot?: ReactNode;
};

export function CallStatusBar({
  modeLabel,
  connectionLabel,
  contextLabel,
  phaseLabel,
  rightSlot
}: CallStatusBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill label={modeLabel} tone="accent" />
          <StatusPill label={connectionLabel} tone="neutral" />
          <StatusPill label={phaseLabel} tone="neutral" />
          <StatusPill label="Tamil -> Hindi" tone="neutral" />
          <StatusPill label="Road accident mode" tone="neutral" />
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{contextLabel}</p>
      </div>
      {rightSlot}
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "accent" | "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        tone === "accent"
          ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          : "bg-[var(--chip-bg)] text-[var(--text-secondary)]"
      }`}
    >
      {label}
    </span>
  );
}
