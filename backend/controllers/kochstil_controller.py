from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.services.kochstil_service import KochstilService
from backend.schemas.kochstil_schema import KochstilCreate, KochstilUpdate, KochstilResponse

router = APIRouter(
    prefix="/api/kochstile",
    tags=["kochstile"]
)

@router.get("/", response_model=List[KochstilResponse])
def get_all_kochstile(db: Session = Depends(get_db)):
    service = KochstilService(db)
    kochstile = service.get_all()
    return kochstile

@router.get("/{stil_id}", response_model=KochstilResponse)
def get_kochstil(stil_id: int, db: Session = Depends(get_db)):
    service = KochstilService(db)
    kochstil = service.get_by_id(stil_id)

    if not kochstil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kochstil with id {stil_id} not found"
        )

    return kochstil

@router.post("/", response_model=KochstilResponse, status_code=status.HTTP_201_CREATED)
def create_kochstil(
        kochstil: KochstilCreate,
        db: Session = Depends(get_db)
):
    service = KochstilService(db)
    new_kochstil = service.create(kochstil.model_dump())
    return new_kochstil

@router.put("/{stil_id}", response_model=KochstilResponse)
def update_kochstil(
        stil_id: int,
        kochstil_update: KochstilUpdate,
        db: Session = Depends(get_db)
):
    service = KochstilService(db)
    updated_kochstil = service.update(
        stil_id,
        kochstil_update.model_dump(exclude_unset=True)
    )

    if not updated_kochstil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kochstil with id {stil_id} not found"
        )

    return updated_kochstil

@router.delete("/{stil_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_kochstil(stil_id: int, db: Session = Depends(get_db)):
    service = KochstilService(db)
    success = service.delete(stil_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kochstil with id {stil_id} not found or still in use"
        )

    return None

@router.get("/search/{name}", response_model=List[KochstilResponse])
def search_kochstil(name: str, db: Session = Depends(get_db)):
    service = KochstilService(db)
    kochstile = service.search_by_name(name)
    return kochstile