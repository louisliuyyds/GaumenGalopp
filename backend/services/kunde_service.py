import self
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from models import kunde
from models.kunde import Kunde
from services.adresse_service import AdresseService



class KundeService:
    def __init__(self, db: Session):
        self.db = db
        self.adresse_service = AdresseService(db)

# wenn wir eine Detailed Ansicht von den Kunden haben im Frontend (z.B. im Profil)
# wäre es sinnvoll hier einen JoinedLoad zu machen
    def get_all(self) -> List[Kunde]:
        """Hole alle Kunden mit ihren Adressen"""
        return self.db.query(Kunde).all()

    def get_by_id(self, kunden_id: int) -> Optional[Kunde]:
        """Hole einen Kunden mit seiner Adresse"""
        return self.db.query(Kunde) \
            .options(joinedload(Kunde.adresse)) \
            .filter(Kunde.kundenid == kunden_id) \
            .first()
    
    def get_kuerzel_by_id(self, kunden_id: int) -> Optional[str]:
        """Hole nur das Namenskürzel eines Kunden"""
        result = self.db.query(Kunde.namenskuerzel) \
            .filter(Kunde.kundenid == kunden_id) \
            .first()
        return result[0] if result else None


    def get_adressid_by_kunden_id(self, kunden_id: int) -> Optional[int]:
        return (
            self.db.query(Kunde.adressid)
            .filter(Kunde.kundenid == kunden_id)
            .scalar()
        )


    def create(self, kunde_data: dict) -> Kunde:
        kunde = Kunde(**kunde_data)
        self.db.add(kunde)
        self.db.commit()
        self.db.refresh(kunde)
        return kunde

    def update(self, kunden_id: int, update_data: dict) -> Optional[Kunde]:
        kunde = self.get_by_id(kunden_id)
        if not kunde:
            return None

        # Trenne Adress- von Kunde-Feldern
        adress_fields = ['straße', 'hausnummer', 'postleitzahl', 'ort', 'land']
        adress_data = {k: v for k, v in update_data.items() if k in adress_fields}
        kunde_data = {k: v for k, v in update_data.items() if k not in adress_fields}

        # Prüfe was geschickt wurde
        has_adress_id = 'adresseid' in kunde_data
        has_adress_data = bool(adress_data)

        if has_adress_id and has_adress_data:
            raise ValueError("Sende entweder adresseid ODER Adress-Daten!")

        elif has_adress_data and kunde.adresseid:
            # Smart Adress-Update
            updated_adresse = self.adresse_service.update(
                kunde.adresseid,
                adress_data
            )
            kunde.adresseid = updated_adresse.adresseid

        elif has_adress_id:
            # Direkt setzen
            kunde.adresseid = kunde_data['adresseid']
            kunde_data.pop('adresseid')

        # Kunde-Update
        for key, value in kunde_data.items():
            if value is not None and hasattr(kunde, key):
                setattr(kunde, key, value)

        self.db.commit()
        self.db.refresh(kunde)
        return kunde

    def delete(self, kunden_id: int) -> bool:
        """Hard delete - für Studienprojekt OK"""
        kunde = self.get_by_id(kunden_id)
        if not kunde:
            return False

        self.db.delete(kunde)
        self.db.commit()
        return True