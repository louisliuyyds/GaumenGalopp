# schemas/Kritiker_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional

from GaumenGalopp.backend.models import kritiker

# What data comes IN when creating a Kritiker
class KritikerCreate(BaseModel):
    beschreibung: str
    kritikername: str

# What data comes IN when updating
class KritikerUpdate(BaseModel):
    kritikername: Optional[str] = None
    beschreibung: Optional[str] = None

# What data goes OUT to the frontend
class KritikerResponse(BaseModel):
    beschreibung: str
    kritikername: str

    class Config:
        from_attributes = True  # Allows conversion from ORM model