from fastapi import APIRouter, Depends, HTTPException, status

from services.menue_service import MenueService
from schemas import menue_schema as schemas
from database import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/api/menue", tags=["menue"])

@router.get("/", response_model=List[schemas.MenueResponse])
def get_all_menues(db: Session = Depends(get_db)):
    return MenueService(db).get_all()

@router.get("/{menuid}", response_model=schemas.MenueResponse)
def get_by_id(menuid: int, db: Session = Depends(get_db)):
    return MenueService(db).get_by_id(menuid)

@router.post("/", response_model=schemas.MenueResponse, status_code=status.HTTP_201_CREATED)
def create_menue(data: schemas.MenueCreate, db: Session = Depends(get_db)):
    return MenueService(db).create(data.model_dump())

@router.put("/{menuid}", response_model=schemas.MenueResponse)
def update_menue(menuid: int, data: schemas.MenueUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)

    menue = MenueService(db).update(menuid, update_data)
    if not menue:
        raise HTTPException(status_code=404, detail="Menue nicht gefunden")
    return menue

@router.delete("/{menuid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menue(menuid: int, db: Session = Depends(get_db)):
    success = MenueService(db).delete(menuid)
    if not success:
        raise HTTPException(status_code=404, detail="Menue nicht gefunden")
    return None