from pydantic import BaseModel
from typing import Optional

# (POST)
class LieferantCreate(BaseModel):
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    telephone: Optional[str] = None

#  (PUT/PATCH)
class LieferantUpdate(BaseModel):
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    telephone: Optional[str] = None

# (GET)
class LieferantResponse(BaseModel):
    lieferantid: int
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    telephone: Optional[str] = None

    class Config:
        from_attributes = True