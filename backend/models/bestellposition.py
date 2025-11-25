from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Bestellposition(Base):

    __tablename__ = 'bestellpositionen'

    positionid = Column(Integer, primary_key=True, index=True)


    menge = Column(Integer, nullable=False, default=1)


    aenderungswunsch = Column(String(255), nullable=True)


    bestellungid = Column(Integer, ForeignKey('bestellungen.bestellungid'), nullable=False)
    bestellungen = relationship("Bestellungen", back_populates="bestellposition")


    gerichtid = Column(Integer, ForeignKey('gericht.gerichtid'), nullable=False)
    gericht = relationship("Gericht", back_populates="bestellposition")

    preisid = Column(Integer, ForeignKey('preis.preisid'), nullable=False)
    preis = relationship("Preis", back_populates="bestellposition")
    def to_dict(self):
        """Wandelt das Objekt in ein Dictionary um."""
        return {
            "id": self.positionid,
            "menge": self.menge,
            "aenderungswunsch": self.aenderungswunsch,
            "bestellung_id": self.bestellungid,
            "gericht_id": self.gerichtid
        }
