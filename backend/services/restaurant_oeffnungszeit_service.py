# services/restaurant_oeffnungszeit_service.py
from sqlalchemy.orm import Session
from models.restaurant_oeffnungszeit import RestaurantOeffnungszeit
from typing import List, Optional
from datetime import date


class RestaurantOeffnungszeitService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[RestaurantOeffnungszeit]:
        return self.db.query(RestaurantOeffnungszeit).all()
    
    def get_by_ids(self, restaurant_id: int, oeffnungszeit_id: int, gueltig_von: date) -> Optional[RestaurantOeffnungszeit]:
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantID == restaurant_id,
            RestaurantOeffnungszeit.oeffnungszeitID == oeffnungszeit_id,
            RestaurantOeffnungszeit.gueltig_von == gueltig_von
        ).first()
    
    def get_by_restaurant_id(self, restaurant_id: int) -> List[RestaurantOeffnungszeit]:
        """Get all opening hours assignments for a restaurant"""
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantID == restaurant_id
        ).all()
    
    def get_active_by_restaurant_id(self, restaurant_id: int) -> List[RestaurantOeffnungszeit]:
        """Get active opening hours for a restaurant"""
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantID == restaurant_id,
            RestaurantOeffnungszeit.ist_aktiv == True
        ).all()
    
    def get_current_for_restaurant(self, restaurant_id: int, current_date: date = None) -> Optional[RestaurantOeffnungszeit]:
        """Get currently valid opening hours for a restaurant"""
        if current_date is None:
            current_date = date.today()
        
        return self.db.query(RestaurantOeffnungszeit).filter(
            RestaurantOeffnungszeit.restaurantID == restaurant_id,
            RestaurantOeffnungszeit.ist_aktiv == True,
            RestaurantOeffnungszeit.gueltig_von <= current_date,
            (RestaurantOeffnungszeit.gueltig_bis >= current_date) | 
            (RestaurantOeffnungszeit.gueltig_bis == None)
        ).first()
    
    def create(self, assignment_data: dict) -> RestaurantOeffnungszeit:
        assignment = RestaurantOeffnungszeit(**assignment_data)
        self.db.add(assignment)
        self.db.commit()
        self.db.refresh(assignment)
        return assignment
    
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