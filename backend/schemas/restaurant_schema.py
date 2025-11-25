from pydantic import BaseModel
from typing import Optional

# What data comes IN when creating a restaurant
class RestaurantCreate(BaseModel):
    name: str
    klassifizierung: Optional[str] = None
    adresseid: int
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None


# What data comes IN when updating
class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    klassifizierung: Optional[str] = None
    adresseid: Optional[int] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None


# What data goes OUT to the frontend
class RestaurantResponse(BaseModel):
    restaurantid: int
    name: str
    klassifizierung: Optional[str]
    adresseid: int
    telefon: Optional[str]
    kuechenchef: Optional[str]
    
    class Config:
        from_attributes = True