import datetime
from sqlalchemy.orm import Session

from models import Restaurant
from models.bestellungen import Bestellungen
from models.bestellposition import Bestellposition
from models.gericht import Gericht
from models.preis import Preis
from typing import Optional, List, Dict

class WarenkorbService:
    def __init__(self, db: Session):
        self.db = db

    # ===== Get Cart (without creating) =====
    def get_cart(self, kundenid: int) -> Optional[Bestellungen]:
        """
        Get active cart for customer, returns None if doesn't exist
        """
        return self.db.query(Bestellungen).filter(
            Bestellungen.kundenid == kundenid,
            Bestellungen.status == "warenkorb"
        ).first()

    # ===== Get or Create Cart =====
    def get_or_create_cart(self, kundenid: int) -> Bestellungen:
        """
        Get active cart for customer, or create new one if none exists
        """
        # Find existing cart (status = "Warenkorb")
        cart = self.db.query(Bestellungen).filter(
            Bestellungen.kundenid == kundenid,
            Bestellungen.status == "warenkorb"
        ).first()

        if not cart:
            # Create new cart
            cart = Bestellungen(
                kundenid=kundenid,
                status="warenkorb",
                restaurantid=None,  # Will be set when first item added
                lieferantid=None,   # Will be set later
                adressid=None,   # Will be set at checkout
            )
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)

        return cart

    # ===== Get Cart Items =====
    def get_cart_items(self, kundenid: int) -> Dict:
        """
        Get all items in customer's cart with full details
        """
        cart = self.get_or_create_cart(kundenid)
        # Get all positions with gericht and preis details
        positions = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid
        ).all()

        items = []
        subtotal = 0.0

        for position in positions:
            gericht = position.gericht
            preis = position.preis

            item_total = float(preis.betrag) * position.menge
            subtotal += item_total

            items.append({
                "positionid": position.positionid,
                "gerichtid": gericht.gerichtid,
                "name": gericht.name,
                "beschreibung": gericht.beschreibung,
                "preis": float(preis.betrag),
                "menge": position.menge,
                "aenderungswunsch": position.aenderungswunsch,
                "item_total": item_total
            })
        if cart.restaurantid:
            restaurantname = self.db.query(Restaurant).filter(Restaurant.restaurantid == cart.restaurantid).first().name
        else: restaurantname = None

        return {
            "bestellungid": cart.bestellungid,
            "restaurantid": cart.restaurantid,
            "restaurantname": restaurantname,
            "items": items,
            "subtotal": subtotal,
            "item_count": sum(item['menge'] for item in items)
        }

    # ===== Add Item to Cart =====
    def add_item(self, kundenid: int, restaurantid: int, gerichtid: int,
                 preisid: int, menge: int = 1, aenderungswunsch: str = None) -> Dict:
        """
        Add item to cart (or update quantity if already exists)
        """
        cart = self.get_or_create_cart(kundenid)

        item_count = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid
        ).count()

        if item_count == 0:
            cart.restaurantid = restaurantid
            self.db.commit()

        # Check if same restaurant (can't mix restaurants in one order)
        elif cart.restaurantid != restaurantid:
            raise ValueError("Cannot add items from different restaurants to cart")

        # Check if item already in cart
        existing = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid,
            Bestellposition.gerichtid == gerichtid,
            Bestellposition.preisid == preisid
        ).first()

        if existing:
            # Update quantity
            existing.menge += menge
            if aenderungswunsch:
                existing.aenderungswunsch = aenderungswunsch
        else:
            # Add new position
            position = Bestellposition(
                bestellungid=cart.bestellungid,
                gerichtid=gerichtid,
                preisid=preisid,
                menge=menge,
                aenderungswunsch=aenderungswunsch
            )
            self.db.add(position)

        self.db.commit()
        return self.get_cart_items(kundenid)

    # ===== Update Item Quantity =====
    def update_quantity(self, kundenid: int, positionid: int, menge: int) -> Dict:
        """
        Update quantity of item in cart
        """
        # cart = self.get_or_create_cart(kundenid)

        cart = self.get_cart(kundenid)
        if not cart:
            raise ValueError("No cart found")

        position = self.db.query(Bestellposition).filter(
            Bestellposition.positionid == positionid,
            Bestellposition.bestellungid == cart.bestellungid
        ).first()

        if not position:
            raise ValueError("Item not found in cart")

        if menge <= 0:
            self.db.delete(position)
            self.db.flush()
        else:
            position.menge = menge

        remaining = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid
        ).count()

        if remaining == 0:
            # Cart is empty - reset restaurant ID
            cart.restaurantid = None

        self.db.commit()
        return self.get_cart_items(kundenid)

    # ===== Update Special Request =====
    def update_special_request(self, kundenid: int, positionid: int,
                               aenderungswunsch: str) -> Dict:
        """
        Update special request/notes for an item
        """
        cart = self.get_or_create_cart(kundenid)

        position = self.db.query(Bestellposition).filter(
            Bestellposition.positionid == positionid,
            Bestellposition.bestellungid == cart.bestellungid
        ).first()

        if not position:
            raise ValueError("Item not found in cart")

        position.aenderungswunsch = aenderungswunsch
        self.db.commit()

        return self.get_cart_items(kundenid)

    # ===== Remove Item =====
    def remove_item(self, kundenid: int, positionid: int) -> Dict:
        """
        Remove item from cart
        """
        # cart = self.get_or_create_cart(kundenid)

        cart = self.get_cart(kundenid)
        if not cart:
            return self.get_cart_items(kundenid)

        position = self.db.query(Bestellposition).filter(
            Bestellposition.positionid == positionid,
            Bestellposition.bestellungid == cart.bestellungid
        ).first()

        if not position:
            raise ValueError("Item not found in cart")

        self.db.delete(position)
        self.db.flush()

        remaining = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid
        ).count()

        if remaining == 0:
            # Cart is empty - reset restaurant ID
            cart.restaurantid = None

        self.db.commit()

        return self.get_cart_items(kundenid)

    # ===== Clear Cart =====
    def clear_cart(self, kundenid: int) -> Dict:
        """
        Remove all items from cart
        """
        cart = self.get_cart(kundenid)  # ← Uses get_cart() - no creation!

        if not cart:
            # No cart exists, return empty response
            return {"message": "Cart already empty", "items": [], "subtotal": 0.0, "item_count": 0}

        # Delete all positions first
        self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid
        ).delete()

        # Delete the cart itself
        self.db.delete(cart)

        self.db.commit()

        return {"message": "Cart cleared", "items": [], "subtotal": 0.0, "item_count": 0}

    # ===== Convert to Order =====
    def checkout(self, kundenid: int, adressid: int, lieferantid: int) -> Bestellungen:
        """
        Convert cart to actual order
        """
        cart = self.get_or_create_cart(kundenid)

        # Validate cart has items
        item_count = self.db.query(Bestellposition).filter(
            Bestellposition.bestellungid == cart.bestellungid
        ).count()

        if item_count == 0:
            raise ValueError("Cart is empty")

        # Update cart to order
        cart.status = "bestellt"
        cart.adressid = adressid
        cart.lieferantid = lieferantid

        self.db.commit()
        self.db.refresh(cart)

        return cart