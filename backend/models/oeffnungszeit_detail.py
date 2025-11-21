from sqlalchemy import Column, Integer, Boolean, Time, ForeignKey
from sqlalchemy.orm import relationship
from ...backend.database import Base

class OeffnungszeitDetail(Base):
    __tablename__ = "oeffnungszeit_detail"
    detailid = Column(Integer, primary_key=True)
    oeffnungszeitid = Column(Integer, ForeignKey("oeffnungszeit_vorlage.oeffnungszeitid"))
    wochentag = Column(Integer)
    oeffnungszeit = Column(Time)
    schliessungszeit = Column(Time)
    ist_geschlossen = Column(Boolean, default=False)

    vorlage = relationship("OeffnungszeitVorlage", back_populates="detail")

    def to_dict(self):
        return {
            "detailid": self.detailid,
            "oeffnungszeitid": self.oeffnungszeitid,
            "wochentag": self.wochentag,
            "oeffnungszeit": self.oeffnungszeit.strftime("%H:%M") if self.oeffnungszeit else None,
            "schliessungszeit": self.schliessungszeit.strftime("%H:%M") if self.schliessungszeit else None,
            "ist_geschlossen": self.ist_geschlossen,
            "vorlage": self.vorlage.to_dict() if self.vorlage else None
        }