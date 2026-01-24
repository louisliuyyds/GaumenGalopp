from pydantic import BaseModel, computed_field
from typing import Optional, List
from datetime import datetime

# ===== BESTEHENDE SCHEMAS =====
class BestellungCreate(BaseModel):
    bestellungid: int
    kundenid: int
    restaurantid: int
    adressid: int
    lieferantid: Optional[int] = None
    status: Optional[str] = "Eingegangen"

class BestellungUpdate(BaseModel):
    status: Optional[str] = None
    lieferantid: Optional[int] = None


class BestellungResponse(BaseModel):
    bestellungid: int
    kundenid: int
    restaurantid: int
    adressid: int
    lieferantid: Optional[int] = None
    status: str
    gesamtpreis: Optional[float] = None

    @property
    def lieferadresseid(self):
        return self.adressid

    class Config:
        from_attributes = True


# ===== NEUE SCHEMAS FÜR DETAIL-ANSICHT =====
class GerichtDetail(BaseModel):
    gerichtid: int
    name: str
    beschreibung: Optional[str] = None
    kategorie: Optional[str] = None

    class Config:
        from_attributes = True

class PreisDetail(BaseModel):
    preisid: int
    betrag: float

    class Config:
        from_attributes = True

class BestellpositionDetail(BaseModel):
    positionid: int
    menge: int
    aenderungswunsch: Optional[str] = None
    gericht: GerichtDetail
    preis: PreisDetail
    zwischensumme: float

    class Config:
        from_attributes = True

class RestaurantDetail(BaseModel):
    restaurantid: int
    name: str
    klassifizierung: Optional[str] = None
    telefon: Optional[str] = None
    kuechenchef: Optional[str] = None

    class Config:
        from_attributes = True

class LieferantDetail(BaseModel):
    lieferantid: int
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    telephone: Optional[str] = None
    vollstaendiger_name: str

    class Config:
        from_attributes = True

class AdresseDetail(BaseModel):
    adresseid: int
    straße: str
    hausnummer: str
    postleitzahl: str
    ort: str
    land: str
    vollstaendige_adresse: str

    class Config:
        from_attributes = True

class BestellungDetailResponse(BaseModel):
    bestellungid: int
    kundenid: int
    status: str
    restaurant: RestaurantDetail
    lieferant: Optional[LieferantDetail] = None
    lieferadresse: AdresseDetail
    positionen: List[BestellpositionDetail]
    gesamtpreis: float

    class Config:
        from_attributes = True