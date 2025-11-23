from fastapi import APIRouter, Depends,status
from backend.services.labelGericht_service import LabelGerichtService
from backend.schemas import labelGericht_schema as schemas
from backend.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="labelGericht", tags=["labelGericht"])

@router.get("/byLabelId/{labelid}")
def get_by_label_id(labelid: int, db: Session = Depends(get_db)):
    return LabelGerichtService(db).get_by_label_id(labelid)

@router.get("/byGerichtId/{gerichtid}")
def get_by_gericht_id(gerichtid: int, db: Session = Depends(get_db)):
    return LabelGerichtService(db).get_by_gericht_id(gerichtid)

@router.post("/", response_model=schemas.LabelResponsem, status_code=status.HTTP_201_CREATED)
def create_label_gericht(data: schemas.LabelGericht, db: Session = Depends(get_db)):
    return LabelGerichtService(db).create(data)

@router.delete("/{gerichtid}/{labelid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_label_gericht(gerichtid: int, labelid: int, db: Session = Depends(get_db)):
    return LabelGerichtService(db).delete(gerichtid, labelid)