from ..database import Base
from sqlalchemy import Column, Integer, SmallInteger, String, Date, ForeignKey
from sqlalchemy.orm import relationship

class Bewertungkritiker(Base):
    __tablename__ = "bewertungkritiker"

    bewertungkritikerid = Column("bewertungkritikerid", Integer, primary_key=True, index=True)
    kritikerid = Column("kritikerid", Integer, ForeignKey("KRITIKER.kritikerid"))
    gerichtid = Column("gerichtid", Integer, ForeignKey("GERICHT.gerichtID"))
    rating = Column("rating", SmallInteger)

    gericht = relationship("Gericht", back_populates="bewertungkritiker")
    kritiker = relationship("Kritiker", back_populates="bewertungkritiker")

    def to_dict(self):
        return {
            "bewertungkritikerid": self.bewertungkritikerid,
            "kritikerid": self.kritikerid,
            "gerichtid": self.gerichtid,
            "rating": self.rating,
        }