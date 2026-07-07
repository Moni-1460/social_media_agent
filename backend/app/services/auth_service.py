from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.models.store import user_store


def register(request: RegisterRequest) -> AuthResponse:
    if user_store.exists_by_email(request.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = {
        "fullName": request.fullName,
        "email": request.email,
        "password": hash_password(request.password),
        "roles": ["ROLE_USER"],
    }
    user = user_store.save(user)

    token = create_access_token(user["id"], user["email"])
    return AuthResponse(
        token=token,
        userId=user["id"],
        fullName=user["fullName"],
        email=user["email"],
    )


def login(request: LoginRequest) -> AuthResponse:
    user = user_store.find_by_email(request.email)
    if user is None or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user["id"], user["email"])
    return AuthResponse(
        token=token,
        userId=user["id"],
        fullName=user["fullName"],
        email=user["email"],
    )
