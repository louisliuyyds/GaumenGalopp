from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.auth_schema import (
    RegisterRequest,
    RestaurantRegisterRequest,
    LoginRequest,
    TokenResponse,
    MeResponse
)
from services.auth_service import AuthService
from core.security import get_current_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register_kunde(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Neuen Kunden registrieren

    Example Request:
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

    Example Response:
        {
            "access_token": "eyJhbGc...",
            "token_type": "bearer",
            "role": "kunde",
            "user_id": 1,
            "user_type": "kunde"
        }
    """
    svc = AuthService(db)

    # Kunde registrieren
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

    # Automatisch einloggen nach Registrierung
    login_result = svc.login(
        login_type="kunde",
        email=payload.email,
        password=payload.password
    )

    return TokenResponse(**login_result)


@router.post("/register/restaurant", response_model=TokenResponse, status_code=201)
def register_restaurant(payload: RestaurantRegisterRequest, db: Session = Depends(get_db)):
    """
    Neues Restaurant registrieren

    Example Request:
        POST /api/auth/register/restaurant
        {
            "name": "Bella Italia",
            "email": "info@bella-italia.com",
            "password": "SicheresPasswort123",
            "adresseid": 2,
            "telefon": "0987654321",
            "klassifizierung": "Italienisch",
            "kuechenchef": "Giuseppe Rossi"
        }

    Example Response:
        {
            "access_token": "eyJhbGc...",
            "token_type": "bearer",
            "role": "restaurant",
            "user_id": 1,
            "user_type": "restaurant"
        }
    """
    svc = AuthService(db)

    # Restaurant registrieren
    restaurant = svc.register_restaurant(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        adresseid=payload.adresseid,
        telefon=payload.telefon,
        klassifizierung=payload.klassifizierung,
        kuechenchef=payload.kuechenchef
    )

    # Automatisch einloggen nach Registrierung
    login_result = svc.login(
        login_type="restaurant",
        email=payload.email,
        password=payload.password
    )

    return TokenResponse(**login_result)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Login für Kunde oder Restaurant

    Example Request (Kunde):
        POST /api/auth/login
        {
            "type": "kunde",
            "email": "max@example.com",
            "password": "SicheresPasswort123"
        }

    Example Request (Restaurant):
        POST /api/auth/login
        {
            "type": "restaurant",
            "email": "info@bella-italia.com",
            "password": "SicheresPasswort123"
        }

    Example Response:
        {
            "access_token": "eyJhbGc...",
            "token_type": "bearer",
            "role": "kunde" | "kritiker" | "restaurant",
            "user_id": 1,
            "user_type": "kunde" | "restaurant"
        }
    """
    svc = AuthService(db)

    result = svc.login(
        login_type=payload.type,
        email=payload.email,
        password=payload.password
    )

    return TokenResponse(**result)


@router.get("/me", response_model=MeResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Informationen über aktuell eingeloggten User (Kunde oder Restaurant)

    Erfordert Authorization Header mit Bearer Token

    Example Request:
        GET /api/auth/me
        Headers:
            Authorization: Bearer <token>

    Example Response (Kunde):
        {
            "user_id": 1,
            "user_type": "kunde",
            "role": "kunde",
            "email": "max@example.com"
        }

    Example Response (Restaurant):
        {
            "user_id": 1,
            "user_type": "restaurant",
            "role": "restaurant",
            "email": "info@bella-italia.com"
        }
    """
    # current_user hat das Attribut user_type von get_current_user() Dependency
    user_type = getattr(current_user, 'user_type', None)

    if user_type == "kunde":
        # Bei Kunde könnte die Rolle "kunde" oder "kritiker" sein
        # Das müssten wir aus dem Token holen oder in der Dependency setzen
        from models.kritiker import Kritiker
        from database import get_db

        db = next(get_db())
        is_kritiker = db.query(Kritiker).filter(Kritiker.kundenid == current_user.kundenid).first() is not None
        role = "kritiker" if is_kritiker else "kunde"

        return MeResponse(
            user_id=current_user.kundenid,
            user_type="kunde",
            role=role,
            email=current_user.email
        )

    elif user_type == "restaurant":
        return MeResponse(
            user_id=current_user.restaurantid,
            user_type="restaurant",
            role="restaurant",
            email=current_user.email
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unknown user type"
        )


@router.post("/logout")
def logout():
    """
    Logout (Token wird clientseitig gelöscht)

    Der Server muss nichts tun, da JWT stateless ist.
    Der Client sollte den Token aus seinem Storage löschen.

    Returns:
        Success-Message
    """
    return {"message": "Erfolgreich abgemeldet"}
