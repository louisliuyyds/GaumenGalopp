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
    # Kunde
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    email: Optional[EmailStr] = None
    telefonnummer: Optional[str] = None
    geburtsdatum: Optional[date] = None
    namenskuerzel: Optional[str] = None

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
    telefonnummer: Optional[str] = None
    email: Optional[str] = None
    namenskuerzel: Optional[str] = None

    class Config:
        from_attributes = True

class KundeKuerzelResponse(BaseModel):
    namenskuerzel: Optional[str] = None

    class Config:
        from_attributes = True