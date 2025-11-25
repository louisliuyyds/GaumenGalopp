from database import Base
from sqlalchemy import Column, Integer, SmallInteger, ForeignKey
from sqlalchemy.orm import relationship

class Bewertungkritiker(Base):
    __tablename__ = "bewertungkritiker"

    bewertungkritikerid = Column(Integer, primary_key=True, index=True)
    kritikerid = Column(Integer, ForeignKey("kritiker.kritikerid"))
    gerichtid = Column(Integer, ForeignKey("gericht.gerichtid"))
    rating = Column(SmallInteger)

    gericht = relationship("Gericht", back_populates="bewertungkritiker")
    kritiker = relationship("Kritiker", back_populates="bewertungkritiker")

    def to_dict(self):
        return {
            "bewertungkritikerid": self.bewertungkritikerid,
            "kritikerid": self.kritikerid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,
        }