from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.kochstil import Kochstil

#Kochstil = Cuisine = Italienisch, Asiatisch etc.
class KochstilService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Kochstil]:
        return self.db.query(Kochstil).all()

    def get_by_id(self, stil_id: int) -> Optional[Kochstil]:
        return self.db.query(Kochstil).filter(Kochstil.stilid == stil_id).first()

    def create(self, kochstil_data: dict) -> Kochstil:
        kochstil = Kochstil(**kochstil_data)
        self.db.add(kochstil)
        self.db.commit()
        self.db.refresh(kochstil)
        return kochstil

    def update(self, stil_id: int, update_data: dict) -> Optional[Kochstil]:
        kochstil = self.get_by_id(stil_id)
        if not kochstil:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(kochstil, key, value)

        self.db.commit()
        self.db.refresh(kochstil)
        return kochstil

    def delete(self, stil_id: int) -> bool:
        """mit Test, ob es aktuell noch verwendet wird, bevor es gelöscht wird"""
        kochstil = self.get_by_id(stil_id)
        if not kochstil:
            return False

        if kochstil.restaurants:
            return False  # Kann nicht gelöscht werden, weil noch Restaurants den Kochstil verwenden

        self.db.delete(kochstil)
        self.db.commit()
        return True