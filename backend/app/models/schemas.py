from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---- Auth ----

class RegisterRequest(BaseModel):
    fullName: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class AuthResponse(BaseModel):
    token: str
    userId: str
    fullName: str
    email: str


# ---- Content generation ----

class GenerateRequest(BaseModel):
    toolType: str = Field(..., min_length=1)
    topic: str = Field(..., min_length=1)
    platform: Optional[str] = None
    tone: Optional[str] = None
    targetAudience: Optional[str] = None


class GenerateResponse(BaseModel):
    id: str
    toolType: str
    generatedContent: str
    createdAt: str


# ---- Posts / history ----

class PostOut(BaseModel):
    id: str
    userId: str
    toolType: str
    platform: Optional[str] = None
    tone: Optional[str] = None
    targetAudience: Optional[str] = None
    topic: str
    generatedContent: str
    favorite: bool = False
    createdAt: str
