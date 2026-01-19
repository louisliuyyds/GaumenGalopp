from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.oeffnungszeit_detail_service import OeffnungszeitDetailService
from schemas.oeffnungszeit_detail_schema import OeffnungszeitDetailCreate, OeffnungszeitDetailUpdate, OeffnungszeitDetailResponse

router = APIRouter(
    prefix="/api/oeffnungszeit-details",
    tags=["oeffnungszeit-details"]
)

# GET /api/oeffnungszeit-details - Get all oeffnungszeit_details
@router.get("/", response_model=List[OeffnungszeitDetailResponse])
def get_all_oeffnungszeit_details(db: Session = Depends(get_db)):
    service = OeffnungszeitDetailService(db)
    details = service.get_all()
    return details

# GET /api/oeffnungszeit-details/{id} - Get specific oeffnungszeit_detail
@router.get("/{detailid}", response_model=OeffnungszeitDetailResponse)
def get_oeffnungszeit_detail(detailid: int, db: Session = Depends(get_db)):
    service = OeffnungszeitDetailService(db)
    detail = service.get_by_id(detailid)
    
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitDetail with id {detailid} not found"
        )
    
    return detail

# GET /api/oeffnungszeit-details/vorlage/{oeffnungszeit_id} - Get details for template
@router.get("/vorlage/{oeffnungszeitid}", response_model=List[OeffnungszeitDetailResponse])
def get_details_for_vorlage(oeffnungszeitid: int, db: Session = Depends(get_db)):
    service = OeffnungszeitDetailService(db)
    details = service.get_by_vorlage_id(oeffnungszeitid)
    return details

# POST /api/oeffnungszeit-details - Create new oeffnungszeit_detail
@router.post("/", response_model=OeffnungszeitDetailResponse, status_code=status.HTTP_201_CREATED)
def create_oeffnungszeit_detail(
    detail: OeffnungszeitDetailCreate,
    db: Session = Depends(get_db)
):
    service = OeffnungszeitDetailService(db)
    new_detail = service.create(detail.model_dump())
    return new_detail

# PUT /api/oeffnungszeit-details/{id} - Update oeffnungszeit_detail
@router.put("/{detailid}", response_model=OeffnungszeitDetailResponse)
def update_oeffnungszeit_detail(
    detailid: int,
    detailupdate: OeffnungszeitDetailUpdate,
    db: Session = Depends(get_db)
):
    service = OeffnungszeitDetailService(db)
    updated_detail = service.update(
        detailid,
        detailupdate.model_dump(exclude_unset=True)
    )
    
    if not updated_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitDetail with id {detailid} not found"
        )
    
    return updated_detail

# DELETE /api/oeffnungszeit-details/{id} - Delete oeffnungszeit_detail
@router.delete("/{detailid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_oeffnungszeit_detail(detailid: int, db: Session = Depends(get_db)):
    service = OeffnungszeitDetailService(db)
    success = service.delete(detailid)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitDetail with id {detailid} not found"
        )
    
    return None