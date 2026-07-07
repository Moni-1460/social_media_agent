# AI Social Media Agent — Python Edition (No Java, No Maven, No Docker)

This is a Python (FastAPI) rewrite of the original Spring Boot backend. Same
features, same API routes, same in-memory storage, same 8 Gemini-powered
content tools, same React frontend (unchanged) — but the backend runs with
plain Python instead of Java/Maven, and you don't need Docker at all.

## What's included

- **Auth**: register/login with JWT, bcrypt password hashing
- **8 AI content tools**: Instagram, Facebook, LinkedIn, Twitter/X threads,
  Caption generator, Hashtag generator, Blog post, SEO keywords — all via Gemini
- **History**: view, filter, favorite, and delete past generations (in-memory)
- **Prompt engineering**: persona/role prompting + context + structured output
  instructions per tool (see `backend/app/services/prompt_templates.py`)
- **Auto-generated API docs** at `/docs` (Swagger UI) and `/redoc`
- **In-memory storage** — no database required, data resets when the process restarts

## Tech stack

| Layer      | Stack |
|------------|-------|
| Backend    | Python 3.11+, FastAPI, python-jose (JWT), passlib+bcrypt, in-memory storage |
| Frontend   | React 18, Vite, React Router, Axios, react-hot-toast (unchanged from original) |
| AI         | Google Gemini API |

## Prerequisites

- **Python 3.10+** (get it from https://www.python.org/downloads/ — check
  "Add Python to PATH" during install on Windows)
- **Node.js 20+** (https://nodejs.org/) — for the frontend only
- A free Gemini API key: https://aistudio.google.com/app/apikey

No Java, no Maven, no Docker needed.

## Setup — Windows (CMD)

### 1. Backend

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
notepad .env
```
Fill in `GEMINI_API_KEY` and `JWT_SECRET` in the `.env` file, save, close.

Then run:
```cmd
uvicorn app.main:app --reload --port 8080
```
Backend runs on `http://localhost:8080`. Interactive API docs at
`http://localhost:8080/docs`.

### 2. Frontend (in a second CMD window)

```cmd
cd frontend
copy .env.example .env
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`. Open that URL in your browser.

## Setup — Mac/Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # fill in GEMINI_API_KEY and JWT_SECRET
uvicorn app.main:app --reload --port 8080
```
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | – | Create account, returns JWT |
| POST | `/api/auth/login` | – | Login, returns JWT |
| POST | `/api/content/generate` | JWT | Generate content for a tool type |
| GET  | `/api/history` | JWT | List all generated posts |
| GET  | `/api/history/favorites` | JWT | List favorited posts |
| PATCH | `/api/history/{id}/favorite` | JWT | Toggle favorite |
| DELETE | `/api/history/{id}` | JWT | Delete a post |
| GET | `/api/health` | – | Health check |

`toolType` values: `INSTAGRAM`, `FACEBOOK`, `LINKEDIN`, `TWITTER`, `CAPTION`, `HASHTAG`, `BLOG`, `SEO`.

## Project structure

```
backend/
  app/
    main.py                     # FastAPI app, CORS, router registration
    core/
      config.py                 # env-based settings
      security.py                # JWT creation/validation, password hashing
    models/
      schemas.py                 # Pydantic request/response models
      store.py                   # in-memory "repositories" (dict-based)
    services/
      auth_service.py
      content_service.py
      gemini_service.py           # calls Google Gemini REST API
      prompt_templates.py         # prompt engineering per tool type
    routers/
      auth.py
      content.py
      history.py
  requirements.txt
  .env.example
frontend/                        # unchanged React app
```

## Adding a real database later

`app/models/store.py` contains simple dict-backed store classes
(`UserStore`, `PostStore`, `PromptHistoryStore`) with `save`/`find_*` methods.
To add persistence:
1. Add a DB driver (e.g. `sqlalchemy`, `motor` for MongoDB, or `psycopg2` for Postgres).
2. Replace the dict-based logic inside each store class with real queries,
   keeping the same method names.
3. No service or router code needs to change, since they only call these method names.

## Security notes

- Passwords hashed with bcrypt, never stored or returned in plaintext.
- JWT is stateless; no server-side sessions.
- CORS is restricted to the origins listed in `CORS_ALLOWED_ORIGINS`.
- All `/api/**` routes except `/api/auth/**` and `/api/health` require a valid
  `Authorization: Bearer <token>` header.
- Reminder: all data (accounts, generated posts) is lost on backend restart —
  this is an in-memory edition, same as the original.
