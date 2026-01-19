from sqlalchemy.orm import Session

from models import Kritiker
from models.kritiker import Kritiker
from typing import List, Optional

class KritikerService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> list[type[Kritiker]]:
        return self.db.query(Kritiker).all()
    
    def get_by_id(self, kritiker_id: int) -> Optional[Kritiker]:
        return self.db.query(Kritiker).filter(Kritiker.kritikerid == kritiker_id).first()

    def get_by_kunden_id(self, kunden_id: int) -> Optional[Kritiker]:
        return self.db.query(Kritiker).filter(Kritiker.kundenid == kunden_id).first()
    
    def create(self, kritiker_data: dict) -> Kritiker:
        kritiker = Kritiker(**kritiker_data)
        self.db.add(kritiker)
        self.db.commit()
        self.db.refresh(kritiker)
        return kritiker
    
    def update(self, kritiker_id: int, update_data: dict) -> Optional[Kritiker]:
        kritiker = self.get_by_id(kritiker_id)
        if not kritiker:
            return None
        
        for key, value in update_data.items():
            if value is not None:  # Only update fields that are provided
                setattr(kritiker, key, value)
        
        self.db.commit()
        self.db.refresh(kritiker)
        return kritiker
    
    def delete(self, kritiker_id: int) -> bool:
        kritiker = self.get_by_id(kritiker_id)
        if not kritiker:
            return False
        self.db.delete(kritiker)
        self.db.commit()
        self.db.refresh(kritiker)
        return True
