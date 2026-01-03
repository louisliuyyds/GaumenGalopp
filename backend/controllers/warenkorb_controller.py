# controllers/warenkorb_controller.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from services.warenkorb_service import WarenkorbService
from schemas.warenkorb_schema import (
    AddItemRequest,
    UpdateQuantityRequest,
    UpdateSpecialRequestRequest,
    CheckoutRequest,
    CartResponse
)

router = APIRouter(
    prefix="/api/warenkorb",
    tags=["warenkorb"]
)

# GET /api/warenkorb/{kundenid} - Get cart
@router.get("/{kundenid}", response_model=CartResponse)
def get_cart(kundenid: int, db: Session = Depends(get_db)):
    """Get customer's cart with all items"""
    service = WarenkorbService(db)
    return service.get_cart_items(kundenid)

# POST /api/warenkorb/{kundenid}/items - Add item
@router.post("/{kundenid}/items", response_model=CartResponse)
def add_item(
        kundenid: int,
        item: AddItemRequest,
        db: Session = Depends(get_db)
):
    """Add item to cart"""
    service = WarenkorbService(db)
    try:
        return service.add_item(
            kundenid=kundenid,
            restaurantid=item.restaurantid,
            gerichtid=item.gerichtid,
            preisid=item.preisid,
            menge=item.menge,
            aenderungswunsch=item.aenderungswunsch
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# PUT /api/warenkorb/{kundenid}/items/{positionid}/quantity
@router.put("/{kundenid}/items/{positionid}/quantity", response_model=CartResponse)
def update_quantity(
        kundenid: int,
        positionid: int,
        update: UpdateQuantityRequest,
        db: Session = Depends(get_db)
):
    """Update item quantity"""
    service = WarenkorbService(db)
    try:
        return service.update_quantity(kundenid, positionid, update.menge)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# PUT /api/warenkorb/{kundenid}/items/{positionid}/notes
@router.put("/{kundenid}/items/{positionid}/notes", response_model=CartResponse)
def update_notes(
        kundenid: int,
        positionid: int,
        update: UpdateSpecialRequestRequest,
        db: Session = Depends(get_db)
):
    """Update special request/notes"""
    service = WarenkorbService(db)
    try:
        return service.update_special_request(kundenid, positionid, update.aenderungswunsch)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# DELETE /api/warenkorb/{kundenid}/items/{positionid}
@router.delete("/{kundenid}/items/{positionid}", response_model=CartResponse)
def remove_item(
        kundenid: int,
        positionid: int,
        db: Session = Depends(get_db)
):
    """Remove item from cart"""
    service = WarenkorbService(db)
    return service.remove_item(kundenid, positionid)

# DELETE /api/warenkorb/{kundenid}/clear
@router.delete("/{kundenid}/clear")
def clear_cart(kundenid: int, db: Session = Depends(get_db)):
    """Clear all items from cart"""
    service = WarenkorbService(db)
    return service.clear_cart(kundenid)

# POST /api/warenkorb/{kundenid}/checkout
@router.post("/{kundenid}/checkout")
def checkout(
        kundenid: int,
        checkout_data: CheckoutRequest,
        db: Session = Depends(get_db)
):
    """Convert cart to order"""
    service = WarenkorbService(db)
    try:
        order = service.checkout(
            kundenid=kundenid,
            adressid=checkout_data.adressid,
            lieferantid=checkout_data.lieferantid
        )
        return {
            "message": "Order placed successfully",
            "bestellungid": order.bestellungid,
            "status": order.status
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))