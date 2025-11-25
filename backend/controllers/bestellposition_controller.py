from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import bestellposition_schemas as schemas
from services.bestellposition_services import BestellpositionService

router = APIRouter(prefix="/api/bestellpositionen", tags=["Bestellpositionen"])

@router.post("/", response_model=schemas.BestellpositionResponse, status_code=status.HTTP_201_CREATED)
def add_position(data: schemas.BestellpositionCreate, db: Session = Depends(get_db)):
    return BestellpositionService(db).create(data.model_dump())


@router.get("/bestellung/{bestellungid}", response_model=List[schemas.BestellpositionResponse])
def get_positions_for_order(bestellungid: int, db: Session = Depends(get_db)):
    return BestellpositionService(db).get_by_bestellung(bestellungid)


@router.delete("/{positionid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_position(positionid: int, db: Session = Depends(get_db)):
    success = BestellpositionService(db).delete(positionid)
    if not success:
        raise HTTPException(status_code=404, detail="Position nicht gefunden")
    return None