from sqlalchemy.orm import Session
from ..models.bestellposition import Bestellposition
from typing import List, Optional, Any


class BestellpositionService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_bestellung(self, bestellungid: int) -> list[type[Bestellposition]]:
        """Holt alle Positionen einer bestimmten Bestellung"""
        return self.db.query(Bestellposition).filter(Bestellposition.bestellungid == bestellungid).all()

    def create(self, position_data: dict) -> Bestellposition:
        """Fügt ein Gericht zur Bestellung hinzu"""
        # Hier könnte man prüfen, ob das Gericht überhaupt existiert (optional)
        new_position = Bestellposition(**position_data)
        self.db.add(new_position)
        self.db.commit()
        self.db.refresh(new_position)
        return new_position

    def delete(self, positionid: int) -> bool:
        """Entfernt eine Position (z.B. Kunde hat sich umentschieden)"""
        pos = self.db.query(Bestellposition).filter(Bestellposition.bestellungid == positionid).first()
        if not pos:
            return False
        self.db.delete(pos)
        self.db.commit()
        return True