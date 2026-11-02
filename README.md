# BridgeFood

**A premium Indian food discovery and simulated ordering prototype for Leicester, UK.**

BridgeFood explores a modern food-delivery experience for Indian students and professionals in the UK. This repository is a non-commercial development prototype using fictional restaurants and synthetic menu data.

## Prototype scope

- Browse fictional Leicester restaurants
- Search restaurants and filter by cuisine
- View sample menus and dietary labels
- Add/remove items in a local cart
- Submit a simulated order confirmation
- FastAPI endpoints for restaurant data and simulated orders
- PostgreSQL development service via Docker Compose

> **Prototype only:** no real restaurant onboarding, payments, fulfilment, customer accounts, or live delivery. Orders are simulated and no restaurant is notified. Do not enter personal or payment information.

## Technology

- Frontend: React, TypeScript, Vite, Lucide
- API: Python, FastAPI, Uvicorn
- Database service: PostgreSQL 16 (Docker Compose)
- Development environment: VS Code on Windows

**Current implementation note:** the API currently serves synthetic in-memory restaurant/menu data and simulated orders. PostgreSQL is included as a local development service but is not yet wired into API persistence. Database models and migrations are a follow-on milestone.

## Requirements

- Windows 10/11
- Git
- Node.js 20 or newer
- Python 3.11 or newer
- Docker Desktop with Docker Compose

## Setup on Windows

### 1. Clone and start PostgreSQL

```powershell
git clone https://github.com/Dinakarnayak/bridgefood.git
cd bridgefood
docker compose up -d db
```

PostgreSQL is available locally on port `5432`. The development-only credentials are in `docker-compose.yml`; do not reuse them outside your local machine.

### 2. Start the FastAPI backend

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000  
Swagger docs: http://127.0.0.1:8000/docs

If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal and activate again.

### 3. Start the React frontend

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## Useful API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Prototype health check |
| GET | `/api/restaurants` | Synthetic restaurant list |
| GET | `/api/restaurants/{id}` | Restaurant and menu |
| POST | `/api/orders/simulate` | Simulated order response |

## Repository structure

```text
bridgefood/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── style.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```

## Planned milestones

1. **Milestone 1 — Foundation:** local React/FastAPI project, synthetic restaurant catalogue, Docker PostgreSQL service.
2. **Milestone 2 — Ordering UX:** improve restaurant/menu pages, cart, validation and simulated checkout.
3. **Milestone 3 — Persistence:** SQLAlchemy models, PostgreSQL integration, Alembic migrations and seed scripts.
4. **Milestone 4 — Quality:** tests, accessibility, responsive polish and security review.

## Development boundaries

Keep this repository and all demonstrations non-commercial until the founder has confirmed that their UK immigration permission allows the proposed business activity. Do not accept payments, provide live delivery, trade, or onboard real customers/restaurants during this prototype stage.
