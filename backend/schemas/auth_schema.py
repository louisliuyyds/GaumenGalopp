from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import date


# Type Definitions
LoginType = Literal["kunde", "restaurant"]


# ===== REQUEST SCHEMAS =====

class RegisterRequest(BaseModel):
    """Schema für Kunden-Registrierung"""
    vorname: str = Field(..., min_length=1, max_length=50)
    nachname: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Mindestens 8 Zeichen")
    telefonnummer: Optional[str] = Field(None, max_length=20)
    geburtsdatum: Optional[date] = None
    namenskuerzel: Optional[str] = Field(None, max_length=100)
    # Adresse direkt eingeben
    strasse: str = Field(..., min_length=1, max_length=255)
    hausnummer: str = Field(..., min_length=1, max_length=10)
    plz: str = Field(..., min_length=1, max_length=10)
    stadt: str = Field(..., min_length=1, max_length=100)
    land: str = Field(default="Deutschland", max_length=100)


class RestaurantRegisterRequest(BaseModel):
    """Schema für Restaurant-Registrierung"""
    name: str = Field(..., min_length=1, max_length=255, description="Restaurant-Name")
    email: EmailStr
    password: str = Field(..., min_length=8, description="Mindestens 8 Zeichen")
    telefon: Optional[str] = Field(None, max_length=20)
    klassifizierung: Optional[str] = Field(None, max_length=100, description="z.B. 'Italienisch', 'Sterne-Restaurant'")
    kuechenchef: Optional[str] = Field(None, max_length=255)
    # Adresse direkt
    strasse: str = Field(..., min_length=1, max_length=255)
    hausnummer: str = Field(..., min_length=1, max_length=10)
    plz: str = Field(..., min_length=1, max_length=10)
    stadt: str = Field(..., min_length=1, max_length=100)
    land: str = Field(default="Deutschland", max_length=100)


class LoginRequest(BaseModel):
    """Schema für Login-Request - unterstützt mehrere User-Typen"""
    type: LoginType  # "kunde" oder "restaurant"
    email: EmailStr
    password: str


# ===== RESPONSE SCHEMAS =====

class TokenResponse(BaseModel):
    """Schema für Token-Response nach Login"""
    access_token: str
    token_type: str = "bearer"
    role: str          # z.B. "kunde", "admin", "restaurant_owner"
    user_id: int       # Generische ID (kundenid oder restaurantid)
    user_type: str     # "kunde" oder "restaurant"


class MeResponse(BaseModel):
    """Schema für /me Endpoint Response - minimal & generisch"""
    user_id: int
    user_type: str
    role: str
    email: str