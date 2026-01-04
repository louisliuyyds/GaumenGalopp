from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time

# What data comes IN when creating a restaurant_oeffnungszeit
class RestaurantOeffnungszeitCreate(BaseModel):
    restaurantid: int
    oeffnungszeitid: int
    gueltig_von: date
    gueltig_bis: Optional[date] = None
    ist_aktiv: Optional[bool] = True


# What data comes IN when updating
class RestaurantOeffnungszeitUpdate(BaseModel):
    gueltig_bis: Optional[date] = None
    ist_aktiv: Optional[bool] = None


# What data goes OUT to the frontend
class RestaurantOeffnungszeitResponse(BaseModel):
    restaurantid: int
    oeffnungszeitid: int
    gueltig_von: date
    gueltig_bis: Optional[date]
    ist_aktiv: bool
    
    class Config:
        from_attributes = True


class OeffnungszeitDetailProfile(BaseModel):
    detailid: Optional[int] = None
    wochentag: int
    oeffnungszeit: Optional[time] = None
    schliessungszeit: Optional[time] = None
    ist_geschlossen: bool = False


class OeffnungszeitVorlageProfile(BaseModel):
    oeffnungszeitid: int
    bezeichnung: str
    beschreibung: Optional[str] = None
    details: List[OeffnungszeitDetailProfile]


class RestaurantOpeningProfileResponse(BaseModel):
    restaurantid: int
    oeffnungszeitid: int
    gueltig_von: date
    gueltig_bis: Optional[date]
    ist_aktiv: bool
    vorlage: OeffnungszeitVorlageProfile

    class Config:
        from_attributes = True


class OeffnungszeitVorlageProfileUpdate(BaseModel):
    oeffnungszeitid: int
    bezeichnung: Optional[str] = None
    beschreibung: Optional[str] = None
    details: List[OeffnungszeitDetailProfile]


class RestaurantOpeningProfileUpdate(BaseModel):
    oeffnungszeitid: int
    gueltig_von: date
    gueltig_bis: Optional[date] = None
    ist_aktiv: Optional[bool] = True
    vorlage: OeffnungszeitVorlageProfileUpdate