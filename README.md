# Intercept

Intercept is a multilingual emergency dispatch dashboard. It helps a dispatcher understand a caller speaking Tamil, view a live Hindi translation, detect emergency severity, locate the incident context, and choose a response action.

The current scenario focuses on a road accident near Tikri / NH-48 where a Tamil-speaking caller reports a bike accident, injuries, location details, and a critical breathing emergency.

## What It Does

- Streams a simulated emergency call over WebSockets.
- Displays the caller's Tamil transcript and Hindi dispatcher translation together.
- Detects emergency signals such as accident, injury, location, and breathing distress.
- Escalates call severity from monitoring to elevated to critical.
- Shows a live district map with relevant emergency services.
- Highlights nearby ambulance, trauma, hospital, police, and rescue resources.
- Recommends critical dispatch actions when the emergency becomes severe.
- Shows a Hindi confirmation prompt after the dispatcher selects an action.

## Product Idea

Emergency response can break down when callers and dispatchers do not share a language. Intercept acts as a real-time dispatcher copilot:

1. Listen to the caller.
2. Translate the caller into the dispatcher's working language.
3. Extract operational signals from the conversation.
4. Surface location and responder context.
5. Help the dispatcher make a faster, safer dispatch decision.

The system is built around the idea that emergency translation alone is not enough. It should also convert chaotic call details into structured response context: what happened, where it happened, how severe it is, and who should respond.

## Scenario

The current call scenario includes:

- A Tamil-speaking caller reporting a bike accident.
- Injury and pain details.
- Location near Tikri border / NH-48.
- A critical update that the driver is not breathing.
- Dispatcher response options for ambulance and trauma center coordination.

As the call progresses, the UI changes from a simple transcript view into a split emergency response dashboard with a map and highlighted services.

## Architecture

```text
frontend/ React + TypeScript + Vite dashboard
    |
    | WebSocket events
    v
backend/ FastAPI orchestration layer
    |
    +-- call scenario replay
    +-- optional Gemini translation
    +-- semantic emergency analysis
    +-- map context builder
```

## Apps

- `frontend`: React + TypeScript + Vite dispatcher dashboard.
- `backend`: FastAPI + WebSocket orchestration layer.
- `scripts`: Convenience scripts for running the frontend and backend.

## Frontend

The frontend is the dispatcher-facing dashboard.

Key areas:

- `frontend/src/App.tsx`: Main dashboard orchestration.
- `frontend/src/hooks/use-call-session.ts`: WebSocket client and call state management.
- `frontend/src/components/transcript/transcript-panel.tsx`: Live bilingual transcript.
- `frontend/src/components/map/emergency-map.tsx`: Leaflet emergency map.
- `frontend/src/components/map/service-card-list.tsx`: Nearby service cards.
- `frontend/src/data/nh48-services.ts`: Emergency service data.

The dashboard shows:

- Call phase and emergency status.
- Playback controls.
- Call timer.
- Tamil caller text.
- Hindi dispatcher translation.
- Critical response recommendations.
- Map focus and responder highlights.

## Backend

The backend provides the live event stream used by the dashboard.

Key areas:

- `backend/app/main.py`: FastAPI app setup and health endpoint.
- `backend/app/websocket/calls.py`: `/ws/calls` WebSocket endpoint.
- `backend/app/models/events.py`: Client command and server event models.
- `backend/app/services/demo/event_replayer.py`: Scripted call scenario stream.
- `backend/app/services/ai/translator.py`: Optional Gemini translation service.
- `backend/app/services/ai/semantic_analyzer.py`: Rule-based emergency analysis.
- `backend/app/services/map/context_builder.py`: Map visibility, focus, and highlighted services.

The backend accepts these client commands:

- `session.start`
- `demo.start`
- `demo.pause`
- `demo.reset`

The backend emits these server events:

- `session.ready`
- `session.state`
- `transcript.partial`
- `transcript.final`
- `analysis.updated`
- `map.context.updated`
- `alert.raised`
- `session.completed`

## AI And Analysis

Intercept currently uses a pragmatic AI layer:

- Translation uses Gemini if `GEMINI_API_KEY` is configured.
- If Gemini is unavailable, the app falls back to scripted Hindi translations.
- Emergency analysis is rule-based and checks translated text for signals like accident, pain, bleeding, location, breathing issues, and unconsciousness.
- Severity levels are:
  - `monitoring`: no confirmed emergency signal yet.
  - `elevated`: accident, injury, or location context detected.
  - `critical`: breathing or unconsciousness emergency detected.

This keeps the system reliable during presentations and development while leaving a clear path to deeper AI extraction later.

## Map And Response Context

The map uses Leaflet with OpenStreetMap tiles.

The service dataset includes:

- AIIMS Trauma Centre.
- Safdarjung Hospital Emergency.
- Gurugram ALS Ambulance Unit.
- Tikri Border Police Post.
- NH-48 Rescue Crane Unit.
- Bahadurgarh Trauma Support.

When the system detects a location or critical condition, it updates the map focus and highlights the most relevant services.

## Current Limitations

This is not yet a production emergency system.

Currently simulated:

- Live audio input.
- Speech-to-text.
- Real dispatch integration.
- Real geocoding.
- Real ambulance availability.
- Real ETA calculation.
- Government 112 or hospital system integration.

Currently implemented:

- Full dashboard UI.
- FastAPI backend.
- WebSocket streaming.
- Call scenario replay.
- Optional Gemini translation.
- Rule-based semantic analysis.
- Dynamic map and service highlighting.
- Dispatcher action confirmation flow.

## Future Scope

Potential next steps:

- Add real microphone or call audio ingestion.
- Add speech-to-text for Indian languages.
- Support more caller and dispatcher language pairs.
- Replace rule-based analysis with structured AI extraction.
- Add geocoding from caller location descriptions.
- Integrate live responder availability and routing.
- Generate automatic incident summaries.
- Connect dispatch actions to real emergency workflows.

## Getting Started

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend runs at:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend connects to:

```text
ws://127.0.0.1:8000/ws/calls
```

To override this, set:

```bash
VITE_WS_URL=ws://your-backend-host/ws/calls
```

## Optional Gemini Setup

Gemini translation is optional. Without it, the app uses built-in fallback translations.

```bash
export GEMINI_API_KEY=your_api_key
export GEMINI_MODEL=gemini-2.0-flash
```

Then restart the backend.

## Scripts

Convenience scripts are available:

```bash
./scripts/run-backend.sh
./scripts/run-frontend.sh
```

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet
- FastAPI
- Pydantic
- WebSockets
- Gemini API optional

## Summary

Intercept is an AI-assisted emergency dispatch concept. Its core value is turning a multilingual distress call into actionable dispatch context: translated speech, severity, location, responder options, and a recommended next step.
