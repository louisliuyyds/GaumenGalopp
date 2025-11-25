from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.oeffnungszeit_vorlage_service import OeffnungszeitVorlageService
from schemas.oeffnungszeit_vorlage_schema import OeffnungszeitVorlageCreate, OeffnungszeitVorlageUpdate, OeffnungszeitVorlageResponse

router = APIRouter(
    prefix="/api/oeffnungszeit-vorlagen",
    tags=["oeffnungszeit-vorlagen"]
)

# GET /api/oeffnungszeit-vorlagen - Get all oeffnungszeit_vorlagen
@router.get("/", response_model=List[OeffnungszeitVorlageResponse])
def get_all_oeffnungszeit_vorlagen(db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    vorlagen = service.get_all()
    return vorlagen

# GET /api/oeffnungszeit-vorlagen/{id} - Get specific oeffnungszeit_vorlage
@router.get("/{oeffnungszeitid}", response_model=OeffnungszeitVorlageResponse)
def get_oeffnungszeit_vorlage(oeffnungszeit_id: int, db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    vorlage = service.get_by_id(oeffnungszeit_id)
    
    if not vorlage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitVorlage with id {oeffnungszeit_id} not found"
        )
    
    return vorlage

# POST /api/oeffnungszeit-vorlagen - Create new oeffnungszeit_vorlage
@router.post("/", response_model=OeffnungszeitVorlageResponse, status_code=status.HTTP_201_CREATED)
def create_oeffnungszeit_vorlage(
    vorlage: OeffnungszeitVorlageCreate,
    db: Session = Depends(get_db)
):
    service = OeffnungszeitVorlageService(db)
    new_vorlage = service.create(vorlage.model_dump())
    return new_vorlage

# PUT /api/oeffnungszeit-vorlagen/{id} - Update oeffnungszeit_vorlage
@router.put("/{oeffnungszeitid}", response_model=OeffnungszeitVorlageResponse)
def update_oeffnungszeit_vorlage(
    oeffnungszeit_id: int,
    vorlage_update: OeffnungszeitVorlageUpdate,
    db: Session = Depends(get_db)
):
    service = OeffnungszeitVorlageService(db)
    updated_vorlage = service.update(
        oeffnungszeit_id,
        vorlage_update.model_dump(exclude_unset=True)
    )
    
    if not updated_vorlage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitVorlage with id {oeffnungszeit_id} not found"
        )
    
    return updated_vorlage

# DELETE /api/oeffnungszeit-vorlagen/{id} - Delete oeffnungszeit_vorlage
@router.delete("/{oeffnungszeitid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_oeffnungszeit_vorlage(oeffnungszeit_id: int, db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    success = service.delete(oeffnungszeit_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitVorlage with id {oeffnungszeit_id} not found"
        )
    
    return None