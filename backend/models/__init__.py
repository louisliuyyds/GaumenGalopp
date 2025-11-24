# models/__init__.py
"""
Restaurant Management System - SQLAlchemy Models
All database models for the restaurant ordering and delivery system.
"""

from database import Base, engine

# Import all models
from models.adresse import Adresse
from models.kunde import Kunde
from models.restaurant import Restaurant
from models.menue import Menue
from models.gericht import Gericht
from models.bestellungen import Bestellungen
from models.bestellposition import Bestellposition
from models.lieferant import Lieferant
from models.preis import Preis
from models.bewertung import Bewertung
from models.kritiker import Kritiker
from models.bewertungkritiker import Bewertungkritiker
from models.label import Label
from models.labelGericht import LabelGericht
from models.kochstil import Kochstil
from models.kochstilrestaurant import KochstilRestaurant
from models.oeffnungszeit_vorlage import OeffnungszeitVorlage
from models.oeffnungszeit_detail import OeffnungszeitDetail
from models.restaurant_oeffnungszeit import RestaurantOeffnungszeit


# Export all models
__all__ = [
    'Adresse',
    'Kunde',
    'Restaurant',
    'Menue',
    'Gericht',
    'Bestellungen',
    'Bestellposition',
    'Lieferant',
    'Preis',
    'Bewertung',
    'Kritiker',
    'Bewertungkritiker',
    'Label',
    'LabelGericht',
    'Kochstil',
    'KochstilRestaurant',
    'OeffnungszeitVorlage',
    'OeffnungszeitDetail',
    'RestaurantOeffnungszeit'
]


def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Drop all tables from the database"""
    Base.metadata.drop_all(bind=engine)