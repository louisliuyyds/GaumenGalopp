# services/bewertungkritiker_service.py
from sqlalchemy.orm import Session
from models.bewertungkritiker import Bewertungkritiker
from typing import List, Optional

class BewertungkritikerService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Bewertungkritiker]:
        return self.db.query(Bewertungkritiker).filter(Bewertungkritiker.is_active == True).all()
    
    def get_by_id(self, bewertungkritiker_id: int) -> Optional[Bewertungkritiker]:
        return self.db.query(Bewertungkritiker).filter(Bewertungkritiker.id == bewertungkritiker_id).first()
    
    def create(self, bewertungkritiker_data: dict) -> Bewertungkritiker:
        bewertungkritiker = Bewertungkritiker(**bewertungkritiker_data)
        self.db.add(bewertungkritiker)
        self.db.commit()
        self.db.refresh(bewertungkritiker)
        return bewertungkritiker
    
    def update(self, bewertungkritiker_id: int, update_data: dict) -> Optional[Bewertungkritiker]:
        bewertungkritiker = self.get_by_id(bewertungkritiker_id)
        if not bewertungkritiker:
            return None
        
        for key, value in update_data.items():
            if value is not None:  # Only update fields that are provided
                setattr(bewertungkritiker, key, value)
        
        self.db.commit()
        self.db.refresh(bewertungkritiker)
        return bewertungkritiker
    
    def delete(self, bewertungkritiker_id: int) -> bool:
        bewertungkritiker = self.get_by_id(bewertungkritiker_id)
        if not bewertungkritiker:
            return False
        bewertungkritiker.is_active = False
        self.db.commit()
        return True