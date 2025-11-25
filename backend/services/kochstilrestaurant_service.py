from sqlalchemy.orm import Session
from typing import List, Optional
from models.kochstilrestaurant import KochstilRestaurant

class KochstilRestaurantService:
    """Service für Many-to-Many Beziehung zwischen Kochstil und Restaurant"""

    def __init__(self, db: Session):
        self.db = db

    def assign_kochstil_to_restaurant(self, restaurant_id: int, stil_id: int) -> KochstilRestaurant:
        """Weise einem Restaurant einen Kochstil zu"""
        # Prüfe, ob Zuordnung bereits existiert
        existing = self.db.query(KochstilRestaurant) \
            .filter(KochstilRestaurant.restaurantid == restaurant_id,
                    KochstilRestaurant.stilid == stil_id) \
            .first()

        if existing:
            return existing

        kochstil_restaurant = KochstilRestaurant(
            restaurantid=restaurant_id,
            stilid=stil_id
        )
        self.db.add(kochstil_restaurant)
        self.db.commit()
        self.db.refresh(kochstil_restaurant)
        return kochstil_restaurant

    def remove_kochstil_from_restaurant(self, restaurant_id: int, stil_id: int) -> bool:
        """Entferne Kochstil von Restaurant"""
        kochstil_restaurant = self.db.query(KochstilRestaurant) \
            .filter(KochstilRestaurant.restaurantid == restaurant_id,
                    KochstilRestaurant.stilid == stil_id) \
            .first()

        if not kochstil_restaurant:
            return False

        self.db.delete(kochstil_restaurant)
        self.db.commit()
        return True

    def get_kochstil_by_restaurant(self, restaurant_id: int) -> List[KochstilRestaurant]:
        """Hole alle Kochstile eines Restaurants"""
        return self.db.query(KochstilRestaurant) \
            .filter(KochstilRestaurant.restaurantid == restaurant_id) \
            .all()

    def get_restaurants_by_kochstil(self, stil_id: int) -> List[KochstilRestaurant]:
        """Hole alle Restaurants eines Kochstils"""
        return self.db.query(KochstilRestaurant) \
            .filter(KochstilRestaurant.stilid == stil_id) \
            .all()
    def get_all(self) -> List[KochstilRestaurant]:
        """Hole alle Verknüpfungen (für die Übersicht)"""
        return self.db.query(KochstilRestaurant).all()