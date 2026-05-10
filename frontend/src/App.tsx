import { useEffect, useState } from "react";

import { DashboardShell } from "./components/layout/dashboard-shell";
import { TopAlertStrip } from "./components/layout/top-alert-strip";
import { ThemeToggle } from "./components/shared/theme-toggle";
import { TranscriptPanel } from "./components/transcript/transcript-panel";
import { CallStatusBar } from "./components/call/call-status-bar";
import { ListeningIndicator } from "./components/call/listening-indicator";
import { EmergencyMap } from "./components/map/emergency-map";
import { DemoAudioControls } from "./components/call/demo-audio-controls";
import { useCallSession } from "./hooks/use-call-session";
import { emergencyServices } from "./data/nh48-services";

type ThemeMode = "light" | "dark";
type CallStage = "transcript" | "response";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const { alert, analysis, connectionStatus, isRunning, lines, mapContext, partialText, start, pause, reset } =
    useCallSession();

  const stage: CallStage = analysis.emergencyDetected ? "response" : "transcript";

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
        alertStrip={alert ? <TopAlertStrip title={alert.title} level={alert.level} /> : undefined}
        statusBar={
          <CallStatusBar
            modeLabel={stage === "response" ? "Split response view" : "Transcript only"}
            connectionLabel={
              connectionStatus === "ready"
                ? isRunning
                  ? "Streaming demo call"
                  : "Demo standby"
                : "Connecting backend"
            }
            contextLabel={analysis.summary}
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
        map={
          stage === "response" ? (
            <EmergencyMap
              services={emergencyServices}
              highlightedIds={mapContext.highlightedIds}
              focus={mapContext.focus}
            />
          ) : undefined
        }
        split={stage === "response"}
      />
    </div>
  );
}
