from pydantic import BaseModel
from typing import Optional

class KochstilCreate(BaseModel):
    kochstil: str
    beschreibung: Optional[str] = None

class KochstilUpdate(BaseModel):
    kochstil: Optional[str] = None
    beschreibung: Optional[str] = None

class KochstilResponse(BaseModel):
    stilid: int
    kochstil: str
    beschreibung: Optional[str] = None

    class Config:
        from_attributes = True