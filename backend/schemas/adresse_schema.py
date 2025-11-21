from pydantic import BaseModel
from typing import Optional

class AdresseCreate(BaseModel):
    straße: str
    land: str
    ort: str
    hausnummer: str
    postleitzahl: str

class AdresseUpdate(BaseModel):
    straße: Optional[str] = None
    land: Optional[str] = None
    ort: Optional[str] = None
    hausnummer: Optional[str] = None
    postleitzahl: Optional[str] = None

class AdresseResponse(BaseModel):
    adresseid: int
    straße: str
    land: str
    ort: str
    hausnummer: str
    postleitzahl: str

    class Config:
        from_attributes = True