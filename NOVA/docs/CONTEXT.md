# NOVA Project Context

> Single source for scope, constraints, and priorities. See also [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md), [API_CONTRACT.md](./API_CONTRACT.md), [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

## Overview

**NOVA** is an AI-powered child growth monitoring **web app** for early stunting risk detection and nutritional tracking, aimed at parents in Indonesia.

## Goal (remaining capstone time: less than 2 weeks)

Ship a **stable demo MVP**: register/login → manage children → enter height/weight → run risk assessment → view history on a simple dashboard.

## MVP scope (in)

| Feature | Notes |
|---------|--------|
| User auth | Register, login, JWT (backend exists) |
| Child profiles | Name, DOB, gender |
| Measurements | Manual height (cm), weight (kg), date |
| Risk prediction | Express calls FastAPI → TensorFlow `.h5` |
| Dashboard | List children, latest risk, measurement history |

## Out of scope (MVP)

- Computer vision / MediaPipe height measurement
- Mobile native app
- Immunization reminders, education CMS
- Advanced analytics or recommendation engine
- Monorepo restructure (`apps/`, workspaces) — keep current folders

## Tech stack

| Layer | Path | Stack |
|-------|------|--------|
| Frontend | `NOVA/web-development/Frontend` | React 19, Vite |
| Backend | `NOVA/web-development/Backend` | Express 5, `pg`, JWT |
| Database | Hosted or local | PostgreSQL |
| ML training | `NOVA/mecine-learning-ai/notebooks` | TensorFlow, scikit-learn |
| AI service (to add) | `NOVA/mecine-learning-ai/ai-service` | FastAPI, uvicorn |

**Deployment target:** Vercel (frontend), Render/Railway (API + AI), Neon/Supabase (Postgres).

## Architecture rule

```
Frontend → Express API → PostgreSQL
              ↓
         FastAPI (inference only)
```

The browser **must not** call FastAPI directly.

## Development priorities (less than 2 weeks)

1. **Database** — migrations for `children`, `growth_records`, `risk_assessments`
2. **Backend** — JWT middleware, child/measurement/assess routes, `GET /api/health`
3. **AI service** — FastAPI `POST /predict/risk` + model artifacts (`scaler.pkl`, etc.)
4. **Frontend** — auth UI, Vite `/api` proxy, child form, assess + history
5. **Demo** — env examples, one happy-path seed user, deploy API + web

## Branding / UI

| Token | Hex |
|-------|-----|
| Burgundy | `#6C0820` |
| Cherry Blossom Pink | `#F2AEBC` |
| Misty Rose | `#F2DCDB` |
| Soft Cream | `#FFFBEB` |
| Silver Lake Blue | `#5A86CB` |
| Lapis Lazuli | `#3D5D91` |

UI: calm, professional, parent-friendly, trustworthy.

## ML note

Product README mentions CV anthropometry; **MVP uses manual measurements** + tabular model trained on `data_bersih.csv` (`Risk_Category` target). CV notebooks stay R&D only.

## Team conventions

- Work under `NOVA/` only (ignore duplicate root `web-development/` if present).
- Match existing API response shape: `{ status, message, data }`.
- Fix `authController` import vs `authcontroller.js` filename before Linux deploy.
