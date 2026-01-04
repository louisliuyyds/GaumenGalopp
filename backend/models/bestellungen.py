from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Bestellungen(Base):
    __tablename__= 'bestellung'
    bestellungid = Column(Integer, primary_key=True, index=True)
    kundenid = Column(Integer, ForeignKey('kunde.kundenid'), nullable=False)
    restaurantid = Column(Integer, ForeignKey('restaurant.restaurantid'), nullable=True)
    lieferantid = Column(Integer, ForeignKey('lieferant.lieferantid'), nullable=True)
    adressid = Column(Integer, ForeignKey('adresse.adresseid'), nullable=True)
    bestellzeit = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)

    bestellposition = relationship("Bestellposition", back_populates="bestellungen")
    kunde = relationship("Kunde", back_populates="bestellungen")
    restaurant = relationship("Restaurant", back_populates="bestellungen")
    lieferant = relationship("Lieferant", back_populates="bestellungen")
    adresse = relationship("Adresse", back_populates="bestellungen")

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
