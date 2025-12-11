# AP FraudShield (Next.js + FastAPI)

AI-powered document validation & fraud detection demo for the Finance Department, Government of Andhra Pradesh.

## Features
- **Dashboard**: Live stats, uploads vs fraud chart, live feed, critical alerts, filters, export (CSV/JSON/PDF).
- **Smart Upload**: Drag & drop with validation, green upload progress, scanning modal, auto-redirect to results.
- **Analysis Results**: PDF preview placeholder, fraud score gauge, anomalies, duplicate warning, approve/reject, export report.
- **Notifications**: Toast system + demo alert trigger.
- **Help & Settings**: Support info and settings UI.

## Tech Stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, Lucide icons.
- Backend: FastAPI, pypdf (PDF text extraction), CORS middleware.
- State/UX: Toasts, Suspense for search params, skeleton loaders, error boundary.

## API (FastAPI)
Base URL: `/api/v1`
- `GET /dashboard/stats` — demo stats
- `POST /scan/upload` — upload file → `{ task_id }`
- `GET /scan/result/{task_id}` — returns scan result
- `POST /admin/trigger-alert` — `{ status: "sent" }`

### ScanResult fields
`file_id, filename, status ('pending'|'scanning'|'completed'|'error'), fraud_score, severity ('SAFE'|'WARNING'|'CRITICAL'), is_duplicate, duplicate_source_id, anomalies[], scanned_at, processing_time`

## Environment Variables
Frontend:
```
NEXT_PUBLIC_API_BASE=https://finance-wealthprotection-production.up.railway.app/api/v1
```
Backend (optional):
```
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

## Local Development
Frontend:
```
cd frontend
npm install
echo "NEXT_PUBLIC_API_BASE=http://localhost:8000/api/v1" > .env.local
npm run dev
```
Backend:
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Deployment (Recommended)
- **Frontend**: Vercel  
  - Set root to `frontend`  
  - Env: `NEXT_PUBLIC_API_BASE=https://<your-backend>/api/v1`
- **Backend**: Railway  
  - Root: `backend`  
  - Procfile: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`  
  - Env: `CORS_ORIGINS=https://<your-frontend>`

More detail: see `DEPLOYMENT.md` and `DEPLOYMENT_QUICKSTART.md`.

## Scripts
Frontend:
- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — run built app
- `npm run lint` — lint

Backend:
- `uvicorn main:app --reload --port 8000`

## Notes
- Uploads are analyzed; PDF text is parsed with pypdf and heuristics (future dates, suspicious keywords, blacklisted entities).
- Frontend is fully dynamic for analysis results to support `useSearchParams`.

