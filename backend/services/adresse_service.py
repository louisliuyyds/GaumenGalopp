from sqlalchemy.orm import Session
from typing import List, Optional

from models import Kunde
from models.adresse import Adresse


class AdresseService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Adresse]:
        return self.db.query(Adresse).all()

    def get_by_id(self, adresse_id: int) -> Optional[Adresse]:
        return self.db.query(Adresse).filter(Adresse.adresseid == adresse_id).first()

    def create(self, adresse_data: dict) -> Adresse:
        adresse = Adresse(**adresse_data)
        self.db.add(adresse)
        self.db.commit()
        self.db.refresh(adresse)
        return adresse

    def update(self, adresse_id: int, update_data: dict) -> Optional[Adresse]:
        adresse = self.get_by_id(adresse_id)
        if not adresse:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(adresse, key, value)

        self.db.commit()
        self.db.refresh(adresse)
        return adresse

    def delete(self, adresse_id: int) -> bool:
        """Hard delete -- vllt lieber ganz weg lassen? -- schonmal mit check, ob in Benutzung"""
        adresse = self.get_by_id(adresse_id)
        if not adresse:
            return False

        # Prüfe, ob Adresse in Benutzung ist
        if adresse.kunden:
            return False  # Wird nicht gelöscht

        self.db.delete(adresse)
        self.db.commit()
        return True

    def search_by_plz(self, postleitzahl: str) -> List[Adresse]:
        """Ermöglicht besseres Filtern für Restaurants"""
        #aktuell einzige Möglichkeit Restaurants in der Nähe zu filtern?!
        return self.db.query(Adresse).filter(Adresse.postleitzahl == postleitzahl).all()