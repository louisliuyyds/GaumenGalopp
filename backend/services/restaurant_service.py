from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from typing import Optional, List
from models.restaurant import Restaurant
from models.menue import Menue
from models.gericht import Gericht
from models.bewertung import Bewertung
from models.bewertungkritiker import Bewertungkritiker
from services.adresse_service import AdresseService


class RestaurantService:
    def __init__(self, db: Session):
        self.db = db
        self.adresse_service = AdresseService(db)

    def get_all(self) -> list[Restaurant]:
        """Alle Restaurants abrufen"""
        return self.db.query(Restaurant).all()

    def get_by_id(self, restaurant_id: int) -> Optional[Restaurant]:
        """Restaurant nach ID abrufen"""
        return self.db.query(Restaurant).filter(Restaurant.restaurantid == restaurant_id).first()

    def get_by_id_with_menu(self, restaurant_id: int) -> Optional[Restaurant]:
        """Restaurant mit komplettem Menü und Preisen laden"""
        return (
            self.db.query(Restaurant)
            .options(
                joinedload(Restaurant.adresse),
                joinedload(Restaurant.kochstil),
                joinedload(Restaurant.menue).joinedload(Menue.gericht)
            )
            .filter(Restaurant.restaurantid == restaurant_id)
            .first()
        )

    def create(self, restaurant_data: dict) -> Restaurant:
        """Restaurant erstellen"""
        restaurant = Restaurant(**restaurant_data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def update(self, restaurant_id: int, update_data: dict):
        """Restaurant aktualisieren"""
        restaurant = self.get_by_id(restaurant_id)
        if not restaurant:
            return None

        adress_fields = ['straße', 'hausnummer', 'postleitzahl', 'ort', 'land']
        adress_data = {k: v for k, v in update_data.items() if k in adress_fields}
        restaurant_data = {k: v for k, v in update_data.items() if k not in adress_fields}

        has_adress_id = 'adresseid' in restaurant_data
        has_adress_data = bool(adress_data)

        if has_adress_id and has_adress_data:
            raise ValueError("Sende entweder adresseid ODER Adress-Daten!")

        if has_adress_data and not restaurant.adresseid:
            new_adresse = self.adresse_service.create(adress_data)
            restaurant.adresseid = new_adresse.adresseid

        elif has_adress_data and restaurant.adresseid:
            updated_adresse = self.adresse_service.update(restaurant.adresseid, adress_data)
            restaurant.adresseid = updated_adresse.adresseid

        elif has_adress_id:
            restaurant.adresseid = restaurant_data['adresseid']
            restaurant_data.pop('adresseid')

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

    def get_profile(self, restaurant_id: int) -> Optional[Restaurant]:
        """Restaurant-Profil mit Adresse laden"""
        return (
            self.db.query(Restaurant)
            .options(joinedload(Restaurant.adresse))
            .filter(Restaurant.restaurantid == restaurant_id)
            .first()
        )

    def update_profile(self, restaurant_id: int, restaurant_data: dict, adresse_data: Optional[dict]):
        """Restaurant-Profil mit Adresse aktualisieren"""
        restaurant = self.get_profile(restaurant_id)
        if not restaurant:
            return None

        for key, value in restaurant_data.items():
            if value is not None and hasattr(restaurant, key):
                setattr(restaurant, key, value)

        if adresse_data and restaurant.adresseid:
            self.adresse_service.update(restaurant.adresseid, adresse_data)

        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def get_by_email(self, email: str) -> Optional[Restaurant]:
        """Restaurant nach E-Mail suchen (für Auth)"""
        return self.db.query(Restaurant).filter(Restaurant.email == email).first()

    def create_with_password(self, restaurant_data: dict) -> Restaurant:
        """Restaurant mit gehashtem Passwort erstellen (für Registrierung)"""
        restaurant = Restaurant(**restaurant_data)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant


    # ===== NEUE BEWERTUNGS-METHODEN =====

    def get_restaurant_bewertungen_aggregiert(self, restaurant_id: int) -> dict:
        """
        Aggregierte Bewertungen für ein Restaurant
        Kombiniert Kunden- und Kritiker-Bewertungen
        """
        # 1. Hole alle Gerichte des Restaurants
        gericht_ids = (
            self.db.query(Gericht.gerichtid)
            .join(Menue, Gericht.menuid == Menue.menuid)
            .filter(Menue.restaurantid == restaurant_id)
            .filter(Gericht.ist_aktiv == True)
            .all()
        )
        gericht_ids = [g[0] for g in gericht_ids]

        if not gericht_ids:
            return {
                "durchschnitt_gesamt": 0.0,
                "anzahl_gesamt": 0,
                "anzahl_kunden": 0,
                "anzahl_kritiker": 0,
                "durchschnitt_kunden": None,
                "durchschnitt_kritiker": None
            }

        # 2. Kunden-Bewertungen aggregieren
        kunden_stats = (
            self.db.query(
                func.avg(Bewertung.rating).label('durchschnitt'),
                func.count(Bewertung.bewertungid).label('anzahl')
            )
            .filter(Bewertung.gerichtid.in_(gericht_ids))
            .first()
        )

        # 3. Kritiker-Bewertungen aggregieren
        kritiker_stats = (
            self.db.query(
                func.avg(Bewertungkritiker.rating).label('durchschnitt'),
                func.count(Bewertungkritiker.bewertungkritikerid).label('anzahl')
            )
            .filter(Bewertungkritiker.gerichtid.in_(gericht_ids))
            .first()
        )

        anzahl_kunden = kunden_stats.anzahl or 0
        anzahl_kritiker = kritiker_stats.anzahl or 0
        durchschnitt_kunden = float(kunden_stats.durchschnitt) if kunden_stats.durchschnitt else None
        durchschnitt_kritiker = float(kritiker_stats.durchschnitt) if kritiker_stats.durchschnitt else None

        # 4. Gesamt-Durchschnitt berechnen
        alle_ratings = []
        if durchschnitt_kunden:
            alle_ratings.extend([durchschnitt_kunden] * anzahl_kunden)
        if durchschnitt_kritiker:
            alle_ratings.extend([durchschnitt_kritiker] * anzahl_kritiker)

        durchschnitt_gesamt = sum(alle_ratings) / len(alle_ratings) if alle_ratings else 0.0

        return {
            "durchschnitt_gesamt": round(durchschnitt_gesamt, 2),
            "anzahl_gesamt": anzahl_kunden + anzahl_kritiker,
            "anzahl_kunden": anzahl_kunden,
            "anzahl_kritiker": anzahl_kritiker,
            "durchschnitt_kunden": round(durchschnitt_kunden, 2) if durchschnitt_kunden else None,
            "durchschnitt_kritiker": round(durchschnitt_kritiker, 2) if durchschnitt_kritiker else None
        }


    def get_kritiker_highlights(self, restaurant_id: int, limit: int = 5) -> List[dict]:
        """
        Top Gerichte mit höchsten Kritiker-Bewertungen (mind. 4 Sterne)
        """
        results = (
            self.db.query(
                Gericht.gerichtid,
                Gericht.name,
                Gericht.beschreibung,
                Gericht.kategorie,
                func.avg(Bewertungkritiker.rating).label('durchschnitt'),
                func.count(Bewertungkritiker.bewertungkritikerid).label('anzahl')
            )
            .join(Menue, Gericht.menuid == Menue.menuid)
            .join(Bewertungkritiker, Bewertungkritiker.gerichtid == Gericht.gerichtid)
            .filter(Menue.restaurantid == restaurant_id)
            .filter(Gericht.ist_aktiv == True)
            .group_by(Gericht.gerichtid, Gericht.name, Gericht.beschreibung, Gericht.kategorie)
            .having(func.avg(Bewertungkritiker.rating) >= 4.0)
            .order_by(func.avg(Bewertungkritiker.rating).desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "gerichtid": r.gerichtid,
                "name": r.name,
                "beschreibung": r.beschreibung,
                "kategorie": r.kategorie,
                "durchschnitt": round(float(r.durchschnitt), 2),
                "anzahl_bewertungen": r.anzahl
            }
            for r in results
        ]


    def get_customer_favorites(self, restaurant_id: int, limit: int = 5) -> List[dict]:
        """
        Top Gerichte mit höchsten Kunden-Bewertungen inkl. Kommentar-Samples (mind. 4 Sterne)
        """
        # Top-Gerichte ermitteln
        results = (
            self.db.query(
                Gericht.gerichtid,
                Gericht.name,
                Gericht.beschreibung,
                Gericht.kategorie,
                func.avg(Bewertung.rating).label('durchschnitt'),
                func.count(Bewertung.bewertungid).label('anzahl')
            )
            .join(Menue, Gericht.menuid == Menue.menuid)
            .join(Bewertung, Bewertung.gerichtid == Gericht.gerichtid)
            .filter(Menue.restaurantid == restaurant_id)
            .filter(Gericht.ist_aktiv == True)
            .group_by(Gericht.gerichtid, Gericht.name, Gericht.beschreibung, Gericht.kategorie)
            .having(func.avg(Bewertung.rating) >= 4.0)
            .order_by(func.avg(Bewertung.rating).desc())
            .limit(limit)
            .all()
        )

        favorites = []
        for r in results:
            # Hole 2-3 Beispiel-Kommentare für dieses Gericht
            kommentare = (
                self.db.query(Bewertung.kommentar)
                .filter(Bewertung.gerichtid == r.gerichtid)
                .filter(Bewertung.kommentar.isnot(None))
                .filter(Bewertung.kommentar != '')
                .order_by(Bewertung.rating.desc())
                .limit(3)
                .all()
            )

            favorites.append({
                "gerichtid": r.gerichtid,
                "name": r.name,
                "beschreibung": r.beschreibung,
                "kategorie": r.kategorie,
                "durchschnitt_kunden": round(float(r.durchschnitt), 2),
                "anzahl_bewertungen": r.anzahl,
                "beispiel_kommentare": [k[0] for k in kommentare]
            })

        return favorites