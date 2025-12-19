from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from core.security import verify_password, create_access_token
from models.kunde import Kunde
from models.restaurant import Restaurant
from models.kritiker import Kritiker

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def login(self, login_type: str, email: str, password: str) -> dict:
        email_norm = email.lower().strip()

        if login_type == "kunde":
            kunde = (
                self.db.query(Kunde)
                .filter(Kunde.email.ilike(email_norm))  # case-insensitive
                .first()
            )
            if not kunde or not kunde.passwordhash:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

            if not verify_password(password, kunde.passwordhash):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

            is_kritiker = self.db.query(Kritiker).filter(Kritiker.kundenid == kunde.kundenid).first() is not None
            role = "kritiker" if is_kritiker else "kunde"

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
            }

        if login_type == "restaurant":
            r = (
                self.db.query(Restaurant)
                .filter(Restaurant.email.ilike(email_norm))
                .first()
            )
            if not r or not r.passwordhash:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

            if not verify_password(password, r.passwordhash):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

            token = create_access_token({
                "sub": str(r.restaurantid),
                "type": "restaurant",
                "role": "restaurant",
                "email": r.email
            })

            return {
                "access_token": token,
                "role": "restaurant",
                "user_id": r.restaurantid,
                "user_type": "restaurant",
            }

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown login type")
