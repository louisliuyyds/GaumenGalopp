# schemas/bewertungkritiker_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional

from GaumenGalopp.backend.models import bewertung

# What data comes IN when creating a bewertungkritiker
class BewertungkritikerCreate(BaseModel):
    bewertungkritikerid: int
    kritikerid: int
    gerichtid: int
    rating: int

# What data comes IN when updating
class BewertungkritikerUpdate(BaseModel):
    bewertungkritikerid: Optional[int] = None
    kritikerid: Optional[int] = None
    gerichtid: Optional[int] = None
    rating: Optional[int] = None

# What data goes OUT to the frontend
class BewertungkritikerResponse(BaseModel):
    bewertungkritikerid: int
    kritikerid: int
    gerichtid: int
    rating: int
    
    class Config:
        from_attributes = True  # Allows conversion from ORM model