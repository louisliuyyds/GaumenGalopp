from sqlalchemy.orm import Session
from backend.models.bestellungen import Bestellungen
from backend.models.bestellposition import Bestellposition
from backend.models.preis import Preis
from typing import List, Optional

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
        return self.db.query(Bestellungen).filter(Bestellungen.bestellungid == bestellungid).first()

    def get_all(self) -> list[type[Bestellungen]]:
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
        """
        Berechnet den Gesamtpreis basierend auf bestellungid.
        """

        positionen = self.db.query(Bestellposition) \
            .filter(Bestellposition.bestellungid == bestellungid) \
            .all()

        total = 0.0

        for pos in positionen:

            active_price = self.db.query(Preis) \
                .filter(pos.gerichtid == Preis.gerichtid) \
                .filter(Preis.istaktiv == True) \
                .first()

            if active_price:
                preis_wert = float(active_price.betrag)

                total += (preis_wert * pos.menge)

        return round(total, 2)