# services/restaurant_service.py
from sqlalchemy.orm import Session, joinedload
from models.restaurant import Restaurant
from models.menue import Menue
from models.gericht import Gericht
from models.preis import Preis
from models.adresse import Adresse
from models.kochstil import Kochstil
from models.kochstilrestaurant import KochstilRestaurant
from typing import List, Optional, Any
from services.adresse_service import AdresseService


class RestaurantService:
    def __init__(self, db: Session):
        self.db = db
        self.adresse_service = AdresseService(db)


    def get_all(self) -> list[type[Restaurant]]:
        """Get all restaurants WITH address and kochstil"""
        return self.db.query(Restaurant).options(
            joinedload(Restaurant.adresse),
            joinedload(Restaurant.kochstil)
            .joinedload(KochstilRestaurant.kochstil)
        ).all()

    def get_by_id(self, restaurant_id: int) -> Optional[Restaurant]:
        """Get restaurant by ID WITHOUT relationships (basic data only)"""
        return self.db.query(Restaurant).filter(
            Restaurant.restaurantid == restaurant_id
        ).first()

    def get_by_id_with_menu(self, restaurant_id: int) -> Optional[Restaurant]:
        """
        Get restaurant WITH all relationships:
        - Adresse (Adresse des Restaurants)
        - Kochstil (Kochstile des Restaurants)
        - Menue (Menüs)
        - Gericht (Gerichte in jedem Menü)
        - Preis (Preise für jedes Gericht)
        """
        return self.db.query(Restaurant).options(
            joinedload(Restaurant.adresse),
            joinedload(Restaurant.kochstil)
            .joinedload(KochstilRestaurant.kochstil),
            joinedload(Restaurant.menue)
            .joinedload(Menue.gericht)
            .joinedload(Gericht.preis)
        ).filter(
            Restaurant.restaurantid == restaurant_id
        ).first()

    def get_by_name(self, name: str) -> List[Restaurant]:
        return self.db.query(Restaurant).filter(
            Restaurant.name.ilike(f"%{name}%")
        ).all()

    def get_by_klassifizierung(self, klassifizierung: str) -> List[Restaurant]:
        return self.db.query(Restaurant).filter(
            Restaurant.klassifizierung == klassifizierung
        ).all()

    def create(self, restaurant_data: dict) -> Restaurant:
        restaurant = Restaurant(**restaurant_data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def update(self, restaurant_id: int, update_data: dict):
        restaurant = self.get_by_id(restaurant_id)
        if not restaurant:
            return None

        # Trenne Adress- von Restaurant-Feldern
        adress_fields = ['straße', 'hausnummer', 'postleitzahl', 'ort', 'land']
        adress_data = {k: v for k, v in update_data.items() if k in adress_fields}
        restaurant_data = {k: v for k, v in update_data.items() if k not in adress_fields}

        # Prüfe was geschickt wurde
        has_adress_id = 'adresseid' in restaurant_data
        has_adress_data = bool(adress_data)

        if has_adress_id and has_adress_data:
            raise ValueError("Sende entweder adresseid ODER Adress-Daten!")

        elif has_adress_data and restaurant.adresseid:
            # Smart Adress-Update
            updated_adresse = self.adresse_service.update(
                restaurant.adresseid,
                adress_data
            )
            restaurant.adresseid = updated_adresse.adresseid

        elif has_adress_id:
            # Direkt setzen
            restaurant.adresseid = restaurant_data['adresseid']
            restaurant_data.pop('adresseid')

        # Restaurant-Update
        for key, value in restaurant_data.items():
            if value is not None and hasattr(restaurant, key):
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