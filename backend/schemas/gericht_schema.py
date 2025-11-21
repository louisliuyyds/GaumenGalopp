from pydantic import BaseModel
from typing import Optional

class GerichtCreate(BaseModel):
    menueid: int
    name: str
    beschreibung: str
    kategorie: str

class GerichtUpdate(BaseModel):
    name: Optional[str] = None
    beschreibung: Optional[str] = None
    kategorie: Optional[str] = None

class GerichtResponse(BaseModel):
    gerichtid: int
    menueid: int
    name: str
    beschreibung: str
    kategorie: str

    class Config:
        from_attributes = True
