from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class OeffnungszeitVorlage(Base):
    __tablename__ = 'oeffnungszeit_vorlage'
    
    oeffnungszeitid = Column(Integer, primary_key=True, autoincrement=True)
    bezeichnung = Column(String(255), nullable=False)
    beschreibung = Column(String(1000))
    hash_signatur = Column(String(64))

    # Relationships
    details = relationship("OeffnungszeitDetail", back_populates="vorlage")
    restaurant_zuordnungen = relationship("RestaurantOeffnungszeit", back_populates="vorlage")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "oeffnungszeitid": self.oeffnungszeitid,
            "bezeichnung": self.bezeichnung,
            "beschreibung": self.beschreibung,
            "hash_signatur": self.hash_signatur
        }