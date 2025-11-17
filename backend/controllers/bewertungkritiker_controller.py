# controllers/bewertungkritiker_controller.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services.bewertungkritiker_service import BewertungkritikerService
from schemas.bewertungkritiker_schema import BewertungkritikerCreate, BewertungkritikerUpdate, BewertungkritikerResponse

router = APIRouter(
    prefix="/api/bewertungkritikers",
    tags=["bewertungkritikers"]
)

# GET /api/bewertungkritikers - Get all bewertungkritikers
@router.get("/", response_model=List[BewertungkritikerResponse])
def get_all_bewertungkritikers(db: Session = Depends(get_db)):
    service = BewertungkritikerService(db)
    bewertungkritikers = service.get_all()
    return bewertungkritikers

# GET /api/bewertungkritikers/{id} - Get specific bewertungkritiker
@router.get("/{bewertungkritiker_id}", response_model=BewertungkritikerResponse)
def get_bewertungkritiker(bewertungkritiker_id: int, db: Session = Depends(get_db)):
    service = BewertungkritikerService(db)
    bewertungkritiker = service.get_by_id(bewertungkritiker_id)
    
    if not bewertungkritiker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertungkritiker with id {bewertungkritiker_id} not found"
        )
    
    return bewertungkritiker

# POST /api/bewertungkritikers - Create new bewertungkritiker
@router.post("/", response_model=BewertungkritikerResponse, status_code=status.HTTP_201_CREATED)
def create_bewertungkritiker(
    bewertungkritiker: BewertungkritikerCreate,
    db: Session = Depends(get_db)
):
    service = BewertungkritikerService(db)
    new_bewertungkritiker = service.create(bewertungkritiker.dict())
    return new_bewertungkritiker

# PUT /api/bewertungkritikers/{id} - Update bewertungkritiker
@router.put("/{bewertungkritiker_id}", response_model=BewertungkritikerResponse)
def update_bewertungkritiker(
    bewertungkritiker_id: int,
    bewertungkritiker_update: BewertungkritikerUpdate,
    db: Session = Depends(get_db)
):
    service = BewertungkritikerService(db)
    updated_bewertungkritiker = service.update(
        bewertungkritiker_id,
        bewertungkritiker_update.dict(exclude_unset=True)
    )
    
    if not updated_bewertungkritiker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertungkritiker with id {bewertungkritiker_id} not found"
        )
    
    return updated_bewertungkritiker

# DELETE /api/bewertungkritikers/{id} - Delete bewertungkritiker
@router.delete("/{bewertungkritiker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bewertungkritiker(bewertungkritiker_id: int, db: Session = Depends(get_db)):
    service = BewertungkritikerService(db)
    success = service.delete(bewertungkritiker_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bewertungkritiker with id {bewertungkritiker_id} not found"
        )
    
    return None