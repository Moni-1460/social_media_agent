import httpx
from fastapi import HTTPException
from app.core.config import settings


async def generate_content(prompt: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured. Set it as an environment variable.",
        )
    url = settings.GEMINI_API_URL
    headers = {
        "x-goog-api-key": settings.GEMINI_API_KEY,
        "Content-Type": "application/json",
    }
    body = {"contents": [{"parts": [{"text": prompt}]}]}
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(url, json=body, headers=headers)
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPStatusError as ex:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini API returned an error: {ex.response.text}",
        )
    except httpx.RequestError as ex:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to reach Gemini API: {ex}",
        )
    return _extract_text(data)


def _extract_text(data: dict) -> str:
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        return str(data)