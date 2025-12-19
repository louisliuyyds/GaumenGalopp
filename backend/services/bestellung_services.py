
from sqlalchemy.orm import Session, joinedload
from models.bestellungen import Bestellungen
from models.bestellposition import Bestellposition
from models.preis import Preis
from models.gericht import Gericht
from models.restaurant import Restaurant
from models.lieferant import Lieferant
from models.adresse import Adresse
from typing import List, Optional
from schemas.bestellung_schemas import (
    RestaurantDetail, LieferantDetail, AdresseDetail,
    BestellpositionDetail, GerichtDetail, PreisDetail
)

class BestellungService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, bestellung_data: dict) -> Bestellungen:
        new_bestellung = Bestellungen(**bestellung_data)
        self.db.add(new_bestellung)
        self.db.commit()
        self.db.refresh(new_bestellung)
        return new_bestellung

    def get_by_id(self, bestellungid: int) -> Optional[Bestellungen]:
        return self.db.query(Bestellungen).filter(
            Bestellungen.bestellungid == bestellungid
        ).first()

    def get_all(self) -> List[Bestellungen]:
        return self.db.query(Bestellungen).all()

    def update(self, bestellungid: int, update_data: dict) -> Optional[Bestellungen]:
        bestellung = self.get_by_id(bestellungid)
        if not bestellung:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(bestellung, key, value)

        self.db.commit()
        self.db.refresh(bestellung)
        return bestellung

    def calculate_total(self, bestellungid: int) -> float:
        positionen = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == bestellungid
        ).all()

        total = sum(
            pos.menge * float(pos.preis.betrag)
            for pos in positionen
            if pos.preis and pos.preis.betrag
        )
        return round(total, 2)

    def get_by_kunde(self, kundenid: int) -> List[Bestellungen]:
        return self.db.query(Bestellungen).filter(
            Bestellungen.kundenid == kundenid
        ).all()

    def get_detail_by_id(self, bestellungid: int) -> Optional[dict]:
        """
        Gibt eine Bestellung mit ALLEN Details zurück
        """
        bestellung = self.db.query(Bestellungen).options(
            joinedload(Bestellungen.bestellposition).joinedload(Bestellposition.gericht),
            joinedload(Bestellungen.bestellposition).joinedload(Bestellposition.preis),
            joinedload(Bestellungen.restaurant),
            joinedload(Bestellungen.lieferant),
            joinedload(Bestellungen.adresse)
        ).filter(
            Bestellungen.bestellungid == bestellungid
        ).first()

        if not bestellung:
            return None

        # Berechne Gesamtpreis
        gesamtpreis = sum(
            pos.menge * float(pos.preis.betrag)
            for pos in bestellung.bestellposition
            if pos.preis and pos.preis.betrag
        )

        # Baue Response
        return {
            "bestellungid": bestellung.bestellungid,
            "kundenid": bestellung.kundenid,
            "status": bestellung.status,
            "bestellzeit": bestellung.bestellzeit,

            "restaurant": RestaurantDetail(
                restaurantid=bestellung.restaurant.restaurantid,
                name=bestellung.restaurant.name,
                klassifizierung=bestellung.restaurant.klassifizierung,
                telefon=bestellung.restaurant.telefon,
                kuechenchef=bestellung.restaurant.kuechenchef
            ) if bestellung.restaurant else None,

            "lieferant": LieferantDetail(
                lieferantid=bestellung.lieferant.lieferantid,
                vorname=bestellung.lieferant.vorname,
                nachname=bestellung.lieferant.nachname,
                telephone=bestellung.lieferant.telephone,
                vollstaendiger_name=f"{bestellung.lieferant.vorname or ''} {bestellung.lieferant.nachname or ''}".strip()
            ) if bestellung.lieferant else None,

            "lieferadresse": AdresseDetail(
                adresseid=bestellung.adresse.adresseid,
                straße=bestellung.adresse.straße,
                hausnummer=bestellung.adresse.hausnummer,
                postleitzahl=bestellung.adresse.postleitzahl,
                ort=bestellung.adresse.ort,
                land=bestellung.adresse.land,
                vollstaendige_adresse=f"{bestellung.adresse.straße} {bestellung.adresse.hausnummer}, {bestellung.adresse.postleitzahl} {bestellung.adresse.ort}"
            ) if bestellung.adresse else None,

            "positionen": [
                BestellpositionDetail(
                    positionid=pos.positionid,
                    menge=pos.menge,
                    aenderungswunsch=pos.aenderungswunsch,
                    gericht=GerichtDetail(
                        gerichtid=pos.gericht.gerichtid,
                        name=pos.gericht.name,
                        beschreibung=pos.gericht.beschreibung,
                        kategorie=pos.gericht.kategorie
                    ),
                    preis=PreisDetail(
                        preisid=pos.preis.preisid,
                        betrag=float(pos.preis.betrag)
                    ),
                    zwischensumme=pos.menge * float(pos.preis.betrag)
                )
                for pos in bestellung.bestellposition
            ],

            "gesamtpreis": round(gesamtpreis, 2)
        }