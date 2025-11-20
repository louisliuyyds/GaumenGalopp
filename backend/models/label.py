from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Label(Base):
    __tablename__ = 'label'
    labelid = Column(Integer, primary_key=True, autoincrement=True)
    labelname = Column(String(100))
    beschreibung = Column(String)

    labelgericht = relationship("LabelGericht", back_populates="label")

    def to_dict(self):
        return {
            "labelid": self.labelid,
            "labelname": self.labelname,
            "beschreibung": self.beschreibung,
        }
