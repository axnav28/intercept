type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex min-h-[54px] w-full items-center justify-between rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3 text-left transition hover:border-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
      aria-label="Toggle color theme"
    >
      <div className="pr-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
          Dark mode
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
          {theme === "dark" ? "On" : "Off"}
        </p>
      </div>
      <span className="inline-flex h-7 w-12 items-center rounded-full bg-[var(--toggle-track)] px-1">
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
