from pydantic import BaseModel
from typing import Optional
from datetime import date

# What data comes IN when creating a restaurant_oeffnungszeit
class RestaurantOeffnungszeitCreate(BaseModel):
    restaurantid: int
    oeffnungszeitid: int
    gueltig_von: date
    gueltig_bis: Optional[date] = None


# What data comes IN when updating
class RestaurantOeffnungszeitUpdate(BaseModel):
    gueltig_bis: Optional[date] = None


# What data goes OUT to the frontend
class RestaurantOeffnungszeitResponse(BaseModel):
    restaurantid: int
    oeffnungszeitid: int
    gueltig_von: date
    gueltig_bis: Optional[date]
    
    class Config:
        from_attributes = True