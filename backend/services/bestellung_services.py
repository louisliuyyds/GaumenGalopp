from sqlalchemy.orm import Session, joinedload
from models.bestellungen import Bestellungen
from models.bestellposition import Bestellposition
from models.preis import Preis
from models.gericht import Gericht
from models.restaurant import Restaurant
from models.lieferant import Lieferant
from models.adresse import Adresse
from typing import List, Optional, Type
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

    def get_all(self) -> list[Type[Bestellungen]]:
        return self.db.query(Bestellungen).filter(
            Bestellungen.status != 'warenkorb'
        ).all()

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

    def get_by_kunde(self, kundenid: int) -> list[Type[Bestellungen]]:
        return self.db.query(Bestellungen).filter(
            Bestellungen.kundenid == kundenid,
            Bestellungen.status != 'warenkorb'
        )

    def get_detail_by_id(self, bestellungid: int) -> Optional[dict]:
        """
        Gibt eine Bestellung mit ALLEN Details zurück
        """
        # Hole die Bestellung
        bestellung = self.db.query(Bestellungen).filter(
            Bestellungen.bestellungid == bestellungid
        ).first()

        if not bestellung:
            return None

        if bestellung.status == "warenkorb":
            return {
                "bestellungid": bestellung.bestellungid,
                "kundenid": bestellung.kundenid,
                "status": bestellung.status,
                "restaurant": None,
                "lieferant": None,
                "adresse": None,
                "positionen": [],
                "gesamtpreis": 0
            }

        # Hole Restaurant
        restaurant = self.db.query(Restaurant).filter(
            Restaurant.restaurantid == bestellung.restaurantid
        ).first()

        # Hole Lieferant
        lieferant = self.db.query(Lieferant).filter(
            Lieferant.lieferantid == bestellung.lieferantid
        ).first()

        # Hole Adresse
        adresse = self.db.query(Adresse).filter(
            Adresse.adresseid == bestellung.adressid
        ).first()

        # Hole ALLE Positionen - hier ist der wichtige Teil!
        positionen = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == bestellungid
        ).all()

        # Lade für jede Position das Gericht und den Preis
        positionen_mit_details = []
        gesamtpreis = 0

        for pos in positionen:
            gericht = self.db.query(Gericht).filter(
                Gericht.gerichtid == pos.gerichtid
            ).first()

            preis = self.db.query(Preis).filter(
                Preis.preisid == pos.preisid
            ).first()

            if gericht and preis:
                zwischensumme = pos.menge * float(preis.betrag)
                gesamtpreis += zwischensumme

                positionen_mit_details.append(
                    BestellpositionDetail(
                        positionid=pos.positionid,
                        menge=pos.menge,
                        aenderungswunsch=pos.aenderungswunsch,
                        gericht=GerichtDetail(
                            gerichtid=gericht.gerichtid,
                            name=gericht.name,
                            beschreibung=gericht.beschreibung,
                            kategorie=gericht.kategorie
                        ),
                        preis=PreisDetail(
                            preisid=preis.preisid,
                            betrag=float(preis.betrag)
                        ),
                        zwischensumme=zwischensumme
                    )
                )

        # Baue Response
        return {
            "bestellungid": bestellung.bestellungid,
            "kundenid": bestellung.kundenid,
            "status": bestellung.status,
            "restaurant": RestaurantDetail(
                restaurantid=restaurant.restaurantid,
                name=restaurant.name,
                klassifizierung=restaurant.klassifizierung,
                telefon=restaurant.telefon,
                kuechenchef=restaurant.kuechenchef
            ) if restaurant else None,

            "lieferant": LieferantDetail(
                lieferantid=lieferant.lieferantid,
                vorname=lieferant.vorname,
                nachname=lieferant.nachname,
                telephone=lieferant.telephone,
                vollstaendiger_name=f"{lieferant.vorname or ''} {lieferant.nachname or ''}".strip()
            ) if lieferant else None,

            "lieferadresse": AdresseDetail(
                adresseid=adresse.adresseid,
                straße=adresse.straße,
                hausnummer=adresse.hausnummer,
                postleitzahl=adresse.postleitzahl,
                ort=adresse.ort,
                land=adresse.land,
                vollstaendige_adresse=f"{adresse.straße} {adresse.hausnummer}, {adresse.postleitzahl} {adresse.ort}"
            ) if adresse else None,

            "positionen": positionen_mit_details,

            "gesamtpreis": round(gesamtpreis, 2)
        }