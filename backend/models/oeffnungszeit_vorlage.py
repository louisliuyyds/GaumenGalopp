from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class OeffnungszeitVorlage(Base):
    __tablename__ = 'oeffnungszeit_vorlage'
    
    oeffnungszeitID = Column(Integer, primary_key=True, autoincrement=True)
    bezeichnung = Column(String(255), nullable=False)
    beschreibung = Column(String(1000))
    
    # Relationships
    details = relationship("OeffnungszeitDetail", back_populates="vorlage")
    restaurant_zuordnungen = relationship("RestaurantOeffnungszeit", back_populates="vorlage")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "oeffnungszeitID": self.oeffnungszeitID,
            "bezeichnung": self.bezeichnung,
            "beschreibung": self.beschreibung
        }