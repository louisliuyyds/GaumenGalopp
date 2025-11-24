from fastapi import APIRouter, Depends, HTTPException, status

from services.preis_service import PreisService
from schemas import preis_schema as schemas
from database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/api/preis", tags=["preis"])

@router.get("/", response_model=List[schemas.PreisResponse])
def get_all_preis(db: Session = Depends(get_db)):
    return PreisService(db).get_all()

@router.get("/{preisid}", response_model=schemas.PreisResponse)
def get_by_id(preisid: int, db: Session = Depends(get_db)):
    return PreisService(db).get_by_id(preisid)

@router.post("/", response_model=schemas.PreisResponse, status_code=status.HTTP_201_CREATED)
def create_preis(data: schemas.PreisCreate, db: Session = Depends(get_db)):
    return PreisService(db).create(data.model_dump())

@router.put("/{preisid}", response_model=schemas.PreisResponse)
def update_preis(preisid: int, data: schemas.PreisUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    preis = PreisService(db).update(preisid, update_data)
    if not preis:
        raise HTTPException(status_code=404, detail="Preis nicht gefunden")
    return preis

@router.delete("/{preisid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_preis(preisid: int, db: Session = Depends(get_db)):
    success = PreisService(db).delete(preisid)
    if not success:
        raise HTTPException(status_code=404, detail="Preis nicht gefunden")
    return None