from pydantic import BaseModel
from typing import Optional

class LabelCreate(BaseModel):
    labelname: str
    beschreibung: str

class LabelUpdate(BaseModel):
    labelname: Optional[str] = None
    beschreibung: Optional[str] = None

class LabelResponse(BaseModel):
    labelid: int
    labelname: str
    beschreibung: str

    class Config:
        from_attributes = True
