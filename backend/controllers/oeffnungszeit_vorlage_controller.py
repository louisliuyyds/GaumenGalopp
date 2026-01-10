from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.oeffnungszeit_vorlage_service import OeffnungszeitVorlageService
from schemas.oeffnungszeit_vorlage_schema import OeffnungszeitVorlageCreate, OeffnungszeitVorlageUpdate, OeffnungszeitVorlageResponse
from utils.opening_hours_hash import generate_opening_hours_hash

router = APIRouter(
    prefix="/api/oeffnungszeit-vorlagen",
    tags=["oeffnungszeit-vorlagen"]
)

# GET /api/oeffnungszeit-vorlagen - Get all oeffnungszeit_vorlagen
@router.get("/", response_model=List[OeffnungszeitVorlageResponse])
def get_all_oeffnungszeit_vorlagen(db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    vorlagen = service.get_all()
    return vorlagen

# GET /api/oeffnungszeit-vorlagen/{id} - Get specific oeffnungszeit_vorlage
@router.get("/{oeffnungszeitid}", response_model=OeffnungszeitVorlageResponse)
def get_oeffnungszeit_vorlage(oeffnungszeitid: int, db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    vorlage = service.get_by_id(oeffnungszeitid)
    
    if not vorlage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitVorlage with id {oeffnungszeitid} not found"
        )
    
    return vorlage

# POST /api/oeffnungszeit-vorlagen - Create new oeffnungszeit_vorlage
@router.post("/", response_model=OeffnungszeitVorlageResponse, status_code=status.HTTP_201_CREATED)
def create_oeffnungszeit_vorlage(
    vorlage: OeffnungszeitVorlageCreate,
    db: Session = Depends(get_db)
):
    service = OeffnungszeitVorlageService(db)
    new_vorlage = service.create(vorlage.model_dump())
    return new_vorlage

# PUT /api/oeffnungszeit-vorlagen/{id} - Update oeffnungszeit_vorlage
@router.put("/{oeffnungszeitid}", response_model=OeffnungszeitVorlageResponse)
def update_oeffnungszeit_vorlage(
    oeffnungszeitid: int,
    vorlage_update: OeffnungszeitVorlageUpdate,
    db: Session = Depends(get_db)
):
    service = OeffnungszeitVorlageService(db)
    updated_vorlage = service.update(
        oeffnungszeitid,
        vorlage_update.model_dump(exclude_unset=True)
    )
    
    if not updated_vorlage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitVorlage with id {oeffnungszeitid} not found"
        )
    
    return updated_vorlage

# DELETE /api/oeffnungszeit-vorlagen/{id} - Delete oeffnungszeit_vorlage
@router.delete("/{oeffnungszeitid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_oeffnungszeit_vorlage(oeffnungszeitid: int, db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    success = service.delete(oeffnungszeitid)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OeffnungszeitVorlage with id {oeffnungszeitid} not found"
        )
    
    return None

# GET /api/oeffnungszeit-vorlagen/hash/{hash_signatur}
@router.get("/hash/{hash_signatur}", response_model=OeffnungszeitVorlageResponse)
def get_vorlage_by_hash(hash_signatur: str, db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    vorlage = service.find_by_hash(hash_signatur)

    if not vorlage:
        raise HTTPException(status_code=404, detail="Template not found")

    return vorlage

# POST /api/oeffnungszeit-vorlagen/with-hash
@router.post("/with-hash", response_model=OeffnungszeitVorlageResponse, status_code=201)
def create_vorlage_with_hash(data: dict, db: Session = Depends(get_db)):
    service = OeffnungszeitVorlageService(db)
    return service.create_with_hash(data['vorlage'], data['details'])

@router.post("/update-all-hashes", status_code=200)
def update_all_hashes(db: Session = Depends(get_db)):
    """Einmaliges Update aller Vorlagen mit Hashes"""
    from services.oeffnungszeit_detail_service import OeffnungszeitDetailService

    service = OeffnungszeitVorlageService(db)
    detail_service = OeffnungszeitDetailService(db)

    vorlagen = service.get_all()
    updated = 0

    for vorlage in vorlagen:
        if not vorlage.hash_signatur:
            details = detail_service.get_by_vorlage_id(vorlage.oeffnungszeitid)
            if details:
                details_list = [{"wochentag": d.wochentag, "oeffnungszeit": d.oeffnungszeit,
                                 "schliessungszeit": d.schliessungszeit, "ist_geschlossen": d.ist_geschlossen}
                                for d in details]
                hash_sig = generate_opening_hours_hash(details_list)
                vorlage.hash_signatur = hash_sig
                updated += 1

    db.commit()
    return {"updated": updated}