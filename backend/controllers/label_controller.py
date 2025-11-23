from fastapi import APIRouter, Depends, HTTPException, status

from ..services.label_service import LabelService
from ..services.labelGericht_service import LabelGerichtService
from ..schemas import label_schema as schemas
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/label", tags=["label"])

@router.get("/", response_model=List[schemas.LabelResponse])
def get_all_labels(db: Session = Depends(get_db)):
    return LabelService(db).get_all()

@router.get("/{labelid}", response_model=schemas.LabelResponse)
def get_by_id(labelid: int, db: Session = Depends(get_db)):
    return LabelService(db).get_by_id(labelid)

@router.get("/byGerichtId/{gerichtid}", response_model=schemas.LabelResponse)
def get_by_gericht_id(gerichtid: int, db: Session = Depends(get_db)):
    label_gerichte = LabelGerichtService(db).get_by_gericht_id(gerichtid)
    return LabelService(db).get_by_id_list([labels.labelid for labels in label_gerichte])

@router.post("/", response_model=schemas.LabelResponse, status_code=status.HTTP_201_CREATED)
def create_label(data: schemas.LabelCreate, db: Session = Depends(get_db)):
    return LabelService(db).create(data.model_dump())

@router.put("/{labelid}", response_model=schemas.LabelResponse)
def update_label(labelid: int, data: schemas.LabelUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    label = LabelService(db).update(labelid, update_data)
    if not label:
        raise HTTPException(status_code=404, detail="Label nicht gefunden")
    return label

@router.delete("/{labelid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_label(labelid: int, db: Session = Depends(get_db)):
    success = LabelService(db).delete(labelid)
    if not success:
        raise HTTPException(status_code=404, detail="Label nicht gefunden")
    return None