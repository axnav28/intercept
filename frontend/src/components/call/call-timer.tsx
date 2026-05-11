import { useEffect, useState } from "react";

type CallTimerProps = {
  isRunning: boolean;
  isComplete: boolean;
  isFrozen?: boolean;
};

export function CallTimer({ isRunning, isComplete, isFrozen = false }: CallTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning || isFrozen) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isFrozen, isRunning]);

  useEffect(() => {
    if (!isRunning && !isComplete) {
      setElapsedSeconds(0);
    }
  }, [isComplete, isRunning]);

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");

  return (
    <div className="flex h-full min-h-[132px] flex-col items-center justify-center rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">
        Call timer
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-[2.15rem]">
        {minutes}:{seconds}
      </p>
    </div>
  );
}
