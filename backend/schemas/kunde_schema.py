from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class KundeCreate(BaseModel):
    vorname: str
    nachname: str
    adressid: int
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[EmailStr] = None
    namenskuerzel: Optional[str] = None

class KundeUpdate(BaseModel):
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    adressid: Optional[int] = None
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[EmailStr] = None
    namenskuerzel: Optional[str] = None

class KundeResponse(BaseModel):
    kundenid: int
    vorname: str
    nachname: str
    adressid: int
    geburtsdatum: Optional[date] = None
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None

    class Config:
        from_attributes = True

class KundeKuerzelResponse(BaseModel):
    namenskuerzel: Optional[str] = None

    class Config:
        from_attributes = True