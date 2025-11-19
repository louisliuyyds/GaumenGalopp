from pydantic import BaseModel
from typing import Optional

# (POST)
class BestellpositionCreate(BaseModel):
    bestellungid: int
    gerichtid: int
    menge: int = 1
    aenderungswunsch: Optional[str] = None

# (PUT/PATCH)
class BestellpositionUpdate(BaseModel):
    menge: Optional[int] = None
    aenderungswunsch: Optional[str] = None

# (GET)
class BestellpositionResponse(BaseModel):
    id: int
    bestellungid: int
    gerichtid: int
    menge: int
    aenderungswunsch: Optional[str] = None

    class Config:
        from_attributes = True