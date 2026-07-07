from fastapi import HTTPException

from app.models.schemas import GenerateRequest, GenerateResponse
from app.models.store import now_iso, post_store, prompt_history_store
from app.services import gemini_service
from app.services.prompt_templates import build_prompt


async def generate(user_id: str, request: GenerateRequest) -> GenerateResponse:
    prompt = build_prompt(request)
    generated_content = await gemini_service.generate_content(prompt)

    created_at = now_iso()

    post = {
        "userId": user_id,
        "toolType": request.toolType.upper(),
        "platform": request.platform,
        "tone": request.tone,
        "targetAudience": request.targetAudience,
        "topic": request.topic,
        "generatedContent": generated_content,
        "favorite": False,
        "createdAt": created_at,
    }
    post = post_store.save(post)

    history_entry = {
        "userId": user_id,
        "toolType": request.toolType.upper(),
        "prompt": prompt,
        "response": generated_content,
        "createdAt": created_at,
    }
    prompt_history_store.save(history_entry)

    return GenerateResponse(
        id=post["id"],
        toolType=post["toolType"],
        generatedContent=post["generatedContent"],
        createdAt=post["createdAt"],
    )


def get_history(user_id: str) -> list[dict]:
    return post_store.find_by_user_id_ordered(user_id)


def get_favorites(user_id: str) -> list[dict]:
    return post_store.find_favorites_by_user_id(user_id)


def toggle_favorite(user_id: str, post_id: str) -> dict:
    post = post_store.find_by_id(post_id)
    if post is None or post["userId"] != user_id:
        raise HTTPException(status_code=404, detail="Post not found")
    post["favorite"] = not post["favorite"]
    return post_store.save(post)


def delete_post(user_id: str, post_id: str) -> None:
    post = post_store.find_by_id(post_id)
    if post is None or post["userId"] != user_id:
        raise HTTPException(status_code=404, detail="Post not found")
    post_store.delete_by_id(post["id"])
