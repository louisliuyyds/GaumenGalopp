from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class PreisCreate(BaseModel):
    gerichtid: int
    betrag: float
    gueltigvon: datetime
    gueltigbis: Optional[datetime] = None
    preistyp: str
    istaktiv: bool = True

class PreisUpdate(BaseModel):
    betrag: Optional[float] = None
    gueltigbis: Optional[datetime] = None
    preistyp: Optional[str] = None
    istaktiv: Optional[bool] = None

class PreisResponse(BaseModel):
    preisid: int
    gerichtid: int
    betrag: float
    gueltigvon: datetime
    gueltigbis: Optional[datetime]
    preistyp: str
    istaktiv: bool

    class Config:
        from_attributes = True
