from pydantic import BaseModel
from typing import Optional

# What data comes IN when creating an oeffnungszeit_vorlage
class OeffnungszeitVorlageCreate(BaseModel):
    bezeichnung: str
    beschreibung: Optional[str] = None


# What data comes IN when updating
class OeffnungszeitVorlageUpdate(BaseModel):
    bezeichnung: Optional[str] = None
    beschreibung: Optional[str] = None


# What data goes OUT to the frontend
class OeffnungszeitVorlageResponse(BaseModel):
    oeffnungszeitID: int
    bezeichnung: str
    beschreibung: Optional[str]
    
    class Config:
        from_attributes = True