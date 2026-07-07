import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-please-in-env")
    JWT_EXPIRATION_MS: int = int(os.getenv("JWT_EXPIRATION_MS", "86400000"))  # 24h default
    JWT_ALGORITHM: str = "HS256"

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_API_URL: str = os.getenv(
        "GEMINI_API_URL",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    )

    CORS_ALLOWED_ORIGINS: list[str] = [
        o.strip()
        for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")
        if o.strip()
    ]


settings = Settings()
