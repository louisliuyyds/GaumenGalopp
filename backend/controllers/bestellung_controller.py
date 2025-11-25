from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import bestellung_schemas as schemas
from services.bestellung_services import BestellungService

router = APIRouter(prefix="/api/bestellungen", tags=["bestellungen"])

@router.get("/", response_model=List[schemas.BestellungResponse])
def get_all_bestellungen(db: Session = Depends(get_db)):
    return BestellungService(db).get_all()


@router.get("/{bestellungid}", response_model=schemas.BestellungResponse)
def get_bestellung(bestellungid: int, db: Session = Depends(get_db)):
    order = BestellungService(db).get_by_id(bestellungid)
    if not order:
        raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
    return order

@router.get("/{bestellungid}/total", response_model=float)
def get_order_total(bestellungid: int, db: Session = Depends(get_db)):
    return BestellungService(db).calculate_total(bestellungid)

@router.post("/", response_model=schemas.BestellungResponse, status_code=status.HTTP_201_CREATED)
def create_bestellung(data: schemas.BestellungCreate, db: Session = Depends(get_db)):
    return BestellungService(db).create(data.model_dump())


@router.put("/{bestellungid}", response_model=schemas.BestellungResponse)
def update_bestellung(bestellungid: int, data: schemas.BestellungUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    updated_order = BestellungService(db).update(bestellungid, update_data)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
    return updated_order