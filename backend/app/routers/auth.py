from fastapi import APIRouter, status

from app.models.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest):
    return auth_service.register(request)


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    return auth_service.login(request)
