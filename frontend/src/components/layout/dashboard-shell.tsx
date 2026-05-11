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
      <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-[var(--panel-shadow)]">
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
              ? "grid h-[calc(100vh-255px)] min-h-0 grid-rows-[minmax(0,1.35fr)_minmax(0,0.95fr)] gap-3 overflow-hidden p-3 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.38fr)] lg:grid-rows-1"
              : "p-3"
          }
        >
          <div
            className={`min-h-0 overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel-muted)] ${
              split ? "order-2 lg:order-1" : ""
            }`}
          >
            {transcript}
          </div>

          {split && map ? (
            <div className="order-1 min-h-0 overflow-hidden rounded-[24px] border border-[var(--panel-border)] bg-[var(--map-shell-bg)] lg:order-2">
              {map}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
