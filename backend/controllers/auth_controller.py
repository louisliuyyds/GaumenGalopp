from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.auth_schema import RegisterRequest, LoginRequest, TokenResponse, MeResponse
from services.auth_service import AuthService
from utils.security import get_current_kunde

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/register", response_model=MeResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Neuen Kunden registrieren

    Example:
        POST /api/auth/register
        {
            "vorname": "Max",
            "nachname": "Mustermann",
            "email": "max@example.com",
            "password": "SicheresPasswort123",
            "adressid": 1,
            "telefonnummer": "0123456789",
            "geburtsdatum": "1990-01-01",
            "namenskuerzel": "MaxM"
        }
    """
    svc = AuthService(db)
    kunde = svc.register(
        vorname=payload.vorname,
        nachname=payload.nachname,
        email=payload.email,
        password=payload.password,
        adressid=payload.adressid,
        telefonnummer=payload.telefonnummer,
        geburtsdatum=payload.geburtsdatum,
        namenskuerzel=payload.namenskuerzel
    )

    return {
        **kunde.to_dict(),
        "role": "admin" if kunde.is_admin else "kunde"
    }


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Kunde einloggen

    Example:
        POST /api/auth/login
        {
            "email": "max@example.com",
            "password": "SicheresPasswort123"
        }

        Response:
        {
            "access_token": "eyJhbGc...",
            "token_type": "bearer",
            "kundenid": 42,
            "email": "max@example.com",
            "role": "kunde"
        }
    """
    svc = AuthService(db)
    result = svc.login(payload.email, payload.password)

    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "kundenid": result["kundenid"],
        "email": result["email"],
        "role": result["role"]
    }


@router.get("/me", response_model=MeResponse)
def me(current_kunde = Depends(get_current_kunde)):
    """
    Informationen über aktuell eingeloggten Kunden

    Example:
        GET /api/auth/me
        Headers: Authorization: Bearer <token>

        Response:
        {
            "kundenid": 42,
            "vorname": "Max",
            "nachname": "Mustermann",
            "email": "max@example.com",
            "role": "kunde",
            ...
        }
    """
    return {
        **current_kunde.to_dict(),
        "role": "admin" if current_kunde.is_admin else "kunde"
    }


@router.post("/logout")
def logout():
    """
    Logout (Token wird clientseitig gelöscht)

    Returns:
        Success-Message
    """
    return {"message": "Erfolgreich abgemeldet"}
