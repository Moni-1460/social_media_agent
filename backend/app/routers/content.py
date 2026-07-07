from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.schemas import GenerateRequest, GenerateResponse
from app.services import content_service

router = APIRouter(prefix="/api/content", tags=["Content Generation"])


@router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest, user=Depends(get_current_user)):
    return await content_service.generate(user["user_id"], request)
