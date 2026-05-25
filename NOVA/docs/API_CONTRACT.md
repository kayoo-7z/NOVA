# NOVA API Contract

MVP HTTP contract for **Express** (frontend) and **FastAPI** (internal only).

Related: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) · [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## Response envelope (Express)

Matches `web-development/Backend/src/controllers/authcontroller.js`:

```json
{
  "status": "success | failed | error",
  "message": "Human-readable message",
  "data": {}
}
```

| HTTP | status | Use |
|------|--------|-----|
| 2xx | success | OK |
| 4xx | failed | Validation, auth, not found |
| 5xx | error | Server failure |

---

## Auth header

```http
Authorization: Bearer <accessToken>
```

JWT payload: `{ id, email }` (3h). Base: `http://localhost:3000` or `VITE_API_URL`.

---

## Implemented

### POST /api/auth/register

Body: `{ "name", "email", "password" }` (password min 6)

**201** — `data.user`: `{ id, name, email }`

### POST /api/auth/login

Body: `{ "email", "password" }`

**200** — `data.accessToken`, `data.user`

**401** — invalid credentials

---

## MVP TODO (Express)

### GET /api/health

**200** — `data`: `{ api, database, aiService }` each `ok` or `error`

### GET /api/children (JWT)

**200** — `data.children[]`

### POST /api/children (JWT)

```json
{ "name": "Adi", "dateOfBirth": "2022-05-10", "gender": "male" }
```

gender: `male` | `female`. **201** — `data.child`

### GET /api/children/:childId (JWT)

Owner only. **404** if not found.

### PATCH /api/children/:childId (JWT)

Partial: name, dateOfBirth, gender

### DELETE /api/children/:childId (JWT)

### POST /api/children/:childId/measurements (JWT)

```json
{ "heightCm": 85.5, "weightKg": 12.3, "measuredOn": "2026-05-20" }
```

**201** — `data.measurement`

### GET /api/children/:childId/measurements (JWT)

Query `?limit=20`. **200** — `data.measurements[]` newest first

### POST /api/children/:childId/assess-risk (JWT)

Uses latest growth_record (optional body `measurementId`).

**200** — `data.assessment`: id, childId, growthRecordId, riskCategory, probabilities, modelVersion, createdAt

**400** — no measurements | **502** — AI down

### GET /api/children/:childId/risk-history (JWT)

**200** — `data.assessments[]`

---

## Feature payload (Express → FastAPI)

Match `feature_columns.json` from training. Placeholder until CSV confirmed:

```json
{
  "features": {
    "ageMonths": 36,
    "gender": "male",
    "heightCm": 85.5,
    "weightKg": 12.3
  }
}
```

Compute ageMonths from `date_of_birth` in Express.

---

## FastAPI (internal)

`AI_SERVICE_URL` on Express (default `http://localhost:8000`)

### GET /health

`{ "status": "ok", "modelLoaded": true }`

### POST /predict/risk

Request: `{ "features": { ... } }`

Response: `{ "riskCategory", "probabilities", "modelVersion" }`

Optional header: `X-Internal-Key`

---

## Errors

400 validation | 401 JWT | 404 not found | 502 AI | 500 server

---

## Frontend

```js
// vite.config.js — dev proxy
server: { proxy: { '/api': 'http://localhost:3000' } }
```

---

## Demo curl

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Demo\",\"email\":\"demo@nova.test\",\"password\":\"demo1234\"}"
```
