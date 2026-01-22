from pydantic import BaseModel
from typing import Optional

class GerichtCreate(BaseModel):
    menuid: int
    name: str
    beschreibung: str
    kategorie: str

class GerichtUpdate(BaseModel):
    name: Optional[str] = None
    beschreibung: Optional[str] = None
    kategorie: Optional[str] = None

class GerichtResponse(BaseModel):
    gerichtid: int
    menuid: int
    name: str
    beschreibung: str
    kategorie: str

    class Config:
        from_attributes = True

class GerichtSearchResponse(BaseModel):
    gerichtid: int
    name: str
    beschreibung: Optional[str] = None
    kategorie: Optional[str] = None
    restaurantid: int
    restaurantname: str

    class Config:
        from_attributes = True