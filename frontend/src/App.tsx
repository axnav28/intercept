import { useEffect, useState } from "react";

import { DashboardShell } from "./components/layout/dashboard-shell";
import { ThemeToggle } from "./components/shared/theme-toggle";
import { TranscriptPanel } from "./components/transcript/transcript-panel";
import { CallStatusBar } from "./components/call/call-status-bar";
import { ListeningIndicator } from "./components/call/listening-indicator";
import { EmptyMapState } from "./components/map/empty-map-state";

type ThemeMode = "light" | "dark";
type CallStage = "transcript" | "response";

const initialTranscript = [
  {
    id: "line-1",
    time: "11:43 PM",
    text: "नमस्ते, 112 सहायता केंद्र. कृपया बताइए क्या हुआ है?",
    tone: "system"
  },
  {
    id: "line-2",
    time: "11:43 PM",
    text: "कॉलर की आवाज़ आते ही अनुवाद यहाँ लाइव दिखाई देगा।",
    tone: "translated"
  }
] as const;

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [stage] = useState<CallStage>("transcript");

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
            connectionLabel="Demo standby"
            rightSlot={<ListeningIndicator label="Awaiting caller speech" pulse={false} />}
          />
        }
        transcript={
          <TranscriptPanel
            title="Live translated transcript"
            subtitle="Tamil speech will appear here directly in Hindi for the dispatcher."
            lines={initialTranscript}
          />
        }
        map={stage === "response" ? <EmptyMapState /> : undefined}
        split={stage === "response"}
      />
    </div>
  );
}
