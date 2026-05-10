import { useEffect, useState } from "react";

import { DashboardShell } from "./components/layout/dashboard-shell";
import { ThemeToggle } from "./components/shared/theme-toggle";
import { TranscriptPanel } from "./components/transcript/transcript-panel";
import { CallStatusBar } from "./components/call/call-status-bar";
import { ListeningIndicator } from "./components/call/listening-indicator";
import { EmptyMapState } from "./components/map/empty-map-state";
import { DemoAudioControls } from "./components/call/demo-audio-controls";
import { useTranscriptSimulation } from "./hooks/use-transcript-simulation";

type ThemeMode = "light" | "dark";
type CallStage = "transcript" | "response";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [stage] = useState<CallStage>("transcript");
  const { isRunning, lines, partialText, start, pause, reset } = useTranscriptSimulation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <DashboardShell
        topBar={
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                Intercept
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                Live multilingual dispatch console
              </h1>
            </div>
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "light" ? "dark" : "light")} />
          </div>
        }
        statusBar={
          <CallStatusBar
            modeLabel="Transcript only"
            connectionLabel={isRunning ? "Streaming demo call" : "Demo standby"}
            rightSlot={
              <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center">
                <ListeningIndicator
                  label={isRunning ? "Receiving translated speech" : "Awaiting caller speech"}
                  pulse={isRunning}
                />
                <DemoAudioControls
                  isRunning={isRunning}
                  onStart={start}
                  onPause={pause}
                  onReset={reset}
                />
              </div>
            }
          />
        }
        transcript={
          <TranscriptPanel
            title="Live translated transcript"
            subtitle="Tamil speech will appear here directly in Hindi for the dispatcher."
            lines={lines}
            partialText={partialText}
          />
        }
        map={stage === "response" ? <EmptyMapState /> : undefined}
        split={stage === "response"}
      />
    </div>
  );
}
