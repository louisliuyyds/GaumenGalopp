from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.kunde import Kunde


class KundeService:
    def __init__(self, db: Session):
        self.db = db

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

        adresse_data = update_data.pop("adresse", None)

        for key, value in update_data.items():
            if value is not None:
                setattr(kunde, key, value)

        if adresse_data and kunde.adresse:
            for key, value in adresse_data.items():
                if value is not None:
                    setattr(kunde.adresse, key, value)

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