import type { ReactNode } from "react";

type DashboardShellProps = {
  topBar: ReactNode;
  alertStrip?: ReactNode;
  statusBar: ReactNode;
  transcript: ReactNode;
  map?: ReactNode;
  split: boolean;
};

export function DashboardShell({
  topBar,
  alertStrip,
  statusBar,
  transcript,
  map,
  split
}: DashboardShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <section className="rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-[var(--panel-shadow)]">
        <header className="border-b border-[var(--panel-border)] px-5 py-5 sm:px-7 sm:py-6">
          {topBar}
        </header>

        {alertStrip}

        <div className="border-b border-[var(--panel-border)] px-5 py-4 sm:px-7">
          {statusBar}
        </div>

        <section
          className={
            split
              ? "grid min-h-[calc(100vh-220px)] grid-rows-[minmax(0,0.85fr)_minmax(0,1.6fr)] gap-3 p-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.75fr)] lg:grid-rows-1"
              : "p-3"
          }
        >
          <div className="min-h-[calc(100vh-250px)] overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel-muted)]">
            {transcript}
          </div>

          {split && map ? (
            <div className="min-h-[52vh] overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-[var(--map-shell-bg)] lg:min-h-[calc(100vh-250px)]">
              {map}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
