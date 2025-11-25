from pydantic import BaseModel, EmailStr
from typing import Optional

# What data comes IN when creating a bewertungkritiker
class BewertungkritikerCreate(BaseModel):
    rating: int

# What data comes IN when updating
class BewertungkritikerUpdate(BaseModel):
    rating: Optional[int] = None

class BewertungkritikerResponse(BaseModel):
    # --- NEU HINZUGEFÜGT ---
    bewertungkritikerid: int
    kritikerid: int
    gerichtid: int


    rating: int

    class Config:
        from_attributes = True  # Allows conversion from ORM model