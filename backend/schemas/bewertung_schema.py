# schemas/bewertung_schema.py
from psycopg2 import Date
from pydantic import BaseModel, EmailStr
from typing import Optional

from GaumenGalopp.backend.models import kunde

# What data comes IN when creating a bewertung
class BewertungCreate(BaseModel):
    rating: int
    kommentar: str
    erstelltam: Date

# What data comes IN when updating
class BewertungUpdate(BaseModel):
    
    kommentar: Optional[str] = None
    rating: Optional[int] = None
    erstelltam: Optional[Date] = None

# What data goes OUT to the frontend
class BewertungResponse(BaseModel):
    id: int
    kundeid: int
    gerichtid: int
    rating: int
    kommentar: str
    erstelltam: Date
  
    class Config:
        from_attributes = True  # Allows conversion from ORM model