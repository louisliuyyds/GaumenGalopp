from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..services.adresse_service import AdresseService
from ..schemas.adresse_schema import AdresseCreate, AdresseUpdate, AdresseResponse

router = APIRouter(
    prefix="/api/adressen",
    tags=["adressen"]
)

@router.get("/", response_model=List[AdresseResponse])
def get_all_adressen(db: Session = Depends(get_db)):
    service = AdresseService(db)
    adressen = service.get_all()
    return adressen

@router.get("/{adresse_id}", response_model=AdresseResponse)
def get_adresse(adresse_id: int, db: Session = Depends(get_db)):
    service = AdresseService(db)
    adresse = service.get_by_id(adresse_id)

    if not adresse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Adresse with id {adresse_id} not found"
        )

    return adresse

@router.post("/", response_model=AdresseResponse, status_code=status.HTTP_201_CREATED)
def create_adresse(
        adresse: AdresseCreate,
        db: Session = Depends(get_db)
):
    service = AdresseService(db)
    new_adresse = service.create(adresse.model_dump())
    return new_adresse

@router.put("/{adresse_id}", response_model=AdresseResponse)
def update_adresse(
        adresse_id: int,
        adresse_update: AdresseUpdate,
        db: Session = Depends(get_db)
):
    service = AdresseService(db)
    updated_adresse = service.update(
        adresse_id,
        adresse_update.model_dump(exclude_unset=True)
    )

    if not updated_adresse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Adresse with id {adresse_id} not found"
        )

    return updated_adresse

@router.delete("/{adresse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_adresse(adresse_id: int, db: Session = Depends(get_db)):
    service = AdresseService(db)
    success = service.delete(adresse_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Adresse with id {adresse_id} not found or still in use"
        )

    return None

@router.get("/plz/{postleitzahl}", response_model=List[AdresseResponse])
def search_by_plz(postleitzahl: str, db: Session = Depends(get_db)):
    service = AdresseService(db)
    adressen = service.search_by_plz(postleitzahl)
    return adressen