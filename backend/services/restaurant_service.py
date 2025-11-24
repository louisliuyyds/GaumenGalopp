from sqlalchemy.orm import Session
from models.restaurant import Restaurant
from typing import List, Optional

class RestaurantService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Restaurant]:
        return self.db.query(Restaurant).all()
    
    def get_by_id(self, restaurant_id: int) -> Optional[Restaurant]:
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()
    
    def get_by_name(self, name: str) -> List[Restaurant]:
        return self.db.query(Restaurant).filter(Restaurant.name.ilike(f"%{name}%")).all()
    
    def get_by_klassifizierung(self, klassifizierung: str) -> List[Restaurant]:
        return self.db.query(Restaurant).filter(Restaurant.klassifizierung == klassifizierung).all()
    
    def create(self, restaurant_data: dict) -> Restaurant:
        restaurant = Restaurant(**restaurant_data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant
    
    def update(self, restaurant_id: int, update_data: dict) -> Optional[Restaurant]:
        restaurant = self.get_by_id(restaurant_id)
        if not restaurant:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(restaurant, key, value)
        
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant
    
    def delete(self, restaurant_id: int) -> bool:
        restaurant = self.get_by_id(restaurant_id)
        if not restaurant:
            return False
        self.db.delete(restaurant)
        self.db.commit()
        return True
    
    def get_with_menue(self, restaurant_id: int) -> Optional[Restaurant]:
        """Get restaurant with its menu"""
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()