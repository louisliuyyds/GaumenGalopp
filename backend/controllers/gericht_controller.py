from fastapi import APIRouter, Depends, HTTPException, status

from backend.services.gericht_service import GerichtService
from backend.services.labelGericht_service import LabelGerichtService
from backend.schemas import gericht_schema as schemas
from backend.database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/gericht", tags=["gericht"])

@router.get("/", response_model=List[schemas.GerichtResponse])
def get_all_gericht(db: Session = Depends(get_db)):
    return GerichtService(db).get_all()

@router.get("/{gerichtid}", response_model=schemas.GerichtResponse)
def get_by_id(gerichtid: int, db: Session = Depends(get_db)):
    return GerichtService(db).get_by_id(gerichtid)

@router.get("/byLabelId/{labelid}", response_model=list[schemas.GerichtResponse])
def get_by_label_id(labelid: int, db: Session = Depends(get_db)):
    label_gerichte = LabelGerichtService(db).get_by_gericht_id(labelid)
    return GerichtService(db).get_by_id_list([gerichte.gerichtid for gerichte in label_gerichte])

@router.post("/", response_model=schemas.GerichtResponse, status_code=status.HTTP_201_CREATED)
def create_gericht(data: schemas.GerichtCreate, db: Session = Depends(get_db)):
    return GerichtService(db).create(data.model_dump())

@router.put("/{gerichtid}", response_model=schemas.GerichtResponse)
def update_gericht(gerichtid: int, data: schemas.GerichtUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    gericht = GerichtService(db).update(gerichtid, update_data)
    if not gericht:
        raise HTTPException(status_code=404, detail="Gericht nicht gefunden")
    return gericht

@router.delete("/{gerichtid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gericht(gerichtid: int, db: Session = Depends(get_db)):
    success = GerichtService(db).delete(gerichtid)
    if not success:
        raise HTTPException(status_code=404, detail="Gericht nicht gefunden")
    return None