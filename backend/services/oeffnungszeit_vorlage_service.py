from sqlalchemy.orm import Session
from ..models.oeffnungszeit_vorlage import OeffnungszeitVorlage
from typing import List, Optional


class OeffnungszeitVorlageService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[OeffnungszeitVorlage]:
        return self.db.query(OeffnungszeitVorlage).all()
    
    def get_by_id(self, oeffnungszeit_id: int) -> Optional[OeffnungszeitVorlage]:
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.oeffnungszeitID == oeffnungszeit_id
        ).first()
    
    def get_by_bezeichnung(self, bezeichnung: str) -> Optional[OeffnungszeitVorlage]:
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.bezeichnung == bezeichnung
        ).first()
    
    def search_by_bezeichnung(self, bezeichnung: str) -> List[OeffnungszeitVorlage]:
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.bezeichnung.ilike(f"%{bezeichnung}%")
        ).all()
    
    def create(self, vorlage_data: dict) -> OeffnungszeitVorlage:
        vorlage = OeffnungszeitVorlage(**vorlage_data)
        self.db.add(vorlage)
        self.db.commit()
        self.db.refresh(vorlage)
        return vorlage
    
    def update(self, oeffnungszeit_id: int, update_data: dict) -> Optional[OeffnungszeitVorlage]:
        vorlage = self.get_by_id(oeffnungszeit_id)
        if not vorlage:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(vorlage, key, value)
        
        self.db.commit()
        self.db.refresh(vorlage)
        return vorlage
    
    def delete(self, oeffnungszeit_id: int) -> bool:
        vorlage = self.get_by_id(oeffnungszeit_id)
        if not vorlage:
            return False
        self.db.delete(vorlage)
        self.db.commit()
        return True
    
    def get_with_details(self, oeffnungszeit_id: int) -> Optional[OeffnungszeitVorlage]:
        """Get opening hours template with all details"""
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.oeffnungszeitID == oeffnungszeit_id
        ).first()