from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Code.backend.database import get_db
from Code.backend.services.kunde_service import KundeService
from Code.backend.schemas.kunde_schema import KundeCreate, KundeUpdate, KundeResponse

router = APIRouter(
    prefix="/api/kunden",
    tags=["kunden"]
)

@router.get("/", response_model=List[KundeResponse])
def get_all_kunden(db: Session = Depends(get_db)):
    service = KundeService(db)
    kunden = service.get_all()
    return kunden

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