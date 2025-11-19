from sqlalchemy.orm import Session
from ..models.bestellung import Bestellung
from ..models.bestellposition import Bestellposition
from ..models.preis import Preis
from typing import List, Optional

class BestellungService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, bestellung_data: dict) -> Bestellung:
        """Muss-Kriterium: Verbindliche Bestellung anlegen."""
        new_bestellung = Bestellung(**bestellung_data)
        # Standard-Status ist im Model auf 'Eingegangen' gesetzt
        self.db.add(new_bestellung)
        self.db.commit()
        self.db.refresh(new_bestellung)
        return new_bestellung

    def get_by_id(self, bestellungid: int) -> Optional[Bestellung]:
        return self.db.query(Bestellung).filter(bestellungid == Bestellung.bestellungid).first()

    def get_all(self) -> List[Bestellung]:
        return self.db.query(Bestellung).all()

    # --- NEUE FUNKTIONEN FÜR MUSS-KRITERIEN ---

    def update_status(self, bestellungid: int, new_status: str) -> Optional[Bestellung]:
        """
        Erfüllt Muss-Kriterium: "Bestellstatus-Tracking".
        Status z.B.: 'In Zubereitung', 'Unterwegs', 'Geliefert'.
        """
        bestellung = self.get_by_id(bestellungid)
        if not bestellung:
            return None

        bestellung.status = new_status
        self.db.commit()
        self.db.refresh(bestellung)
        return bestellung

    def assign_lieferant(self, bestellungid: int, lieferantid: int) -> Optional[Bestellung]:
        """Weist einer Bestellung einen Fahrer zu."""
        bestellung = self.get_by_id(bestellungid)
        if not bestellung:
            return None

        bestellung.lieferantid = lieferantid
        bestellung.status = "Unterwegs" # Automatische Status-Änderung (optional)
        self.db.commit()
        self.db.refresh(bestellung)
        return bestellung

    def calculate_total(self, bestellungid: int) -> float:
        """
        1. Hole alle Positionen der Bestellung.
        2. Hole für jedes Gericht den AKTUELLEN Preis (istaktiv=True).
        3. Berechne Summe: Preis * Menge.
        """
        # 1. Positionen holen
        positionen = self.db.query(Bestellposition) \
            .filter(Bestellposition.bestellungid == bestellungid) \
            .all()

        total = 0.0

        for pos in positionen:
            # 2. Den aktiven Preis für das Gericht finden
            # Wir suchen in der Preis-Tabelle nach der gericht_id
            active_price = self.db.query(Preis) \
                .filter(Preis.gerichtid == pos.gerichtid) \
                .filter(Preis.istaktiv == True) \
                .first()

            if active_price:
                # 3. Addieren (Menge * Betrag)
                # Hinweis: active_price.betrag ist 'Numeric', wir wandeln es in float um für die API
                preis_wert = float(active_price.betrag)
                total += (preis_wert * pos.menge)
            else:
                # Fallback, falls kein Preis gefunden wurde (sollte nicht passieren)
                print(f"Warnung: Kein aktiver Preis für Gericht ID {pos.gerichtid} gefunden.")

        return round(total, 2) # Auf 2 Nachkommastellen runden