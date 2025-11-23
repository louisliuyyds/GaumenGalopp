from sqlalchemy.orm import Session
from ..models.lieferant import Lieferant
from ..models.lieferant import Lieferant
from typing import List, Optional

class LieferantService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[type[Lieferant]]:
        return self.db.query(Lieferant).all()

    def get_by_id(self, lieferantid: int) -> Optional[Lieferant]:
        return self.db.query(Lieferant).filter(Lieferant.lieferantid == lieferantid).first()

    def create(self, lieferant_data: dict) -> Lieferant:
        new_lieferant = Lieferant(**lieferant_data)
        self.db.add(new_lieferant)
        self.db.commit()
        self.db.refresh(new_lieferant)
        return new_lieferant

    def delete(self, lieferantid: int) -> bool:
        lieferant = self.get_by_id(lieferantid)
        if not lieferant:
            return False
        self.db.delete(lieferant)
        self.db.commit()
        return True