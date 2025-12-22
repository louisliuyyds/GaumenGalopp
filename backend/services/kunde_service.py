from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.kunde import Kunde
from utils.auth import get_password_hash, verify_password


class KundeService:
    def __init__(self, db: Session):
        self.db = db

# wenn wir eine Detailed Ansicht von den Kunden haben im Frontend (z.B. im Profil)
# wäre es sinnvoll hier einen JoinedLoad zu machen
    def get_all(self) -> List[Kunde]:
        """Hole alle Kunden mit ihren Adressen"""
        return self.db.query(Kunde).all()

    def get_by_id(self, kunden_id: int) -> Optional[Kunde]:
        """Hole einen Kunden mit seiner Adresse"""
        return self.db.query(Kunde) \
            .options(joinedload(Kunde.adresse)) \
            .filter(Kunde.kundenid == kunden_id) \
            .first()

    def create(self, kunde_data: dict) -> Kunde:
        kunde = Kunde(**kunde_data)
        self.db.add(kunde)
        self.db.commit()
        self.db.refresh(kunde)
        return kunde

    def update(self, kunden_id: int, update_data: dict) -> Optional[Kunde]:
        kunde = self.get_by_id(kunden_id)
        if not kunde:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(kunde, key, value)

        self.db.commit()
        self.db.refresh(kunde)
        return kunde

    def delete(self, kunden_id: int) -> bool:
        """Hard delete - für Studienprojekt OK"""
        kunde = self.get_by_id(kunden_id)
        if not kunde:
            return False

        self.db.delete(kunde)
        self.db.commit()
        return True

    # ===== AUTH METHODEN =====

    def get_by_email(self, email: str) -> Optional[Kunde]:
        """Kunde nach E-Mail suchen (für Auth)"""
        return self.db.query(Kunde).filter(Kunde.email == email).first()

    def create_with_password(self, kunde_data: dict) -> Kunde:
        """
        Kunde mit gehashtem Passwort erstellen (für Registrierung)

        Args:
            kunde_data: Dictionary mit Kundendaten inkl. 'password'

        Returns:
            Erstellter Kunde
        """
        # Passwort extrahieren und hashen
        password = kunde_data.pop('password')
        kunde_data['passwordhash'] = get_password_hash(password)

        # Kunde erstellen
        kunde = Kunde(**kunde_data)
        self.db.add(kunde)
        self.db.commit()
        self.db.refresh(kunde)

        return kunde

    def authenticate(self, email: str, password: str) -> Optional[Kunde]:
        """
        Kunde authentifizieren (für Login)

        Args:
            email: E-Mail-Adresse des Kunden
            password: Klartext-Passwort

        Returns:
            Kunde-Objekt wenn Authentifizierung erfolgreich, sonst None
        """
        kunde = self.get_by_email(email)

        if not kunde:
            return None

        if not verify_password(password, kunde.passwordhash):
            return None

        return kunde

    def check_email_exists(self, email: str) -> bool:
        """Prüft ob E-Mail bereits existiert"""
        return self.get_by_email(email) is not None

    def update_password(self, kunden_id: int, new_password: str) -> Optional[Kunde]:
        """
        Passwort eines Kunden ändern

        Args:
            kunden_id: ID des Kunden
            new_password: Neues Klartext-Passwort

        Returns:
            Aktualisierter Kunde oder None
        """
        kunde = self.get_by_id(kunden_id)
        if not kunde:
            return None

        kunde.passwordhash = get_password_hash(new_password)
        self.db.commit()
        self.db.refresh(kunde)

        return kunde