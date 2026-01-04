from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services.bewertung_service import BewertungService
from schemas.bewertung_schema import BewertungCreate, BewertungUpdate, BewertungResponse

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

# GET /api/bewertungen/gericht/{gerichtid} - Get bewertungen by gericht
@router.get("/gericht/{gerichtid}", response_model=List[BewertungResponse])
def get_bewertungen_by_gericht(gerichtid: int, db: Session = Depends(get_db)):
    service = BewertungService(db)
    bewertungen = service.get_by_gericht(gerichtid)
    return bewertungen

# GET /api/bewertungen/{id} - Get specific bewertung
@router.get("/{bewertungid}", response_model=BewertungResponse)
def get_bewertung(bewertungid: int, db: Session = Depends(get_db)):
    service = BewertungService(db)
    bewertung = service.get_by_id(bewertungid)
    
    if not bewertung:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertung with id {bewertungid} not found"
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
@router.put("/{bewertungid}", response_model=BewertungResponse)
def update_bewertung(
    bewertungid: int,
    bewertung_update: BewertungUpdate,
    db: Session = Depends(get_db)
):
    service = BewertungService(db)
    updated_bewertung = service.update(
        bewertungid,
        bewertung_update.model_dump(exclude_unset=True)
    )
    
    if not updated_bewertung:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertung with id {bewertungid} not found"
        )
    
    return updated_bewertung

# DELETE /api/bewertungs/{id} - Delete bewertung
@router.delete("/{bewertungid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bewertung(bewertungid: int, db: Session = Depends(get_db)):
    service = BewertungService(db)
    success = service.delete(bewertungid)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertung with id {bewertungid} not found"
        )
    
    return None