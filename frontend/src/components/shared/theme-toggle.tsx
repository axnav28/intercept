type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-3 rounded-full border border-[var(--panel-border)] bg-[var(--toggle-bg)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
      aria-label="Toggle color theme"
    >
      <span>{theme === "light" ? "Light" : "Dark"}</span>
      <span className="inline-flex h-6 w-11 items-center rounded-full bg-[var(--toggle-track)] px-1">
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
