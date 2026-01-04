from sqlalchemy.orm import Session
from models.bewertung import Bewertung
from typing import List, Optional

class BewertungService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> list[type[Bewertung]]:
        return self.db.query(Bewertung).all()
    
    def get_by_id(self, bewertungid: int) -> Optional[Bewertung]:
        return self.db.query(Bewertung).filter(Bewertung.bewertungid == bewertungid).first()
    
    def get_by_gericht(self, gerichtid: int) -> List[Bewertung]:
        """
        Alle Bewertungen für ein bestimmtes Gericht abrufen
        """
        return self.db.query(Bewertung).filter(Bewertung.gerichtid == gerichtid).all()
    
    def create(self, bewertung_data: dict) -> Bewertung:
        bewertung = Bewertung(**bewertung_data)
        self.db.add(bewertung)
        self.db.commit()
        self.db.refresh(bewertung)
        return bewertung
    
    def update(self, bewertungid: int, update_data: dict) -> Optional[Bewertung]:
        bewertung = self.get_by_id(bewertungid)
        if not bewertung:
            return None
        
        for key, value in update_data.items():
            if value is not None:  # Only update fields that are provided
                setattr(bewertung, key, value)
        
        self.db.commit()
        self.db.refresh(bewertung)
        return bewertung
    
    def delete(self, bewertungid: int) -> bool:
        bewertung = self.get_by_id(bewertungid)
        if not bewertung:
            return False
        self.db.delete(bewertung)
        self.db.commit()
        return True