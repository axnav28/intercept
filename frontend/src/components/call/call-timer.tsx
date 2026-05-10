import { useEffect, useState } from "react";

type CallTimerProps = {
  isRunning: boolean;
  isComplete: boolean;
};

export function CallTimer({ isRunning, isComplete }: CallTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning && !isComplete) {
      setElapsedSeconds(0);
    }
  }, [isComplete, isRunning]);

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");

  return (
    <div className="rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3 text-right">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
        Call timer
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
        {minutes}:{seconds}
      </p>
    </div>
  );
}
