from pydantic import BaseModel
from typing import Optional
from datetime import date

# What data comes IN when creating a restaurant_oeffnungszeit
class RestaurantOeffnungszeitCreate(BaseModel):
    restaurantID: int
    oeffnungszeitID: int
    gueltig_von: date
    gueltig_bis: Optional[date] = None
    ist_aktiv: Optional[bool] = True


# What data comes IN when updating
class RestaurantOeffnungszeitUpdate(BaseModel):
    gueltig_bis: Optional[date] = None
    ist_aktiv: Optional[bool] = None


# What data goes OUT to the frontend
class RestaurantOeffnungszeitResponse(BaseModel):
    restaurantID: int
    oeffnungszeitID: int
    gueltig_von: date
    gueltig_bis: Optional[date]
    ist_aktiv: bool
    
    class Config:
        from_attributes = True