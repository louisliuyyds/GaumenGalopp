from pydantic import BaseModel
from typing import Optional, List

# Existing schemas
class RestaurantCreate(BaseModel):
    name: str
    klassifizierung: Optional[str] = None
    adresseid: int
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    email: str

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    klassifizierung: Optional[str] = None
    adresseid: Optional[int] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    email: Optional[str] = None

class RestaurantResponse(BaseModel):
    restaurantid: int
    name: str
    klassifizierung: Optional[str] = None
    adresseid: int
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    email: str

    class Config:
        from_attributes = True

# Profile Schemas
class AdresseSchema(BaseModel):
    straße: Optional[str] = None
    hausnummer: Optional[str] = None
    postleitzahl: Optional[str] = None
    ort: Optional[str] = None
    land: Optional[str] = None

class RestaurantProfileUpdate(BaseModel):
    name: Optional[str] = None
    klassifizierung: Optional[str] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    email: Optional[str] = None
    adresse: Optional[AdresseSchema] = None

class RestaurantProfileResponse(BaseModel):
    restaurantid: int
    name: str
    klassifizierung: Optional[str] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None
    email: str
    adresse: Optional[dict] = None

    class Config:
        from_attributes = True

# Opening Hours Schemas
class OeffnungszeitVorlageSchema(BaseModel):
    name: Optional[str] = None
    beschreibung: Optional[str] = None

class RestaurantOpeningProfileUpdate(BaseModel):
    gueltig_bis: Optional[str] = None
    ist_aktiv: Optional[bool] = None
    vorlage: OeffnungszeitVorlageSchema

class RestaurantOpeningProfileResponse(BaseModel):
    restaurantid: int
    oeffnungszeitid: int
    gueltig_von: str
    gueltig_bis: Optional[str] = None
    ist_aktiv: bool
    vorlage: Optional[dict] = None

    class Config:
        from_attributes = True


# ===== NEUE BEWERTUNGS-SCHEMAS =====

class RestaurantBewertungenResponse(BaseModel):
    """Aggregierte Bewertungen eines Restaurants"""
    durchschnitt_gesamt: float
    anzahl_gesamt: int
    anzahl_kunden: int
    anzahl_kritiker: int
    durchschnitt_kunden: Optional[float] = None
    durchschnitt_kritiker: Optional[float] = None

    class Config:
        from_attributes = True


class GerichtHighlightSchema(BaseModel):
    """Gericht mit Bewertungs-Highlight"""
    gerichtid: int
    name: str
    beschreibung: Optional[str] = None
    kategorie: Optional[str] = None
    durchschnitt: float
    anzahl_bewertungen: int

    class Config:
        from_attributes = True


class CustomerFavoriteSchema(BaseModel):
    """Customer Favorite mit Kommentar-Snippets"""
    gerichtid: int
    name: str
    beschreibung: Optional[str] = None
    kategorie: Optional[str] = None
    durchschnitt_kunden: float
    anzahl_bewertungen: int
    beispiel_kommentare: List[str]

    class Config:
        from_attributes = True