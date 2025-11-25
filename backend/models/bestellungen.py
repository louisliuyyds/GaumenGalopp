from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Bestellungen(Base):
    __tablename__= 'bestellungen'
    bestellungid = Column(Integer, primary_key=True, index=True)

    kundenid = Column(Integer, ForeignKey('kunde.kundenid'), nullable=False)
    kunde = relationship("Kunde", back_populates="bewertungen")

    restaurantid = Column(Integer, ForeignKey('restaurant.restaurantid'), nullable=False)
    restaurant = relationship("Restaurant", back_populates="bestellungen")

    lieferantid = Column(Integer, ForeignKey('lieferant.lieferantid'), nullable= False)
    lieferant = relationship("Lieferant", back_populates="bestellungen")

    adressid = Column(Integer, ForeignKey('adresse.adresseid'), nullable=False)
    adresse = relationship("Adresse", back_populates="bestellungen")

    bestellzeit = Column(DateTime(timezone=True), server_default=func.now())

    bestellposition = relationship("Bestellposition", back_populates="bestellungen")


    status= Column(String(50), nullable=False)

    def to_dict(self):
        """Wandelt das Objekt in ein Dictionary um."""
        return {
            "bestellungid": self.bestellungid,
            "status": self.status,
            "bestellzeit": self.bestellzeit.isoformat() if self.bestellzeit else None,
            "kunden_id": self.kundenid,
            "restaurant_id": self.restaurantid,
            "lieferant_id": self.lieferantid,
            "adress_id": self.adressid
        }
