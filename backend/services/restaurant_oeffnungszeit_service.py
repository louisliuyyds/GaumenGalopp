from sqlalchemy.orm import Session
from models.restaurant_oeffnungszeit import RestaurantOeffnungszeit
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