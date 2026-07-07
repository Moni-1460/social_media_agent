from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, content, history

app = FastAPI(
    title="AI Social Media Agent API (Python Edition)",
    description="Generates platform-specific social media content using Google Gemini "
    "and engineered prompt templates. In-memory storage, no database required.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(content.router)
app.include_router(history.router)


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "ok"}
