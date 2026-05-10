import { useEffect, useRef, useState } from "react";

export type TranscriptLine = {
  id: string;
  time: string;
  text: string;
  tone: "system" | "translated";
};

type ConnectionStatus = "connecting" | "ready" | "disconnected";
type AnalysisState = {
  emergencyDetected: boolean;
  injuryMentioned: boolean;
  locationMentioned: boolean;
  criticalKeywords: string[];
  severity: "monitoring" | "elevated" | "critical";
  summary: string;
};
type MapContext = {
  visible: boolean;
  focus: { latitude: number; longitude: number; label: string };
  highlightedIds: string[];
  locationText?: string;
};
type AlertState = {
  level: "critical" | "info";
  title: string;
} | null;

type ServerEvent =
  | { type: "session.ready"; payload: { mode: string } }
  | { type: "session.state"; payload: { isRunning: boolean; scriptIndex: number } }
  | { type: "transcript.partial"; payload: TranscriptLine }
  | { type: "transcript.final"; payload: TranscriptLine }
  | { type: "analysis.updated"; payload: AnalysisState }
  | { type: "map.context.updated"; payload: MapContext }
  | { type: "alert.raised"; payload: { level: "critical" | "info"; title: string } }
  | { type: "session.completed"; payload: { reason: string } };

const baseLines: TranscriptLine[] = [
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
];

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/calls";

export function useCallSession() {
  const socketRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>(baseLines);
  const [partialText, setPartialText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisState>({
    emergencyDetected: false,
    injuryMentioned: false,
    locationMentioned: false,
    criticalKeywords: [],
    severity: "monitoring",
    summary: "AI context: monitoring live call for emergency details."
  });
  const [mapContext, setMapContext] = useState<MapContext>({
    visible: false,
    focus: {
      latitude: 28.4595,
      longitude: 77.0266,
      label: "Delhi NCR / NH-48"
    },
    highlightedIds: []
  });
  const [alert, setAlert] = useState<AlertState>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnectionStatus("ready");
      socket.send(JSON.stringify({ type: "session.start" }));
    });

    socket.addEventListener("close", () => {
      setConnectionStatus("disconnected");
      setIsRunning(false);
    });

    socket.addEventListener("message", (message) => {
      const event = JSON.parse(message.data) as ServerEvent;

      if (event.type === "session.ready") {
        setConnectionStatus("ready");
        return;
      }

      if (event.type === "session.state") {
        setIsRunning(event.payload.isRunning);
        if (event.payload.isRunning) {
          setIsComplete(false);
        }
        return;
      }

      if (event.type === "transcript.partial") {
        setPartialText(event.payload.text);
        return;
      }

      if (event.type === "transcript.final") {
        setLines((current) => [...current, event.payload]);
        setPartialText("");
        return;
      }

      if (event.type === "analysis.updated") {
        setAnalysis(event.payload);
        return;
      }

      if (event.type === "map.context.updated") {
        setMapContext(event.payload);
        return;
      }

      if (event.type === "alert.raised") {
        setAlert(event.payload);
        return;
      }

      if (event.type === "session.completed") {
        setIsRunning(false);
        setIsComplete(true);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  const send = (type: "demo.start" | "demo.pause" | "demo.reset") => {
    socketRef.current?.send(JSON.stringify({ type }));
  };

  const reset = () => {
    setLines(baseLines);
    setPartialText("");
    setIsComplete(false);
    setAnalysis({
      emergencyDetected: false,
      injuryMentioned: false,
      locationMentioned: false,
      criticalKeywords: [],
      severity: "monitoring",
      summary: "AI context: monitoring live call for emergency details."
    });
    setMapContext({
      visible: false,
      focus: {
        latitude: 28.4595,
        longitude: 77.0266,
        label: "Delhi NCR / NH-48"
      },
      highlightedIds: []
    });
    setAlert(null);
    send("demo.reset");
  };

  return {
    analysis,
    alert,
    connectionStatus,
    isComplete,
    isRunning,
    lines,
    mapContext,
    partialText,
    start: () => send("demo.start"),
    pause: () => send("demo.pause"),
    reset
  };
}
