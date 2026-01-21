from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# What data comes IN when creating a bewertung
class BewertungCreate(BaseModel):
    kundenid: int
    gerichtid: int
    rating: int
    kommentar: str
    erstelltam: datetime

# What data comes IN when updating
class BewertungUpdate(BaseModel):
    
    kommentar: Optional[str] = None
    rating: Optional[int] = None
    erstelltam: Optional[datetime] = None

# What data goes OUT to the frontend
class BewertungResponse(BaseModel):
    bewertungid: int
    kundenid: int
    gerichtid: int
    rating: int
    kommentar: str
    erstelltam: datetime
  
    class Config:
        from_attributes = True  # Allows conversion from ORM model