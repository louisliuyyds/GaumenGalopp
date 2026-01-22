from sqlalchemy.orm import Session
from sqlalchemy import or_
from models.gericht import Gericht
from models.restaurant import Restaurant
from models.menue import Menue
from typing import Optional, List

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

    def update(self, gerichtid: int, gericht_data: dict) -> Optional[Gericht]:
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

    # NEU: Suche mit Restaurant-Info
    def search_with_restaurant(self, query: str, limit: int = 20) -> List[dict]:
        """
        Sucht Gerichte nach Name, Beschreibung oder Kategorie
        und gibt Restaurant-Informationen mit zurück
        """
        search_pattern = f"%{query}%"

        results = (
            self.db.query(
                Gericht.gerichtid,
                Gericht.name,
                Gericht.beschreibung,
                Gericht.kategorie,
                Restaurant.restaurantid,
                Restaurant.name.label('restaurantname')
            )
            .join(Menue, Gericht.menuid == Menue.menuid)
            .join(Restaurant, Menue.restaurantid == Restaurant.restaurantid)
            .filter(
                or_(
                    Gericht.name.ilike(search_pattern),
                    Gericht.beschreibung.ilike(search_pattern),
                    Gericht.kategorie.ilike(search_pattern)
                )
            )
            .filter(Gericht.ist_aktiv == True)
            .limit(limit)
            .all()
        )

        return [
            {
                "gerichtid": r.gerichtid,
                "name": r.name,
                "beschreibung": r.beschreibung,
                "kategorie": r.kategorie,
                "restaurantid": r.restaurantid,
                "restaurantname": r.restaurantname
            }
            for r in results
        ]