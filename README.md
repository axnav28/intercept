# Intercept

Intercept is a hackathon prototype for a multilingual emergency dispatch dashboard.

## Apps

- `frontend`: React + TypeScript + Vite dispatcher dashboard
- `backend`: FastAPI + WebSockets orchestration layer

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
