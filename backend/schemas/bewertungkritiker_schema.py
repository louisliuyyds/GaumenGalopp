from pydantic import BaseModel, EmailStr
from typing import Optional

# What data comes IN when creating a bewertungkritiker
class BewertungkritikerCreate(BaseModel):
    rating: int

# What data comes IN when updating
class BewertungkritikerUpdate(BaseModel):
    rating: Optional[int] = None

# What data goes OUT to the frontend
class BewertungkritikerResponse(BaseModel):
    rating: int
    
    class Config:
        from_attributes = True  # Allows conversion from ORM model