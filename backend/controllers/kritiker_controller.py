from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services.kritiker_service import KritikerService
from schemas.kritiker_schema import KritikerCreate, KritikerUpdate, KritikerResponse

router = APIRouter(
    prefix="/api/kritikers",
    tags=["kritikers"]
)

# GET /api/kritikers - Get all kritikers
@router.get("/", response_model=List[KritikerResponse])
def get_all_kritikers(db: Session = Depends(get_db)):
    service = KritikerService(db)
    kritikers = service.get_all()
    return kritikers

# GET /api/kritikers/by-kunden/{kunden_id} - Get kritiker by kunden reference
@router.get("/by-kunden/{kunden_id}", response_model=KritikerResponse)
def get_kritiker_by_kunden(kunden_id: int, db: Session = Depends(get_db)):
    service = KritikerService(db)
    kritiker = service.get_by_kunden_id(kunden_id)

    if not kritiker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kritiker with kunden id {kunden_id} not found"
        )

    return kritiker

# GET /api/kritikers/{id} - Get specific kritiker
@router.get("/{kritiker_id}", response_model=KritikerResponse)
def get_kritiker(kritiker_id: int, db: Session = Depends(get_db)):
    service = KritikerService(db)
    kritiker = service.get_by_id(kritiker_id)
    
    if not kritiker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kritiker with id {kritiker_id} not found"
        )
    
    return kritiker

# POST /api/kritikers - Create new kritiker
@router.post("/", response_model=KritikerResponse, status_code=status.HTTP_201_CREATED)
def create_Kritiker(
    Kritiker: KritikerCreate,
    db: Session = Depends(get_db)
):
    service = KritikerService(db)
    new_kritiker = service.create(Kritiker.model_dump())
    return new_kritiker

# PUT /api/kritikers/{id} - Update kritiker
@router.put("/{kritiker_id}", response_model=KritikerResponse)
def update_kritiker(
    kritiker_id: int,
    kritiker_update: KritikerUpdate,
    db: Session = Depends(get_db)
):
    service = KritikerService(db)
    updated_kritiker = service.update(
        kritiker_id,
        kritiker_update.model_dump(exclude_unset=True)
    )
    
    if not updated_kritiker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kritiker with id {kritiker_id} not found"
        )
    
    return updated_kritiker

# DELETE /api/kritikers/{id} - Delete kritiker
@router.delete("/{kritiker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_kritiker(kritiker_id: int, db: Session = Depends(get_db)):
    service = KritikerService(db)
    success = service.delete(kritiker_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kritiker with id {kritiker_id} not found"
        )
    
    return None