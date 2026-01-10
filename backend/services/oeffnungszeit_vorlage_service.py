from sqlalchemy.orm import Session

from models import OeffnungszeitVorlage
from models.oeffnungszeit_vorlage import OeffnungszeitVorlage
from typing import List, Optional, Any
from sqlalchemy.exc import IntegrityError

from utils.opening_hours_hash import generate_opening_hours_hash


class OeffnungszeitVorlageService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> list[type[OeffnungszeitVorlage]]:
        return self.db.query(OeffnungszeitVorlage).all()
    
    def get_by_id(self, oeffnungszeit_id: int) -> Optional[OeffnungszeitVorlage]:
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.oeffnungszeitid == oeffnungszeit_id
        ).first()
    
    def get_by_bezeichnung(self, bezeichnung: str) -> Optional[OeffnungszeitVorlage]:
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.bezeichnung == bezeichnung
        ).first()
    
    def search_by_bezeichnung(self, bezeichnung: str) -> list[type[OeffnungszeitVorlage]]:
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.bezeichnung.ilike(f"%{bezeichnung}%")
        ).all()

    def create(self, vorlage_data: dict):
        try:
            new_vorlage = OeffnungszeitVorlage(**vorlage_data)
            self.db.add(new_vorlage)
            self.db.commit()
            self.db.refresh(new_vorlage)
            return new_vorlage
        except IntegrityError:
            self.db.rollback()
            # Vorlage mit gleichem Namen existiert - hole sie
            return self.db.query(OeffnungszeitVorlage).filter(
                OeffnungszeitVorlage.bezeichnung == vorlage_data['bezeichnung']
            ).first()
    
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

    def find_by_hash(self, hash_signatur: str):
        """Finde Vorlage per Hash"""
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.hash_signatur == hash_signatur
        ).first()

    def create_with_hash(self, vorlage_data: dict, details_list: list):
        """Erstelle Vorlage mit Details oder gib existierende zurück"""
        from services.oeffnungszeit_detail_service import OeffnungszeitDetailService

        # 1. Hash generieren
        hash_sig = generate_opening_hours_hash(details_list)

        # 2. Existierende Vorlage mit gleichem Hash?
        existing = self.find_by_hash(hash_sig)
        if existing:
            return existing

        # 3. Neue Vorlage erstellen
        try:
            vorlage_data['hash_signatur'] = hash_sig
            new_vorlage = OeffnungszeitVorlage(**vorlage_data)
            self.db.add(new_vorlage)
            self.db.flush()  # ID generieren

            # 4. Details erstellen
            detail_service = OeffnungszeitDetailService(self.db)
            for detail_data in details_list:
                detail_data['oeffnungszeitid'] = new_vorlage.oeffnungszeitid
                detail_service.create(detail_data)

            self.db.commit()
            self.db.refresh(new_vorlage)
            return new_vorlage  # ✅ MUSS returnen!

        except Exception as e:
            self.db.rollback()
            # Versuche nach Hash zu suchen (falls Race Condition)
            result = self.find_by_hash(hash_sig)
            if result:
                return result
            raise e  # Sonst Error werfen

    def get_with_details(self, oeffnungszeit_id: int) -> Optional[OeffnungszeitVorlage]:
        """Get opening hours template with all details"""
        return self.db.query(OeffnungszeitVorlage).filter(
            OeffnungszeitVorlage.oeffnungszeitid == oeffnungszeit_id
        ).first()