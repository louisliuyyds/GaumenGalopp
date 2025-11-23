from pydantic import BaseModel
from typing import Optional

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