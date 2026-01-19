from sqlalchemy.orm import Session
from models.gericht import Gericht
from typing import Optional

class GerichtService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[type[Gericht]]:
        return (
            self.db.query(Gericht)
            .filter(Gericht.ist_aktiv.is_(True))
            .all()
        )

    def get_by_id(self, gerichtid: int) -> Optional[Gericht]:
        return (
            self.db.query(Gericht)
            .filter(
                Gericht.gerichtid == gerichtid,
                Gericht.ist_aktiv.is_(True)
            )
            .first()
        )

    def get_by_id_list(self, id_list: list[int]) -> list[type[Gericht]]:
        if not id_list:
            return []

        return (
            self.db.query(Gericht)
            .filter(
                Gericht.gerichtid.in_(id_list),
                Gericht.ist_aktiv.is_(True)
            )
            .all()
        )

    def create(self, gericht_data: dict) -> Gericht:
        new_gericht = Gericht(**gericht_data)
        self.db.add(new_gericht)
        self.db.commit()
        self.db.refresh(new_gericht)
        return new_gericht

    def update(self,gerichtid: int, gericht_data: dict) -> Optional[Gericht]:
        gericht = self.get_by_id(gerichtid)
        if not gericht:
            return None

        for key, value in gericht_data.items():
            if value is not None:
                setattr(gericht, key, value)

        self.db.commit()
        self.db.refresh(gericht)
        return gericht

    def deactivate(self, gerichtid: int) -> Optional[Gericht]:
        gericht = self.get_by_id(gerichtid)
        if not gericht:
            return None

        if not gericht.ist_aktiv:
            return gericht  # bereits deaktiviert

        gericht.ist_aktiv = False
        self.db.commit()
        self.db.refresh(gericht)
        return gericht