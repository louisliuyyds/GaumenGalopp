from fastapi import APIRouter, Depends, HTTPException, status

from backend.services.menue_service import MenueService
from backend.schemas import menue_schema as schemas
from backend.database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/menue", tags=["menue"])

@router.get("/", response_model=List[schemas.MenueResponse])
def get_all_menues(db: Session = Depends(get_db)):
    return MenueService(db).get_all()

@router.get("/{menueid}", response_model=schemas.MenueResponse)
def get_by_id(menueid: int, db: Session = Depends(get_db)):
    return MenueService(db).get_by_id(menueid)

@router.post("/", response_model=schemas.MenueResponse, status_code=status.HTTP_201_CREATED)
def create_menue(data: schemas.MenueCreate, db: Session = Depends(get_db)):
    return MenueService(db).create(data.model_dump())

@router.put("/{menueid}", response_model=schemas.MenueResponse)
def update_menue(menueid: int, data: schemas.MenueUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    menue = MenueService(db).update(menueid, update_data)
    if not menue:
        raise HTTPException(status_code=404, detail="Menue nicht gefunden")
    return menue

@router.delete("/{menueid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menue(menueid: int, db: Session = Depends(get_db)):
    success = MenueService(db).delete(menueid)
    if not success:
        raise HTTPException(status_code=404, detail="Menue nicht gefunden")
    return None