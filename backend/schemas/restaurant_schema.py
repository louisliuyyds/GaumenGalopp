from pydantic import BaseModel
from typing import Optional

from schemas.adresse_schema import AdresseResponse, AdresseUpdate

# What data comes IN when creating a restaurant
class RestaurantCreate(BaseModel):
    name: str
    klassifizierung: Optional[str] = None
    adresseid: int
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None


# What data comes IN when updating
class RestaurantUpdate(BaseModel):
    # Restaurant
    name: Optional[str] = None
    klassifizierung: Optional[str] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    email: Optional[str] = None

    # Adresse
    adresseid: Optional[int] = None  # Option A
    straße: Optional[str] = None     # Option B
    hausnummer: Optional[str] = None
    postleitzahl: Optional[str] = None
    ort: Optional[str] = None
    land: Optional[str] = None


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


class RestaurantProfileResponse(RestaurantResponse):
    adresse: AdresseResponse


class RestaurantProfileUpdate(BaseModel):
    name: Optional[str] = None
    klassifizierung: Optional[str] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    adresse: Optional[AdresseUpdate] = None