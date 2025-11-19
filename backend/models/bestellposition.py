from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from Code.backend.database import Base

class Bestellposition(Base):

    __tablename__ = 'bestellpositionen'

    positionid = Column(Integer, primary_key=True, index=True)


    menge = Column(Integer, nullable=False, default=1)


    aenderungswunsch = Column(String(255), nullable=True)


    bestellungid = Column(Integer, ForeignKey('bestellungen.bestellungid'), nullable=False)
    bestellung = relationship("Bestellung", back_populates="positionen")


    gerichtid: int = Column(Integer, ForeignKey('menue.menueid'), nullable=False)
    gericht = relationship("Menue", back_populates="positionen")


    preisid = Column(Integer, ForeignKey('preise.preiseid'), nullable=False)
    preis = relationship("Preis", back_populates="positionen")

    def to_dict(self):
        """Wandelt das Objekt in ein Dictionary um."""
        return {
            "id": self.id,
            "menge": self.menge,
            "aenderungswunsch": self.aenderungswunsch,
            "bestellung_id": self.bestellungid,
            "gericht_id": self.gerichtid
        }
