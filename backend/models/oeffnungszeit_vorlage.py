from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ...backend.database import Base

class OeffnungszeitVorlage(Base):
    __tablename__ = 'oeffnungszeit_vorlage'
    oeffnungszeitid = Column(Integer, primary_key=True)
    bezeichnung = Column(String(100))
    beschreibung = Column(String)

    details = relationship("OeffnungszeitDetail", back_populates="vorlage")

    def to_dict(self):
        return {
            "oeffnungszeitid": self.oeffnungszeitid,
            "bezeichnung": self.bezeichnung,
            "beschreibung": self.beschreibung,
            "details": [d.to_dict() for d in self.details]
        }