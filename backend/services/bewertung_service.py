from sqlalchemy.orm import Session
from ..models.bewertung import Bewertung
from typing import List, Optional

class BewertungService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Bewertung]:
        return self.db.query(Bewertung).filter(Bewertung.is_active == True).all()
    
    def get_by_id(self, bewertung_id: int) -> Optional[Bewertung]:
        return self.db.query(Bewertung).filter(Bewertung.id == bewertung_id).first()
    
    def create(self, bewertung_data: dict) -> Bewertung:
        bewertung = Bewertung(**bewertung_data)
        self.db.add(bewertung)
        self.db.commit()
        self.db.refresh(bewertung)
        return bewertung
    
    def update(self, bewertung_id: int, update_data: dict) -> Optional[Bewertung]:
        bewertung = self.get_by_id(bewertung_id)
        if not bewertung:
            return None
        
        for key, value in update_data.items():
            if value is not None:  # Only update fields that are provided
                setattr(bewertung, key, value)
        
        self.db.commit()
        self.db.refresh(bewertung)
        return bewertung
    
    def delete(self, bewertung_id: int) -> bool:
        bewertung = self.get_by_id(bewertung_id)
        if not bewertung:
            return False
        bewertung.is_active = False
        self.db.commit()
        return True