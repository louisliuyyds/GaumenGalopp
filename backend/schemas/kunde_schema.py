from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from typing import Optional

from pydantic import BaseModel


class AdresseProfileData(BaseModel):
    straße: Optional[str] = None
    land: Optional[str] = None
    ort: Optional[str] = None
    hausnummer: Optional[str] = None
    postleitzahl: Optional[str] = None

    class Config:
        from_attributes = True

class KundeCreate(BaseModel):
    vorname: str
    nachname: str
    adressid: int
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None

class KundeUpdate(BaseModel):
    # Kunde
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    adressid: Optional[int] = None
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None
    adresse: Optional[AdresseProfileData] = None

    # Adresse
    adresseid: Optional[int] = None  # Option A
    straße: Optional[str] = None     # Option B
    hausnummer: Optional[str] = None
    postleitzahl: Optional[str] = None
    ort: Optional[str] = None
    land: Optional[str] = None

class KundeResponse(BaseModel):
    kundenid: int
    vorname: str
    nachname: str
    adressid: int
    geburtsdatum: Optional[date] = None
    telefonnummer:str
    email: str
    namenskuerzel: str
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

# ===== AUTH SCHEMAS =====

class KundeRegister(BaseModel):
    """Schema für Registrierung mit Passwort"""
    vorname: str = Field(..., min_length=1, max_length=50)
    nachname: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100, description="Mindestens 8 Zeichen")
    adressid: int
    telefonnummer: Optional[str] = Field(None, max_length=20)
    geburtsdatum: Optional[date] = None
    namenskuerzel: Optional[str] = Field(None, max_length=100)


class KundeLogin(BaseModel):
    """Schema für Login - nur E-Mail"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT Token Response"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Daten die im JWT Token gespeichert sind"""
    kundenid: int
    email: str
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None
    adresse: Optional[AdresseProfileData] = None

    class Config:
        from_attributes = True


class KundeProfileResponse(BaseModel):
    kundenid: int
    vorname: str
    nachname: str
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None
    adresse: Optional[AdresseProfileData] = None

    class Config:
        from_attributes = True


class KundeProfileUpdate(BaseModel):
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None
    adresse: Optional[AdresseProfileData] = None
class KundeKuerzelResponse(BaseModel):
    namenskuerzel: Optional[str] = None

    class Config:
        from_attributes = True
