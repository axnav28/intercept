type ListeningIndicatorProps = {
  label: string;
  pulse: boolean;
};

export function ListeningIndicator({ label, pulse }: ListeningIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-3 self-start rounded-full bg-[var(--chip-bg)] px-3 py-2 text-sm text-[var(--text-secondary)]">
      <span
        className={`inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ${
          pulse ? "animate-pulse" : ""
        }`}
      />
      <span>{label}</span>
    </div>
  );
}
