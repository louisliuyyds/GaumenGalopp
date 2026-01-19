from sqlalchemy.orm import Session, joinedload
from models import RestaurantOeffnungszeit, OeffnungszeitVorlage, OeffnungszeitDetail
from typing import List, Optional, Any
from datetime import date
from sqlalchemy.exc import IntegrityError



class RestaurantOeffnungszeitService:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[type[RestaurantOeffnungszeit]]:
        return self.db.query(RestaurantOeffnungszeit).all()

    def get_by_ids(self, restaurant_id: int, oeffnungszeit_id: int, gueltig_von: date) -> Optional[RestaurantOeffnungszeit]:
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantid == restaurant_id,
            RestaurantOeffnungszeit.oeffnungszeitid == oeffnungszeit_id,
            RestaurantOeffnungszeit.gueltig_von == gueltig_von
        ).first()
    
    def get_by_restaurant_id(self, restaurant_id: int) -> list[type[RestaurantOeffnungszeit]]:
        """Get all opening hours assignments for a restaurant"""
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantid == restaurant_id
        ).all()

    def get_active_by_restaurant_id(self, restaurant_id: int):
        """Hole aktive Zuordnungen (zeitbasiert)"""
        today = date.today()
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantid == restaurant_id,
            RestaurantOeffnungszeit.gueltig_von <= today,
            (RestaurantOeffnungszeit.gueltig_bis.is_(None) |
             (RestaurantOeffnungszeit.gueltig_bis >= today))
        ).all()

    def get_current_for_restaurant(self, restaurant_id: int):
        """Hole aktuell gültige Zuordnung"""
        today = date.today()
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantid == restaurant_id,
            RestaurantOeffnungszeit.gueltig_von <= today,
            (RestaurantOeffnungszeit.gueltig_bis.is_(None) |
             (RestaurantOeffnungszeit.gueltig_bis >= today))
        ).first()

    def create(self, assignment_data: dict):
        try:
            new_assignment = RestaurantOeffnungszeit(**assignment_data)
            self.db.add(new_assignment)
            self.db.commit()
            self.db.refresh(new_assignment)
            return new_assignment
        except IntegrityError:
            self.db.rollback()
            # Existiert bereits - hole den vorhandenen Eintrag
            return self.db.query(RestaurantOeffnungszeit).filter(
                RestaurantOeffnungszeit.restaurantid == assignment_data['restaurantid'],
                RestaurantOeffnungszeit.oeffnungszeitid == assignment_data['oeffnungszeitid'],
                RestaurantOeffnungszeit.gueltig_von == assignment_data['gueltig_von']
            ).first()
    
    def update(self, restaurant_id: int, oeffnungszeit_id: int, gueltig_von: date, 
               update_data: dict) -> Optional[RestaurantOeffnungszeit]:
        assignment = self.get_by_ids(restaurant_id, oeffnungszeit_id, gueltig_von)
        if not assignment:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(assignment, key, value)
        
        self.db.commit()
        self.db.refresh(assignment)
        return assignment
    
    def delete(self, restaurant_id: int, oeffnungszeit_id: int, gueltig_von: date) -> bool:
        assignment = self.get_by_ids(restaurant_id, oeffnungszeit_id, gueltig_von)
        if not assignment:
            return False
        self.db.delete(assignment)
        self.db.commit()
        return True
    
    def deactivate(self, restaurant_id: int, oeffnungszeit_id: int, gueltig_von: date) -> Optional[RestaurantOeffnungszeit]:
        """Deactivate an opening hours assignment"""
        return self.update(restaurant_id, oeffnungszeit_id, gueltig_von, {"ist_aktiv": False})

    def get_profile_for_restaurant(self, restaurant_id: int) -> Optional[RestaurantOeffnungszeit]:
        return (
            self.db.query(RestaurantOeffnungszeit)
            .options(
                joinedload(RestaurantOeffnungszeit.vorlage)
                .joinedload(OeffnungszeitVorlage.details)
            )
            .filter(RestaurantOeffnungszeit.restaurantid == restaurant_id)
            .order_by(
                RestaurantOeffnungszeit.ist_aktiv.desc(),
                RestaurantOeffnungszeit.gueltig_von.desc()
            )
            .first()
        )

    def upsert_profile_for_restaurant(
        self,
        restaurant_id: int,
        assignment_data: dict,
        vorlage_data: dict
    ) -> RestaurantOeffnungszeit:
        oeffnungszeit_id = assignment_data.get("oeffnungszeitid")
        gueltig_von = assignment_data.get("gueltig_von") or date.today()

        assignment = None
        if oeffnungszeit_id:
            assignment = (
                self.db.query(RestaurantOeffnungszeit)
                .options(
                    joinedload(RestaurantOeffnungszeit.vorlage)
                    .joinedload(OeffnungszeitVorlage.details)
                )
                .filter(
                    RestaurantOeffnungszeit.restaurantid == restaurant_id,
                    RestaurantOeffnungszeit.oeffnungszeitid == oeffnungszeit_id,
                    RestaurantOeffnungszeit.gueltig_von == gueltig_von
                )
                .first()
            )

        vorlage = assignment.vorlage if assignment else None
        if not vorlage and oeffnungszeit_id:
            vorlage = (
                self.db.query(OeffnungszeitVorlage)
                .options(joinedload(OeffnungszeitVorlage.details))
                .filter(OeffnungszeitVorlage.oeffnungszeitid == oeffnungszeit_id)
                .first()
            )

        if not vorlage:
            vorlage = OeffnungszeitVorlage(
                bezeichnung=vorlage_data.get("bezeichnung") or "Standard Öffnungszeiten",
                beschreibung=vorlage_data.get("beschreibung")
            )
            self.db.add(vorlage)
            self.db.flush()
            oeffnungszeit_id = vorlage.oeffnungszeitid
        else:
            if "bezeichnung" in vorlage_data and vorlage_data["bezeichnung"] is not None:
                vorlage.bezeichnung = vorlage_data["bezeichnung"]
            if "beschreibung" in vorlage_data:
                vorlage.beschreibung = vorlage_data["beschreibung"]

        if not assignment:
            assignment = RestaurantOeffnungszeit(
                restaurantid=restaurant_id,
                oeffnungszeitid=oeffnungszeit_id,
                gueltig_von=gueltig_von
            )
            self.db.add(assignment)
        else:
            assignment.oeffnungszeitid = oeffnungszeit_id
            assignment.gueltig_von = gueltig_von

        if "gueltig_bis" in assignment_data:
            assignment.gueltig_bis = assignment_data["gueltig_bis"]
        if "ist_aktiv" in assignment_data and assignment_data["ist_aktiv"] is not None:
            assignment.ist_aktiv = assignment_data["ist_aktiv"]

        existing_details = {detail.detailid: detail for detail in vorlage.details}
        keep_ids = set()
        for detail_payload in vorlage_data.get("details", []):
            detail = None
            detail_id = detail_payload.get("detailid")
            if detail_id and detail_id in existing_details:
                detail = existing_details[detail_id]
            else:
                detail = OeffnungszeitDetail(oeffnungszeitid=vorlage.oeffnungszeitid)
                self.db.add(detail)
                vorlage.details.append(detail)

            for field in ("wochentag", "oeffnungszeit", "schliessungszeit", "ist_geschlossen"):
                if field in detail_payload:
                    setattr(detail, field, detail_payload[field])

            if detail.detailid:
                keep_ids.add(detail.detailid)

        for detail in list(vorlage.details):
            if detail.detailid and detail.detailid not in keep_ids:
                self.db.delete(detail)
                vorlage.details.remove(detail)

        self.db.commit()
        self.db.refresh(assignment)
        return assignment
