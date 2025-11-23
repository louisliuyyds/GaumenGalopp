from pydantic import BaseModel
from typing import Optional
from datetime import time

# What data comes IN when creating an oeffnungszeit_detail
class OeffnungszeitDetailCreate(BaseModel):
    oeffnungszeitID: int
    wochentag: int
    oeffnungszeit: Optional[time] = None
    schliessungszeit: Optional[time] = None
    ist_geschlossen: Optional[bool] = False


# What data comes IN when updating
class OeffnungszeitDetailUpdate(BaseModel):
    oeffnungszeitID: Optional[int] = None
    wochentag: Optional[int] = None
    oeffnungszeit: Optional[time] = None
    schliessungszeit: Optional[time] = None
    ist_geschlossen: Optional[bool] = None


# What data goes OUT to the frontend
class OeffnungszeitDetailResponse(BaseModel):
    detailID: int
    oeffnungszeitID: int
    wochentag: int
    oeffnungszeit: Optional[time]
    schliessungszeit: Optional[time]
    ist_geschlossen: bool
    
    class Config:
        from_attributes = True