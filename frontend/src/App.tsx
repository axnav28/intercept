import { useEffect, useState } from "react";

import { DashboardShell } from "./components/layout/dashboard-shell";
import { ThemeToggle } from "./components/shared/theme-toggle";
import { TranscriptPanel } from "./components/transcript/transcript-panel";
import { CallStatusBar } from "./components/call/call-status-bar";
import { ListeningIndicator } from "./components/call/listening-indicator";
import { CallTimer } from "./components/call/call-timer";
import { ScenarioCard } from "./components/call/scenario-card";
import { EmergencyMap } from "./components/map/emergency-map";
import { DemoAudioControls } from "./components/call/demo-audio-controls";
import { useCallSession } from "./hooks/use-call-session";
import { emergencyServices } from "./data/nh48-services";

type ThemeMode = "light" | "dark";
type CallStage = "transcript" | "response";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const {
    analysis,
    connectionStatus,
    isComplete,
    isRunning,
    lines,
    mapContext,
    partialLine,
    start,
    pause,
    reset
  } = useCallSession();

  const stage: CallStage = mapContext.visible ? "response" : "transcript";
  const phaseLabel = analysis.locationMentioned
    ? "Location acquired"
    : analysis.emergencyDetected
      ? "Emergency confirmed"
      : isRunning
        ? "Listening"
        : isComplete
          ? "Demo complete"
          : "Ready";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300">
      <DashboardShell
        topBar={
          <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.2fr)_repeat(4,minmax(180px,0.7fr))] xl:items-stretch">
            <div className="rounded-[22px] border border-[var(--panel-border)] bg-[var(--panel-muted)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                Dispatch dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Intercept
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
                Live multilingual emergency coordination for rapid district response.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-4">
              <ScenarioCard phaseLabel={phaseLabel} />
              <CallTimer isRunning={isRunning} isComplete={isComplete} />
              <DemoAudioControls
                isRunning={isRunning}
                onStart={start}
                onPause={pause}
                onReset={reset}
              />
              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme(theme === "light" ? "dark" : "light")}
              />
            </div>
          </div>
        }
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
            phaseLabel={phaseLabel}
            rightSlot={
              <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center">
                <ListeningIndicator
                  label={isRunning ? "Showing Tamil plus live Hindi translation" : "Awaiting caller speech"}
                  pulse={isRunning}
                />
              </div>
            }
          />
        }
        transcript={
          <TranscriptPanel
            title="Live bilingual caller transcript"
            subtitle="Dispatchers see the caller's Tamil and the live Hindi translation together."
            lines={lines}
            partialLine={partialLine}
            isComplete={isComplete}
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
