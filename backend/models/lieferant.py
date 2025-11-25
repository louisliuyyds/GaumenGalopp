from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Lieferant(Base):
    __tablename__='lieferant'

    lieferantid= Column(Integer, primary_key=True, index=True)

    vorname=Column(String(100), nullable=True)

    nachname= Column(String(100), nullable=True)

    telephone= Column(String(100), nullable=True)


    bestellungen = relationship("Bestellungen", back_populates="lieferant")

    def to_dict(self):
        """Wandelt das Objekt in ein Dictionary um."""
        return {
            "id": self.lieferantid,
            "vorname": self.vorname,
            "nachname": self.nachname,
            "telephone": self.telephone
        }

