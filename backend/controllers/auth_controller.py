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
    """
    svc = AuthService(db)

    # Kunde registrieren (Adresse wird automatisch erstellt)
    kunde = svc.register(
        vorname=payload.vorname,
        nachname=payload.nachname,
        email=payload.email,
        password=payload.password,
        strasse=payload.strasse,
        hausnummer=payload.hausnummer,
        plz=payload.plz,
        stadt=payload.stadt,
        land=payload.land,
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
    """
    svc = AuthService(db)

    # Restaurant registrieren (Adresse wird automatisch erstellt)
    restaurant = svc.register_restaurant(
        name=payload.name,
        email=payload.email,
        password=payload.password,
        strasse=payload.strasse,
        hausnummer=payload.hausnummer,
        plz=payload.plz,
        stadt=payload.stadt,
        land=payload.land,
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
    Informationen über aktuell eingeloggten User
    """
    user_type = getattr(current_user, 'user_type', None)

    if user_type == "kunde":
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
    """
    return {"message": "Erfolgreich abgemeldet"}