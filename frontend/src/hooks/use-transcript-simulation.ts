import { startTransition, useEffect, useMemo, useRef, useState } from "react";

export type TranscriptLine = {
  id: string;
  time: string;
  text: string;
  tone: "system" | "translated";
};

type ScriptEntry = {
  id: string;
  time: string;
  text: string;
  tone: TranscriptLine["tone"];
  leadMs: number;
};

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

const script: ScriptEntry[] = [
  {
    id: "line-3",
    time: "11:43 PM",
    text: "मैं तमिल में बोल रहा हूँ... हमारी बाइक का एक्सीडेंट हो गया है।",
    tone: "translated",
    leadMs: 900
  },
  {
    id: "line-4",
    time: "11:43 PM",
    text: "मेरे हाथ में बहुत दर्द है और दूसरा आदमी सड़क पर गिरा हुआ है।",
    tone: "translated",
    leadMs: 700
  },
  {
    id: "line-5",
    time: "11:44 PM",
    text: "कृपया लाइन पर रहें. आपकी बात लगातार समझी जा रही है।",
    tone: "system",
    leadMs: 1100
  }
];

const TYPING_INTERVAL_MS = 34;

export function useTranscriptSimulation() {
  const [lines, setLines] = useState<TranscriptLine[]>(baseLines);
  const [partialText, setPartialText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const activeEntry = useMemo(() => script[scriptIndex], [scriptIndex]);

  useEffect(() => {
    if (!isRunning || !activeEntry) {
      return;
    }

    const isEntryComplete = charIndex >= activeEntry.text.length;
    const delay = charIndex === 0 ? activeEntry.leadMs : TYPING_INTERVAL_MS;

    timeoutRef.current = window.setTimeout(() => {
      if (isEntryComplete) {
        startTransition(() => {
          setLines((current) => [...current, activeEntry]);
        });
        setPartialText("");
        setCharIndex(0);
        setScriptIndex((current) => current + 1);
        return;
      }

      const nextIndex = charIndex + 1;
      setCharIndex(nextIndex);
      setPartialText(activeEntry.text.slice(0, nextIndex));
    }, delay);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [activeEntry, charIndex, isRunning]);

  useEffect(() => {
    if (!activeEntry && isRunning) {
      setIsRunning(false);
    }
  }, [activeEntry, isRunning]);

  const start = () => {
    if (scriptIndex >= script.length) {
      reset();
      requestAnimationFrame(() => setIsRunning(true));
      return;
    }

    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setLines(baseLines);
    setPartialText("");
    setScriptIndex(0);
    setCharIndex(0);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  return {
    isRunning,
    lines,
    partialText,
    start,
    pause,
    reset
  };
}
