from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import os

from database import get_db
from services.kunde_service import KundeService
from schemas.kunde_schema import (
    KundeCreate,
    KundeUpdate,
    KundeResponse,
    KundeProfileResponse,
    KundeProfileUpdate,
    KundeKuerzelResponse,
)
from models.kunde import Kunde

router = APIRouter(
    prefix="/api/kunde",
    tags=["kunde"]
)


def _get_demo_kunde(db: Session) -> Optional[Kunde]:
    """Returns the demo/test customer for prototype flows."""
    service = KundeService(db)
    test_id = os.getenv("TEST_KUNDE_ID")
    if test_id:
        return service.get_by_id(int(test_id))

    return db.query(Kunde)\
        .options(joinedload(Kunde.adresse))\
        .order_by(Kunde.kundenid)\
        .first()

@router.get("/", response_model=List[KundeResponse])
def get_all_kunden(db: Session = Depends(get_db)):
    service = KundeService(db)
    kunden = service.get_all()
    return kunden

@router.get("/me", response_model=KundeProfileResponse)
def get_current_kunde(db: Session = Depends(get_db)):
    kunde = _get_demo_kunde(db)
    if not kunde:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No test customer found")
    return kunde


@router.put("/me", response_model=KundeProfileResponse)
def update_current_kunde(payload: KundeProfileUpdate, db: Session = Depends(get_db)):
    kunde = _get_demo_kunde(db)
    if not kunde:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No test customer found")

    service = KundeService(db)
    updated = service.update(kunde.kundenid, payload.model_dump(exclude_unset=True))
    return updated

@router.get("/{kunden_id}", response_model=KundeResponse)
def get_kunde(kunden_id: int, db: Session = Depends(get_db)):
    service = KundeService(db)
    kunde = service.get_by_id(kunden_id)

    if not kunde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with id {kunden_id} not found"
        )

    return kunde

@router.get("/{kunden_id}/adressid")
def get_adressid_by_kunden_id(kunden_id: int, db: Session = Depends(get_db)):
    adressid = KundeService(db).get_adressid_by_kunden_id(kunden_id)
    if adressid is None:
        raise HTTPException(status_code=404, detail="Kunde not found")
    return {"adressid": adressid}

@router.get("/getKuerzelById/{kunden_id}", response_model=KundeKuerzelResponse)
def get_kundenkuerzel(kunden_id: int, db: Session = Depends(get_db)):
    service = KundeService(db)
    kuerzel = service.get_kuerzel_by_id(kunden_id)
    if kuerzel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with id {kunden_id} not found"
        )

    return {"namenskuerzel": kuerzel}

@router.post("/", response_model=KundeResponse, status_code=status.HTTP_201_CREATED)
def create_kunde(
        kunde: KundeCreate,
        db: Session = Depends(get_db)
):
    service = KundeService(db)
    new_kunde = service.create(kunde.model_dump())
    return new_kunde

@router.put("/{kunden_id}", response_model=KundeResponse)
def update_kunde(
        kunden_id: int,
        kunde_update: KundeUpdate,
        db: Session = Depends(get_db)
):
    service = KundeService(db)
    updated_kunde = service.update(
        kunden_id,
        kunde_update.model_dump(exclude_unset=True)
    )

    if not updated_kunde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with id {kunden_id} not found"
        )

    return updated_kunde


@router.get("/{kunden_id}/profil", response_model=KundeProfileResponse)
def get_kunde_profile(kunden_id: int, db: Session = Depends(get_db)):
    service = KundeService(db)
    kunde = service.get_by_id(kunden_id)

    if not kunde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with id {kunden_id} not found"
        )

    return kunde


@router.put("/{kunden_id}/profil", response_model=KundeProfileResponse)
def update_kunde_profile(
        kunden_id: int,
        kunde_update: KundeProfileUpdate,
        db: Session = Depends(get_db)
):
    service = KundeService(db)
    updated_kunde = service.update(
        kunden_id,
        kunde_update.model_dump(exclude_unset=True)
    )

    if not updated_kunde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with id {kunden_id} not found"
        )

    return updated_kunde

@router.delete("/{kunden_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_kunde(kunden_id: int, db: Session = Depends(get_db)):
    service = KundeService(db)
    success = service.delete(kunden_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with id {kunden_id} not found"
        )

    return None

@router.get("/email/{email}", response_model=KundeResponse)
def search_kunde_by_email(email: str, db: Session = Depends(get_db)):
    service = KundeService(db)
    kunde = service.search_by_email(email)

    if not kunde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kunde with email {email} not found"
        )

    return kunde

@router.get("/nachname/{nachname}", response_model=List[KundeResponse])
def search_kunden_by_nachname(nachname: str, db: Session = Depends(get_db)):
    service = KundeService(db)
    kunden = service.search_by_name(nachname)
    return kunden

