from fastapi import APIRouter, Depends, Response

from app.core.security import get_current_user
from app.models.schemas import PostOut
from app.services import content_service

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("", response_model=list[PostOut])
def get_history(user=Depends(get_current_user)):
    return content_service.get_history(user["user_id"])


@router.get("/favorites", response_model=list[PostOut])
def get_favorites(user=Depends(get_current_user)):
    return content_service.get_favorites(user["user_id"])


@router.patch("/{post_id}/favorite", response_model=PostOut)
def toggle_favorite(post_id: str, user=Depends(get_current_user)):
    return content_service.toggle_favorite(user["user_id"], post_id)


@router.delete("/{post_id}", status_code=204)
def delete_post(post_id: str, user=Depends(get_current_user)):
    content_service.delete_post(user["user_id"], post_id)
    return Response(status_code=204)
