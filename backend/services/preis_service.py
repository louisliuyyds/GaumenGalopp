from sqlalchemy.orm import Session
from models.preis import Preis
from typing import List, Optional

class PreisService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[type[Preis]]:
        return self.db.query(Preis).all()

    def get_by_preis_id(self, preisid: int) -> Optional[Preis]:
        return self.db.query(Preis).filter(Preis.preisid == preisid).first()

    def get_by_gericht_id(self, gericht_id: int) -> Optional[Preis]:
        return self.db.query(Preis).filter(Preis.gerichtid == gericht_id,Preis.istaktiv == True).first()

    def create(self, preis_data: dict) -> Preis:
        new_preis = Preis(**preis_data)
        self.db.add(new_preis)
        self.db.commit()
        self.db.refresh(new_preis)
        return new_preis

    def update(self, preisid: int, update_data: dict) -> Optional[Preis]:
        menue = self.get_by_preis_id(preisid)
        if not menue:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(menue, key, value)

        self.db.commit()
        self.db.refresh(menue)
        return menue

    def delete(self, preisid: int) -> Optional[Preis]:
        preis = self.get_by_id(preisid)
        if not preis:
            return None
        self.db.delete(preis)
        self.db.commit()
        self.db.refresh(preis)
        return preis