from sqlalchemy.orm import Session
from models.user import User
from core.security import get_password_hash, verify_password
from typing import Optional, List

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[User]:
        """Alle Users abrufen"""
        return self.db.query(User).all()
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """User nach ID suchen"""
        return self.db.query(User).filter(User.userid == user_id).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """User nach E-Mail suchen"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, username: str) -> Optional[User]:
        """User nach Username suchen"""
        return self.db.query(User).filter(User.username == username).first()
    
    def get_by_username_or_email(self, identifier: str) -> Optional[User]:
        """User nach Username ODER E-Mail suchen"""
        return self.db.query(User).filter(
            (User.username == identifier) | (User.email == identifier)
        ).first()
    
    def create(self, user_data: dict) -> User:
        """
        Neuen User erstellen
        
        Args:
            user_data: Dictionary mit User-Daten (inkl. password)
        
        Returns:
            Erstellter User
        """
        # Passwort hashen
        password = user_data.pop('password')
        hashed_password = get_password_hash(password)
        
        # User erstellen
        user = User(
            **user_data,
            hashed_password=hashed_password
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def update(self, user_id: int, update_data: dict) -> Optional[User]:
        """
        User aktualisieren
        
        Args:
            user_id: ID des Users
            update_data: Dictionary mit zu aktualisierenden Daten
        
        Returns:
            Aktualisierter User oder None
        """
        user = self.get_by_id(user_id)
        if not user:
            return None
        
        # Passwort speziell behandeln
        if 'password' in update_data and update_data['password']:
            update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
        
        # Felder aktualisieren
        for key, value in update_data.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def delete(self, user_id: int) -> bool:
        """User löschen"""
        user = self.get_by_id(user_id)
        if not user:
            return False
        
        self.db.delete(user)
        self.db.commit()
        return True
    
    def authenticate(self, username_or_email: str, password: str) -> Optional[User]:
        """
        User authentifizieren
        
        Args:
            username_or_email: Username oder E-Mail
            password: Klartext-Passwort
        
        Returns:
            User wenn Authentifizierung erfolgreich, sonst None
        """
        user = self.get_by_username_or_email(username_or_email)
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    def check_email_exists(self, email: str) -> bool:
        """Prüft ob E-Mail bereits existiert"""
        return self.get_by_email(email) is not None
    
    def check_username_exists(self, username: str) -> bool:
        """Prüft ob Username bereits existiert"""
        return self.get_by_username(username) is not None
