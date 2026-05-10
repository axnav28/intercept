export function EmptyMapState() {
  return (
    <section className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_34%),linear-gradient(180deg,rgba(241,245,249,0.85),rgba(226,232,240,0.95))] p-5 dark:bg-[radial-gradient(circle_at_top_left,_rgba(74,222,128,0.12),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))] sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          Context map
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          The response map activates once the caller describes the incident.
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          "Hospitals and trauma centres",
          "Ambulance and ALS coverage",
          "Police and rescue support",
          "Roadside emergency contacts"
        ].map((item) => (
          <div
            key={item}
            className="rounded-[22px] border border-white/45 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-900/45"
          >
            <p className="text-sm font-medium text-[var(--text-primary)]">{item}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Intercept will surface this automatically after semantic triggers are detected.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
