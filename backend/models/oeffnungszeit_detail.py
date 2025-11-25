from sqlalchemy import Column, Integer, Time, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class OeffnungszeitDetail(Base):
    __tablename__ = 'oeffnungszeit_detail'
    
    detailid = Column(Integer, primary_key=True, autoincrement=True)
    oeffnungszeitid = Column(Integer, ForeignKey('oeffnungszeit_vorlage.oeffnungszeitid'), nullable=False)
    wochentag = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    oeffnungszeit = Column(Time)
    schliessungszeit = Column(Time)
    ist_geschlossen = Column(Boolean, default=False)
    
    # Relationships
    vorlage = relationship("OeffnungszeitVorlage", back_populates="details")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "detailid": self.detailid,
            "oeffnungszeitid": self.oeffnungszeitid,
            "wochentag": self.wochentag,
            "oeffnungszeit": self.oeffnungszeit.isoformat() if self.oeffnungszeit else None,
            "schliessungszeit": self.schliessungszeit.isoformat() if self.schliessungszeit else None,
            "ist_geschlossen": self.ist_geschlossen
        }