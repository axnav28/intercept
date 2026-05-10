import asyncio
from dataclasses import dataclass

from app.models.events import ServerEvent
from app.services.ai.semantic_analyzer import SemanticAnalyzer
from app.services.ai.translator import TranslationService
from app.services.map.context_builder import MapContextBuilder


@dataclass(frozen=True)
class ScriptEntry:
    id: str
    time: str
    source_text: str
    fallback_translation: str
    tone: str
    lead_ms: int


SCRIPT = [
    ScriptEntry(
        id="line-3",
        time="11:43 PM",
        source_text="நான் தமிழில் பேசுகிறேன்... எங்களுடைய பைக் விபத்தில் சிக்கியது.",
        fallback_translation="मैं तमिल में बोल रहा हूँ... हमारी बाइक का एक्सीडेंट हो गया है।",
        tone="translated",
        lead_ms=900,
    ),
    ScriptEntry(
        id="line-4",
        time="11:43 PM",
        source_text="என் கையில் மிகவும் வலி இருக்கிறது, இன்னொருவர் சாலையில் விழுந்திருக்கிறார்.",
        fallback_translation="मेरे हाथ में बहुत दर्द है और दूसरा आदमी सड़क पर गिरा हुआ है।",
        tone="translated",
        lead_ms=700,
    ),
    ScriptEntry(
        id="line-5",
        time="11:44 PM",
        source_text="நாங்கள் டிக்ரி எல்லைக்கு அருகே, என்.எச்.-48 பக்கத்தில் இருக்கிறோம்.",
        fallback_translation="हम टिकरी सीमा के पास, एनएच-48 के किनारे खड़े हैं।",
        tone="translated",
        lead_ms=1100,
    ),
    ScriptEntry(
        id="line-6",
        time="11:44 PM",
        source_text="டிரைவர் சுவாசிக்கவில்லை... தயவுசெய்து சீக்கிரம் உதவுங்கள்.",
        fallback_translation="ड्राइवर सांस नहीं ले रहा है... कृपया जल्दी मदद भेजिए।",
        tone="translated",
        lead_ms=900,
    ),
    ScriptEntry(
        id="line-7",
        time="11:44 PM",
        source_text="தயவுசெய்து லைனில் இருங்கள். உங்கள் பேச்சை தொடர்ந்து புரிந்து கொள்ளப்படுகிறது.",
        fallback_translation="कृपया लाइन पर रहें. आपकी बात लगातार समझी जा रही है।",
        tone="system",
        lead_ms=1200,
    ),
]

TYPING_INTERVAL_SECONDS = 0.034


class DemoReplaySession:
    def __init__(self) -> None:
        self.script_index = 0
        self.char_index = 0
        self.is_running = False
        self.translator = TranslationService()
        self.semantic_analyzer = SemanticAnalyzer()
        self.map_context_builder = MapContextBuilder()
        self.analysis_state = {
            "emergencyDetected": False,
            "injuryMentioned": False,
            "locationMentioned": False,
            "criticalKeywords": [],
            "severity": "monitoring",
            "summary": "AI context: monitoring live call for emergency details.",
        }

    def reset(self) -> None:
        self.script_index = 0
        self.char_index = 0
        self.is_running = False
        self.analysis_state = {
            "emergencyDetected": False,
            "injuryMentioned": False,
            "locationMentioned": False,
            "criticalKeywords": [],
            "severity": "monitoring",
            "summary": "AI context: monitoring live call for emergency details.",
        }

    def pause(self) -> None:
        self.is_running = False

    async def stream(self, websocket_send) -> None:
        if self.script_index >= len(SCRIPT):
            self.is_running = False
            await websocket_send(
                ServerEvent(type="session.completed", payload={"reason": "demo_complete"}).model_dump()
            )
            return

        self.is_running = True

        while self.is_running and self.script_index < len(SCRIPT):
            entry = SCRIPT[self.script_index]

            if self.char_index == 0:
                await asyncio.sleep(entry.lead_ms / 1000)
                if not self.is_running:
                    break

            while self.is_running and self.char_index < len(entry.fallback_translation):
                self.char_index += 1
                await websocket_send(
                    ServerEvent(
                        type="transcript.partial",
                        payload={
                            "id": entry.id,
                            "time": entry.time,
                            "tone": entry.tone,
                            "text": entry.fallback_translation[: self.char_index],
                        },
                    ).model_dump()
                )
                await asyncio.sleep(TYPING_INTERVAL_SECONDS)

            if not self.is_running:
                break

            translated_text = await self.translator.translate(entry.source_text, entry.fallback_translation)
            incoming_analysis = await self.semantic_analyzer.analyze(translated_text)
            analysis = self._merge_analysis(incoming_analysis)
            map_context = await self.map_context_builder.build(
                analysis, translated_text, incoming_analysis["locationMentioned"]
            )

            await websocket_send(
                ServerEvent(
                    type="transcript.final",
                    payload={
                        "id": entry.id,
                        "time": entry.time,
                        "tone": entry.tone,
                        "text": translated_text,
                    },
                ).model_dump()
            )
            await websocket_send(ServerEvent(type="analysis.updated", payload=analysis).model_dump())
            await websocket_send(
                ServerEvent(type="map.context.updated", payload=map_context).model_dump()
            )
            if analysis["severity"] == "critical":
                await websocket_send(
                    ServerEvent(
                        type="alert.raised",
                        payload={
                            "level": "critical",
                            "title": "Critical - breathing emergency detected.",
                        },
                    ).model_dump()
                )
            self.char_index = 0
            self.script_index += 1

        if self.script_index >= len(SCRIPT):
            self.is_running = False
            await websocket_send(
                ServerEvent(type="session.completed", payload={"reason": "demo_complete"}).model_dump()
            )

    def _merge_analysis(self, incoming: dict) -> dict:
        keyword_set = set(self.analysis_state["criticalKeywords"]) | set(incoming["criticalKeywords"])
        severity_order = {"monitoring": 0, "elevated": 1, "critical": 2}
        merged_severity = incoming["severity"]

        if severity_order[self.analysis_state["severity"]] > severity_order[incoming["severity"]]:
            merged_severity = self.analysis_state["severity"]

        merged_summary = incoming["summary"]
        if (
            incoming["summary"] == "AI context: monitoring live call for emergency details."
            and self.analysis_state["severity"] != "monitoring"
        ):
            merged_summary = self.analysis_state["summary"]

        self.analysis_state = {
            "emergencyDetected": self.analysis_state["emergencyDetected"] or incoming["emergencyDetected"],
            "injuryMentioned": self.analysis_state["injuryMentioned"] or incoming["injuryMentioned"],
            "locationMentioned": self.analysis_state["locationMentioned"] or incoming["locationMentioned"],
            "criticalKeywords": sorted(keyword_set),
            "severity": merged_severity,
            "summary": merged_summary,
        }
        return self.analysis_state
