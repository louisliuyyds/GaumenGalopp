from sqlalchemy.orm import Session
from ..models.bestellposition import Bestellposition
from typing import List

class BestellpositionService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, position_data: dict) -> Bestellposition:
   
        new_position = Bestellposition(**position_data)
        self.db.add(new_position)
        self.db.commit()
        self.db.refresh(new_position)
        return new_position

    def get_by_bestellung(self, bestellungid: int) -> List[Bestellposition]:
     
        return self.db.query(Bestellposition) \
            .filter(bestellungid == Bestellposition.bestellungid) \
            .all()

    def delete(self, bestellpositionid: int) -> bool:
        pos = self.db.query(Bestellposition).filter(bestellpositionid == Bestellposition.bestellpositionid).first()

        if not pos:
            return False

        self.db.delete(pos)
        self.db.commit()
        return True