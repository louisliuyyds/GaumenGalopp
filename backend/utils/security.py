from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# TODO: Diese in .env auslagern!
JWT_SECRET = "CHANGE_ME"         # put in env var
JWT_ALG = "HS256"
JWT_EXPIRE_MIN = 60 * 24         # 1 day
ACCESS_TOKEN_EXPIRE_MINUTES = JWT_EXPIRE_MIN  # Alias für Kompatibilität

bearer = HTTPBearer(auto_error=True)

# ===== PASSWORD FUNKTIONEN =====

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def get_password_hash(password: str) -> str:
    """Alias für hash_password - für Kompatibilität mit kunde_service"""
    return hash_password(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

# ===== JWT TOKEN FUNKTIONEN =====

def create_access_token(claims: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Erstellt JWT Token

    Args:
        claims: Dictionary mit Daten (muss 'sub', 'kundenid', 'email' enthalten)
        expires_delta: Optional timedelta für Ablaufzeit

    Returns:
        JWT Token String
    """
    payload = claims.copy()

    if expires_delta:
        payload["exp"] = datetime.now(timezone.utc) + expires_delta
    else:
        payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MIN)

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_claims(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> Dict[str, Any]:
    return decode_token(creds.credentials)

# ===== KUNDE DEPENDENCY (NEU) =====

async def get_current_kunde(creds: HTTPAuthorizationCredentials = Depends(bearer), db: Session = Depends(None)):
    """
    FastAPI Dependency: Holt aktuellen Kunde aus Token

    Usage:
        @router.get("/protected")
        def protected(current_kunde = Depends(get_current_kunde)):
            return {"email": current_kunde.email}
    """
    from database import get_db
    from models.kunde import Kunde

    claims = decode_token(creds.credentials)
    kundenid = claims.get("kundenid")

    if not kundenid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # DB Session holen
    if db is None:
        db = next(get_db())

    kunde = db.query(Kunde).filter(Kunde.kundenid == kundenid).first()

    if not kunde:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Kunde not found")

    if not kunde.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Kunde deaktiviert")

    return kunde

async def get_current_active_admin(current_kunde = Depends(get_current_kunde)):
    """Nur für Admins"""
    if not current_kunde.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Keine Admin-Berechtigung")
    return current_kunde