from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.services.bewertung_service import BewertungService
from backend.schemas.bewertung_schema import BewertungCreate, BewertungUpdate, BewertungResponse

router = APIRouter(
    prefix="/api/bewertungen",
    tags=["bewertungen"]
)

# GET /api/bewertungen - Get all bewertungen
@router.get("/", response_model=List[BewertungResponse])
def get_all_bewertungen(db: Session = Depends(get_db)):
    service = BewertungService(db)
    bewertungen = service.get_all()
    return bewertungen

# GET /api/bewertungen/{id} - Get specific bewertung
@router.get("/{bewertung_id}", response_model=BewertungResponse)
def get_bewertung(bewertung_id: int, db: Session = Depends(get_db)):
    service = BewertungService(db)
    bewertung = service.get_by_id(bewertung_id)
    
    if not bewertung:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertung with id {bewertung_id} not found"
        )
    
    return bewertung

# POST /api/bewertungen - Create new bewertung
@router.post("/", response_model=BewertungResponse, status_code=status.HTTP_201_CREATED)
def create_bewertung(
    bewertung: BewertungCreate,
    db: Session = Depends(get_db)
):
    service = BewertungService(db)
    new_bewertung = service.create(bewertung.model_dump())
    return new_bewertung

# PUT /api/bewertungs/{id} - Update bewertung
@router.put("/{bewertung_id}", response_model=BewertungResponse)
def update_bewertung(
    bewertung_id: int,
    bewertung_update: BewertungUpdate,
    db: Session = Depends(get_db)
):
    service = BewertungService(db)
    updated_bewertung = service.update(
        bewertung_id,
        bewertung_update.model_dump(exclude_unset=True)
    )
    
    if not updated_bewertung:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertung with id {bewertung_id} not found"
        )
    
    return updated_bewertung

# DELETE /api/bewertungs/{id} - Delete bewertung
@router.delete("/{bewertung_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bewertung(bewertung_id: int, db: Session = Depends(get_db)):
    service = BewertungService(db)
    success = service.delete(bewertung_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertung with id {bewertung_id} not found"
        )
    
    return None