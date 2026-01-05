from sqlalchemy.orm import Session
from models.oeffnungszeit_detail import OeffnungszeitDetail
from typing import List, Optional, Any
from sqlalchemy.exc import IntegrityError



class OeffnungszeitDetailService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[OeffnungszeitDetail]:
        return self.db.query(OeffnungszeitDetail).all()
    
    def get_by_id(self, detail_id: int) -> Optional[OeffnungszeitDetail]:
        return self.db.query(OeffnungszeitDetail).filter(
            OeffnungszeitDetail.detailid == detail_id
        ).first()
    
    def get_by_vorlage_id(self, oeffnungszeit_id: int) -> list[type[OeffnungszeitDetail]]:
        """Get all details for an opening hours template"""
        return self.db.query(OeffnungszeitDetail).filter(
            OeffnungszeitDetail.oeffnungszeitid == oeffnungszeit_id
        ).all()
    
    def get_by_wochentag(self, oeffnungszeit_id: int, wochentag: int) -> Optional[OeffnungszeitDetail]:
        """Get detail for a specific day of week"""
        return self.db.query(OeffnungszeitDetail).filter(
            OeffnungszeitDetail.oeffnungszeitid == oeffnungszeit_id,
            OeffnungszeitDetail.wochentag == wochentag
        ).first()
    
    def get_open_days(self, oeffnungszeit_id: int) -> list[type[OeffnungszeitDetail]]:
        """Get all days that are open"""
        return self.db.query(OeffnungszeitDetail).filter(
            OeffnungszeitDetail.oeffnungszeitid == oeffnungszeit_id,
            OeffnungszeitDetail.ist_geschlossen == False
        ).all()

    def create(self, detail_data: dict):
        try:
            new_detail = OeffnungszeitDetail(**detail_data)
            self.db.add(new_detail)
            self.db.commit()
            self.db.refresh(new_detail)
            return new_detail
        except IntegrityError:
            self.db.rollback()
            # Detail existiert bereits - hole es
            return self.db.query(OeffnungszeitDetail).filter(
                OeffnungszeitDetail.oeffnungszeitid == detail_data['oeffnungszeitid'],
                OeffnungszeitDetail.wochentag == detail_data['wochentag']
            ).first()
    
    def update(self, detail_id: int, update_data: dict) -> Optional[OeffnungszeitDetail]:
        detail = self.get_by_id(detail_id)
        if not detail:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(detail, key, value)
        
        self.db.commit()
        self.db.refresh(detail)
        return detail
    
    def delete(self, detail_id: int) -> bool:
        detail = self.get_by_id(detail_id)
        if not detail:
            return False
        self.db.delete(detail)
        self.db.commit()
        return True