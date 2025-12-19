from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

LoginType = Literal["kunde", "restaurant"]

class LoginRequest(BaseModel):
    type: LoginType
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    user_type: str  # "kunde" or "restaurant"

class MeResponse(BaseModel):
    user_id: int
    user_type: str
    role: str
    email: str
