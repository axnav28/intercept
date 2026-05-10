type ScenarioCardProps = {
  phaseLabel: string;
};

export function ScenarioCard({ phaseLabel }: ScenarioCardProps) {
  return (
    <div className="rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
        Demo scenario
      </p>
      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">Rajan, NH-48, 11:43 PM</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Tamil-speaking caller, Delhi NCR dispatcher.
      </p>
      <p className="mt-3 text-sm text-[var(--accent-strong)]">{phaseLabel}</p>
    </div>
  );
}
