from sqlalchemy.orm import Session, joinedload, with_loader_criteria
from models.restaurant import Restaurant
from models.menue import Menue
from models.gericht import Gericht
from models.preis import Preis
from models.adresse import Adresse
from models.kochstil import Kochstil
from models.kochstilrestaurant import KochstilRestaurant
from typing import List, Optional, Any
from services.adresse_service import AdresseService
from core.security import get_password_hash, verify_password


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
        """Restaurant nach ID suchen"""
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()

    def get_profile(self, restaurant_id: int) -> Optional[Restaurant]:
        return (
            self.db.query(Restaurant)
            .options(joinedload(Restaurant.adresse))
            .filter(Restaurant.restaurantid == restaurant_id)
            .first()
        )
    
    def get_by_name(self, name: str) -> list[type[Restaurant]]:
        return self.db.query(Restaurant).filter(Restaurant.name.ilike(f"%{name}%")).all()

    def get_by_klassifizierung(self, klassifizierung: str) -> List[Restaurant]:
        """Restaurants nach Klassifizierung filtern"""
        return self.db.query(Restaurant).filter(Restaurant.klassifizierung == klassifizierung).all()
    
        """Get restaurant by ID WITHOUT relationships (basic data only)"""
        return self.db.query(Restaurant).filter(
            Restaurant.restaurantid == restaurant_id
        ).first()

    def get_by_id_with_menu(self, restaurant_id: int) -> Optional[Restaurant]:
        return (
            self.db.query(Restaurant)
            .options(
                joinedload(Restaurant.adresse),
                joinedload(Restaurant.kochstil)
                .joinedload(KochstilRestaurant.kochstil),

                joinedload(Restaurant.menue)
                .joinedload(Menue.gericht)
                .joinedload(Gericht.preis),

                #NUR aktive Gerichte laden (wirkt auch für joinedload)
                with_loader_criteria(
                    Gericht,
                    Gericht.ist_aktiv.is_(True),
                    include_aliases=True
                )
            )
            .filter(Restaurant.restaurantid == restaurant_id)
            .first()
        )
      
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

        """Get restaurant with its menu"""
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()

    def update_profile(self, restaurant_id: int, restaurant_data: dict, adresse_data: Optional[dict]) -> Optional[Restaurant]:
        restaurant = self.get_profile(restaurant_id)
        if not restaurant:
            return None

        for key, value in restaurant_data.items():
            if value is not None and hasattr(restaurant, key):
                setattr(restaurant, key, value)

        if adresse_data:
            adresse = restaurant.adresse
            if not adresse:
                adresse = Adresse(**adresse_data)
                self.db.add(adresse)
                self.db.flush()
                restaurant.adresseid = adresse.adresseid
                restaurant.adresse = adresse
            else:
                for key, value in adresse_data.items():
                    if value is not None:
                        setattr(adresse, key, value)

        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant
