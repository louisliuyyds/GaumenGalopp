from sqlalchemy.orm import Session
from typing import List, Optional

from models import adresse
from models.adresse import Adresse

from sqlalchemy import func
from models.restaurant import Restaurant
from models.kunde import Kunde
from models.bestellungen import Bestellungen


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

    def _count_address_usage(self, adresse_id: int) -> int:
        restaurant_count = self.db.query(func.count(Restaurant.restaurantid)) \
                               .filter(Restaurant.adresseid == adresse_id).scalar() or 0
        kunde_count = self.db.query(func.count(Kunde.kundenid)) \
                      .filter(Kunde.adressid == adresse_id).scalar() or 0
        bestellung_count = self.db.query(func.count(Bestellungen.bestellungid)) \
                           .filter(Bestellungen.adressid == adresse_id).scalar() or 0
        return restaurant_count + kunde_count + bestellung_count


    def update(self, adresse_id: int, update_data: dict):
        """Smart Update mit Copy-on-Write"""
        adresse = self.get_by_id(adresse_id)
        if not adresse:
            return None

        usage_count = self._count_address_usage(adresse_id)

        if usage_count > 1:
            # 🆕 COPY-ON-WRITE
            print(f" Adresse {adresse_id} geteilt ({usage_count}) → Neue Adresse")
            neue_adresse = Adresse(**update_data)
            self.db.add(neue_adresse)
            self.db.commit()
            self.db.refresh(neue_adresse)
            return neue_adresse
        else:
            # ✏️ IN-PLACE UPDATE
            print(f" Adresse {adresse_id} single-use → In-place Update")
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