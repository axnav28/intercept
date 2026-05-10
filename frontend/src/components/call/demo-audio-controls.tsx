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
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--toggle-bg)] p-1">
      <ActionButton label="Start demo" onClick={onStart} disabled={isRunning} />
      <ActionButton label="Pause" onClick={onPause} disabled={!isRunning} />
      <ActionButton label="Reset" onClick={onReset} />
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
      className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:bg-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {label}
    </button>
  );
}
