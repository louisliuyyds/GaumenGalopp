from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Gericht(Base):
    __tablename__ = 'gericht'
    gerichtid = Column(Integer, primary_key=True, autoincrement=True)
    menuid = Column(Integer, ForeignKey('menue.menuid'))
    name = Column(String(255))
    beschreibung = Column(String)
    kategorie = Column(String(50))
    ist_aktiv = Column(Boolean, nullable=False, default=True, server_default="true")


    menue = relationship("Menue", back_populates="gericht")
    labelGericht = relationship("LabelGericht", back_populates="gericht")
    bewertung = relationship("Bewertung", back_populates="gericht")
    preis = relationship("Preis", back_populates="gericht")
    bestellposition = relationship("Bestellposition", back_populates="gericht")
    bewertungkritiker = relationship("Bewertungkritiker", back_populates="gericht")

    def to_dict(self):
        return {
            "gerichtid": self.gerichtid,
            "name": self.name,
            "beschreibung": self.beschreibung,
            "kategorie": self.kategorie,
            "ist_aktiv": self.ist_aktiv,
            "menue": self.menue.to_dict() if self.menue else None
        }
