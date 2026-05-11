import { useState } from "react";

import { DashboardShell } from "./components/layout/dashboard-shell";
import { TranscriptPanel } from "./components/transcript/transcript-panel";
import { CallTimer } from "./components/call/call-timer";
import { ScenarioCard } from "./components/call/scenario-card";
import { EmergencyMap } from "./components/map/emergency-map";
import { DemoAudioControls } from "./components/call/demo-audio-controls";
import { useCallSession } from "./hooks/use-call-session";
import { emergencyServices } from "./data/nh48-services";
type CallStage = "transcript" | "response";
type DispatchActionId = "als" | "trauma" | "line";

const dispatchActions: Array<{ id: DispatchActionId; label: string; confirmation: string }> = [
  { id: "als", label: "Send ALS ambulance", confirmation: "Emergency help sent. ALS ambulance is being dispatched." },
  { id: "trauma", label: "Notify trauma center", confirmation: "Emergency help sent. Trauma center has been notified." },
  { id: "line", label: "Keep caller on line", confirmation: "Emergency help sent. Dispatcher will keep the caller on the line." }
];

export default function App() {
  const [selectedAction, setSelectedAction] = useState<DispatchActionId | null>(null);
  const {
    analysis,
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
  const severity = analysis.severity;
  const isCritical = severity === "critical";
  const phaseLabel = analysis.locationMentioned
    ? "Location acquired"
    : analysis.emergencyDetected
      ? "Emergency confirmed"
      : isRunning
        ? "Listening"
        : isComplete
          ? "Demo complete"
          : "Ready";

  const handleReset = () => {
    setSelectedAction(null);
    reset();
  };

  const emergencyMessage = selectedAction
    ? dispatchActions.find((action) => action.id === selectedAction)?.confirmation ?? null
    : null;

  return (
    <div
      data-severity={severity}
      className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] transition-colors duration-300"
    >
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
              <CallTimer isRunning={isRunning} isComplete={isComplete} isFrozen={selectedAction !== null} />
              <DemoAudioControls
                isRunning={isRunning}
                onStart={start}
                onPause={pause}
                onReset={handleReset}
              />
              <div
                className={`flex h-full min-h-[132px] flex-col justify-center rounded-[22px] border px-4 py-4 ${
                  isCritical
                    ? "critical-pulse border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100"
                    : severity === "elevated"
                      ? "border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
                      : "border-[var(--panel-border)] bg-[var(--panel-muted)]"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-current/70">
                  Emergency status
                </p>
                <p className="mt-3 text-base font-semibold">
                  {isCritical
                    ? "Breathing emergency detected"
                    : severity === "elevated"
                      ? "Injury and impact details incoming"
                      : "Monitoring incoming call"}
                </p>
                <p className="mt-2 text-sm text-current/75">
                  {isCritical
                    ? "Dispatch trauma + ambulance now"
                    : severity === "elevated"
                      ? "Prepare trauma and roadside response"
                      : "Await location confirmation"}
                </p>
              </div>
            </div>
          </div>
        }
        transcript={
          <TranscriptPanel
            title="Live bilingual caller transcript"
            subtitle="Dispatchers see the caller's Tamil and the live Hindi translation together."
            lines={lines}
            partialLine={partialLine}
            isComplete={isComplete}
            severity={severity}
            actionSlot={
              isCritical ? (
                <div className="rounded-3xl border border-rose-200/80 bg-rose-50 px-4 py-4 shadow-[0_18px_48px_rgba(220,38,38,0.08)] dark:border-rose-900/60 dark:bg-rose-950/40">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-300">
                        Recommended action
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-rose-950 dark:text-rose-100">
                        Critical response
                      </h3>
                    </div>
                    <span className="critical-pulse inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
                      Critical
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {dispatchActions.map((action, index) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => setSelectedAction(action.id)}
                        disabled={selectedAction !== null}
                        className="w-full rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 text-left text-sm font-semibold text-rose-900 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-800 dark:bg-slate-950/40 dark:text-rose-100 dark:hover:bg-rose-950/60"
                      >
                        {index + 1}. {action.label}
                      </button>
                    ))}
                  </div>
                  {emergencyMessage ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                      {emergencyMessage}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-rose-800/80 dark:text-rose-200/80">
                      Select an action to confirm dispatch and freeze the call timer.
                    </p>
                  )}
                </div>
              ) : null
            }
          />
        }
        map={
          stage === "response" ? (
            <EmergencyMap
              services={emergencyServices}
              highlightedIds={mapContext.highlightedIds}
              focus={mapContext.focus}
              severity={severity}
            />
          ) : undefined
        }
        split={stage === "response"}
      />
    </div>
  );
}
