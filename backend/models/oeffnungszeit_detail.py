# models/oeffnungszeit_detail.py
from sqlalchemy import Column, Integer, Time, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class OeffnungszeitDetail(Base):
    __tablename__ = 'oeffnungszeit_detail'
    
    detailID = Column(Integer, primary_key=True, autoincrement=True)
    oeffnungszeitID = Column(Integer, ForeignKey('oeffnungszeit_vorlage.oeffnungszeitID'), nullable=False)
    wochentag = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    oeffnungszeit = Column(Time)
    schliessungszeit = Column(Time)
    ist_geschlossen = Column(Boolean, default=False)
    
    # Relationships
    vorlage = relationship("OeffnungszeitVorlage", back_populates="details")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "detailID": self.detailID,
            "oeffnungszeitID": self.oeffnungszeitID,
            "wochentag": self.wochentag,
            "oeffnungszeit": self.oeffnungszeit.isoformat() if self.oeffnungszeit else None,
            "schliessungszeit": self.schliessungszeit.isoformat() if self.schliessungszeit else None,
            "ist_geschlossen": self.ist_geschlossen
        }