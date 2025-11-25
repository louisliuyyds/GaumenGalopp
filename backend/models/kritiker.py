from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Kritiker(Base):
    __tablename__ = "kritiker"

    kritikerid = Column(Integer, primary_key=True, index=True)
    kundenid = Column(Integer, ForeignKey("kunde.kundenid"), nullable=False)
    beschreibung = Column(String(100))
    kritikername = Column(String(50))

    bewertungkritiker = relationship("Bewertungkritiker", back_populates="kritiker")
    kunde = relationship("Kunde", back_populates="kritiker")

def to_dict(self):
        return {
            "kritikerid": self.kritikerid,
            "kundenid": self.kundenid,
            "beschreibung": self.beschreibung,
            "kritikername": self.kritikername,            
        }