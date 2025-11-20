from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Gericht(Base):
    __tablename__ = 'gericht'
    gerichtid = Column(Integer, primary_key=True, autoincrement=True)
    menueid = Column(Integer, ForeignKey('menue.menueid'))
    name = Column(String(255))
    beschreibung = Column(String)
    kategorie = Column(String(50))

    menue = relationship("Menue", back_populates="gericht")
    labelGericht = relationship("LabelGericht", back_populates="gericht")

    def to_dict(self):
        return {
            "gerichtid": self.gerichtid,
            "name": self.name,
            "beschreibung": self.beschreibung,
            "kategorie": self.kategorie,
            "menue": self.menue.to_dict() if self.menue else None
        }
