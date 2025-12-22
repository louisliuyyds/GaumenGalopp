from sqlalchemy.orm import Session
from typing import List, Optional
from models.restaurant import Restaurant
from core.security import get_password_hash, verify_password


class RestaurantService:
    def __init__(self, db: Session):
        self.db = db

    # ===== BASIC CRUD METHODEN =====

    def get_all(self) -> List[Restaurant]:
        """Hole alle Restaurants"""
        return self.db.query(Restaurant).all()

    def get_by_id(self, restaurant_id: int) -> Optional[Restaurant]:
        """Restaurant nach ID suchen"""
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()

    def get_by_name(self, name: str) -> List[Restaurant]:
        """Restaurants nach Name suchen (case-insensitive, partial match)"""
        return self.db.query(Restaurant).filter(Restaurant.name.ilike(f"%{name}%")).all()

    def get_by_klassifizierung(self, klassifizierung: str) -> List[Restaurant]:
        """Restaurants nach Klassifizierung filtern"""
        return self.db.query(Restaurant).filter(Restaurant.klassifizierung == klassifizierung).all()

    def create(self, restaurant_data: dict) -> Restaurant:
        """
        Restaurant erstellen (ohne Passwort-Hashing)
        Für normale CRUD Operationen
        """
        restaurant = Restaurant(**restaurant_data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def update(self, restaurant_id: int, update_data: dict) -> Optional[Restaurant]:
        """Restaurant aktualisieren"""
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
        """Restaurant löschen"""
        restaurant = self.get_by_id(restaurant_id)
        if not restaurant:
            return False

        self.db.delete(restaurant)
        self.db.commit()
        return True

    def get_with_menue(self, restaurant_id: int) -> Optional[Restaurant]:
        """Restaurant mit Menü laden"""
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()

    # ===== AUTH METHODEN =====

    def get_by_email(self, email: str) -> Optional[Restaurant]:
        """
        Restaurant nach E-Mail suchen (für Auth)

        Args:
            email: E-Mail-Adresse des Restaurants

        Returns:
            Restaurant-Objekt oder None
        """
        return self.db.query(Restaurant).filter(Restaurant.email == email).first()

    def create_with_password(self, restaurant_data: dict) -> Restaurant:
        """
        Restaurant mit gehashtem Passwort erstellen (für Registrierung)

        Args:
            restaurant_data: Dictionary mit Restaurant-Daten inkl. 'password'

        Returns:
            Erstelltes Restaurant
        """
        # Passwort extrahieren und hashen
        password = restaurant_data.pop('password')
        restaurant_data['passwordhash'] = get_password_hash(password)

        # Restaurant erstellen
        restaurant = Restaurant(**restaurant_data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)

        return restaurant

    def authenticate(self, email: str, password: str) -> Optional[Restaurant]:
        """
        Restaurant authentifizieren (für Login)

        Args:
            email: E-Mail-Adresse des Restaurants
            password: Klartext-Passwort

        Returns:
            Restaurant-Objekt wenn Authentifizierung erfolgreich, sonst None
        """
        restaurant = self.get_by_email(email)

        if not restaurant:
            return None

        if not verify_password(password, restaurant.passwordhash):
            return None

        return restaurant

    def check_email_exists(self, email: str) -> bool:
        """
        Prüft ob E-Mail bereits existiert

        Args:
            email: E-Mail-Adresse

        Returns:
            True wenn E-Mail existiert, False wenn nicht
        """
        return self.get_by_email(email) is not None

    def update_password(self, restaurant_id: int, new_password: str) -> Optional[Restaurant]:
        """
        Passwort eines Restaurants ändern

        Args:
            restaurant_id: ID des Restaurants
            new_password: Neues Klartext-Passwort

        Returns:
            Aktualisiertes Restaurant oder None
        """
        restaurant = self.get_by_id(restaurant_id)
        if not restaurant:
            return None

        restaurant.passwordhash = get_password_hash(new_password)
        self.db.commit()
        self.db.refresh(restaurant)

        return restaurant
