from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas import lieferant_schemas as schemas
from ..services.lieferant_services import LieferantService

router = APIRouter(prefix="/lieferanten", tags=["Lieferanten"])

@router.get("/", response_model=List[schemas.LieferantResponse])
def get_all_lieferanten(db: Session = Depends(get_db)):
    return LieferantService(db).get_all()

@router.post("/", response_model=schemas.LieferantResponse, status_code=status.HTTP_201_CREATED)
def create_lieferant(data: schemas.LieferantCreate, db: Session = Depends(get_db)):
    return LieferantService(db).create(data.model_dump())


@router.put("/{lieferantid}", response_model=schemas.LieferantResponse)
def update_lieferant(lieferantid: int, data: schemas.LieferantUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    lieferant = LieferantService(db).update(lieferantid, update_data)
    if not lieferant:
        raise HTTPException(status_code=404, detail="Lieferant nicht gefunden")
    return lieferant

@router.delete("/{lieferantid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lieferant(lieferantid: int, db: Session = Depends(get_db)):
    success = LieferantService(db).delete(lieferantid)
    if not success:
        raise HTTPException(status_code=404, detail="Lieferant nicht gefunden")
    return None