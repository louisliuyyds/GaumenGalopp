from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from core.security import verify_password, create_access_token, get_password_hash
from models.kunde import Kunde
from models.restaurant import Restaurant
from models.kritiker import Kritiker
from models.adresse import Adresse


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(
            self,
            vorname: str,
            nachname: str,
            email: str,
            password: str,
            strasse: str,
            hausnummer: str,
            plz: str,
            stadt: str,
            land: str = "Deutschland",
            telefonnummer: str = None,
            geburtsdatum = None,
            namenskuerzel: str = None
    ) -> Kunde:
        """
        Registriert einen neuen Kunden mit automatischer Adress-Erstellung

        Args:
            vorname: Vorname des Kunden
            nachname: Nachname des Kunden
            email: E-Mail-Adresse
            password: Klartext-Passwort
            strasse, hausnummer, plz, stadt, land: Adressangaben
            telefonnummer: Optional - Telefonnummer
            geburtsdatum: Optional - Geburtsdatum
            namenskuerzel: Optional - Namenskürzel

        Returns:
            Erstellter Kunde

        Raises:
            HTTPException: Wenn E-Mail bereits existiert
        """
        # Prüfen ob E-Mail bereits existiert
        existing_kunde = self.db.query(Kunde).filter(Kunde.email == email).first()
        if existing_kunde:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # 1. Adresse erstellen (DB-Spaltennamen verwenden)
        adresse = Adresse(
            straße=strasse,        # DB: straße (mit ß)
            hausnummer=hausnummer,
            postleitzahl=plz,      # DB: postleitzahl
            ort=stadt,             # DB: ort
            land=land
        )
        self.db.add(adresse)
        self.db.flush()  # Damit adresseid verfügbar wird

        # 2. Passwort hashen
        passwordhash = get_password_hash(password)

        # 3. Kunde mit Adresse erstellen
        kunde = Kunde(
            vorname=vorname,
            nachname=nachname,
            email=email,
            passwordhash=passwordhash,
            adressid=adresse.adresseid,
            telefonnummer=telefonnummer,
            geburtsdatum=geburtsdatum,
            namenskuerzel=namenskuerzel,
            is_active=True,
            is_admin=False
        )

        self.db.add(kunde)
        self.db.commit()
        self.db.refresh(kunde)

        return kunde

    def register_restaurant(
            self,
            name: str,
            email: str,
            password: str,
            strasse: str,
            hausnummer: str,
            plz: str,
            stadt: str,
            land: str = "Deutschland",
            telefon: str = None,
            klassifizierung: str = None,
            kuechenchef: str = None
    ) -> Restaurant:
        """
        Registriert ein neues Restaurant mit automatischer Adress-Erstellung

        Args:
            name: Name des Restaurants
            email: E-Mail-Adresse
            password: Klartext-Passwort
            strasse, hausnummer, plz, stadt, land: Adressangaben
            telefon: Optional - Telefonnummer
            klassifizierung: Optional - Klassifizierung
            kuechenchef: Optional - Name des Küchenchefs

        Returns:
            Erstelltes Restaurant

        Raises:
            HTTPException: Wenn E-Mail bereits existiert
        """
        # Prüfen ob E-Mail bereits existiert
        existing_restaurant = self.db.query(Restaurant).filter(Restaurant.email == email).first()
        if existing_restaurant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # 1. Adresse erstellen (DB-Spaltennamen verwenden)
        adresse = Adresse(
            straße=strasse,        # DB: straße (mit ß)
            hausnummer=hausnummer,
            postleitzahl=plz,      # DB: postleitzahl
            ort=stadt,             # DB: ort
            land=land
        )
        self.db.add(adresse)
        self.db.flush()

        # 2. Passwort hashen
        passwordhash = get_password_hash(password)

        # 3. Restaurant mit Adresse erstellen
        restaurant = Restaurant(
            name=name,
            email=email,
            passwordhash=passwordhash,
            adresseid=adresse.adresseid,
            telefon=telefon,
            klassifizierung=klassifizierung,
            kuechenchef=kuechenchef
        )

        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)

        return restaurant

    def login(self, login_type: str, email: str, password: str) -> dict:
        """
        Login für Kunde oder Restaurant

        Args:
            login_type: "kunde" oder "restaurant"
            email: E-Mail-Adresse
            password: Klartext-Passwort

        Returns:
            Dictionary mit access_token, role, user_id, user_type

        Raises:
            HTTPException: Bei ungültigen Credentials oder unbekanntem login_type
        """
        email_norm = email.lower().strip()

        if login_type == "kunde":
            kunde = (
                self.db.query(Kunde)
                .filter(Kunde.email.ilike(email_norm))
                .first()
            )
            if not kunde or not kunde.passwordhash:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            if not verify_password(password, kunde.passwordhash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            # Prüfen ob Kunde auch Kritiker ist
            is_kritiker = self.db.query(Kritiker).filter(Kritiker.kundenid == kunde.kundenid).first() is not None
            role = "kritiker" if is_kritiker else "kunde"

            # Token erstellen
            token = create_access_token({
                "sub": str(kunde.kundenid),
                "type": "kunde",
                "role": role,
                "email": kunde.email
            })

            return {
                "access_token": token,
                "role": role,
                "user_id": kunde.kundenid,
                "user_type": "kunde",
                "token_type": "bearer"
            }

        elif login_type == "restaurant":
            restaurant = (
                self.db.query(Restaurant)
                .filter(Restaurant.email.ilike(email_norm))
                .first()
            )
            if not restaurant or not restaurant.passwordhash:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            if not verify_password(password, restaurant.passwordhash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            # Token erstellen
            token = create_access_token({
                "sub": str(restaurant.restaurantid),
                "type": "restaurant",
                "role": "restaurant",
                "email": restaurant.email
            })

            return {
                "access_token": token,
                "role": "restaurant",
                "user_id": restaurant.restaurantid,
                "user_type": "restaurant",
                "token_type": "bearer"
            }

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid login type. Must be 'kunde' or 'restaurant'"
            )