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
