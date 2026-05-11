type DemoAudioControlsProps = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function DemoAudioControls({
  isRunning,
  onStart,
  onPause,
  onReset
}: DemoAudioControlsProps) {
  return (
    <div className="flex h-full min-h-[132px] w-full flex-col rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
        Controls
      </p>
      <div className="mt-3 flex flex-1 flex-col gap-2">
      <ActionButton label="Start demo" onClick={onStart} disabled={isRunning} />
      <ActionButton label="Pause" onClick={onPause} disabled={!isRunning} />
      <ActionButton label="Reset" onClick={onReset} />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl border border-[var(--panel-border)] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {label}
    </button>
  );
}
