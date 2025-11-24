from pydantic import BaseModel
from typing import Optional
from schemas.gericht_schema import GerichtResponse
from schemas.label_schema import LabelResponse

class LabelGerichtCreate(BaseModel):
    labelid: int
    gerichtid: int

class LabelGerichtResponse(BaseModel):
    labelid: int
    gerichtid: int
    label: Optional[LabelResponse] = None
    gericht: Optional[GerichtResponse] = None

    class Config:
        from_attributes = True
