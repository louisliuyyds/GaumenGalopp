from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Adresse(Base):
    __tablename__ = 'adresse'

    adresseid = Column(Integer, primary_key=True, autoincrement=True)
    straße = Column(String(100), nullable=False)
    land = Column(String(100), nullable=False)
    ort = Column(String(100), nullable=False)
    hausnummer = Column(String(10), nullable=False)
    postleitzahl = Column(String(10), nullable=False)

    kunden = relationship("Kunde", back_populates="adresse")
    restaurant = relationship("Restaurant", back_populates="adresse")
    bestellungen = relationship("Bestellungen", back_populates="adresse")

    def to_dict(self):
        return {
            "adresseid": self.adresseid,
            "straße": self.straße,
            "land": self.land,
            "ort": self.ort,
            "hausnummer": self.hausnummer,
            "postleitzahl": self.postleitzahl
        }