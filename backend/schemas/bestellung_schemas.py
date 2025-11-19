from pydantic import BaseModel
from typing import Optional
from datetime import datetime

#(POST)
class BestellungCreate(BaseModel):
    kundenid: int
    restaurantid: int
    adressid: int
    lieferantid: Optional[int] = None
    status: Optional[str] = "Eingegangen"

#(PUT/PATCH)

class BestellungUpdate(BaseModel):
    status: Optional[str] = None
    lieferantid: Optional[int] = None

#(GET)
class BestellungResponse(BaseModel):
    id: int
    kundenid: int
    restaurantid: int
    adressid: int
    lieferantid: Optional[int] = None
    bestellzeit: datetime
    status: str

    class Config:
        from_attributes = True