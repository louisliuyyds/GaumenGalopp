from sqlalchemy import Column, Integer, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class RestaurantOeffnungszeit(Base):
    __tablename__ = 'restaurant_oeffnungszeit'
    
    restaurantID = Column(Integer, ForeignKey('restaurant.restaurantID'), primary_key=True)
    oeffnungszeitID = Column(Integer, ForeignKey('oeffnungszeit_vorlage.oeffnungszeitID'), primary_key=True)
    gueltig_von = Column(Date, primary_key=True)
    gueltig_bis = Column(Date)
    ist_aktiv = Column(Boolean, default=True)
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="oeffnungszeiten")
    vorlage = relationship("OeffnungszeitVorlage", back_populates="restaurant_zuordnungen")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "restaurantID": self.restaurantID,
            "oeffnungszeitID": self.oeffnungszeitID,
            "gueltig_von": self.gueltig_von.isoformat() if self.gueltig_von else None,
            "gueltig_bis": self.gueltig_bis.isoformat() if self.gueltig_bis else None,
            "ist_aktiv": self.ist_aktiv
        }