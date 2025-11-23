from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class LabelGericht(Base):
    __tablename__ = 'labelgericht'
    labelid = Column(Integer, ForeignKey('label.labelid'), primary_key=True)
    gerichtid = Column(Integer, ForeignKey('gericht.gerichtid'), primary_key=True)

    label = relationship("Label", back_populates="labelgericht")
    gericht = relationship("Gericht", back_populates="labelgericht")

    def to_dict(self):
        return {
            "labelid": self.labelid,
            "gerichtid": self.gerichtid,
            "label": self.label.to_dict() if self.label else None,
            "gericht": self.gericht.to_dict() if self.gericht else None
        }
