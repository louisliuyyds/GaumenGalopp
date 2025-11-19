from sqlalchemy.orm import Session

from Code.backend.models.bestellungen import Bestellungen
from ..models.bestellungen import Bestellungen
from typing import List, Optional

class BestellungService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[type[Bestellungen]]:
        return self.db.query(Bestellungen).all()

    def get_by_id(self, bestellungid: int) -> Optional[Bestellungen]:
        return self.db.query(Bestellungen).filter(Bestellungen.bestellungid == bestellungid).first()

    def create(self, bestellung_data: dict) -> Bestellungen:
        new_bestellung = Bestellungen(**bestellung_data)
        self.db.add(new_bestellung)
        self.db.commit()
        self.db.refresh(new_bestellung)
        return new_bestellung

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