# simple connection test and seeding
from database import engine, get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from models.adresse import Adresse
from models.kunde import Kunde
from datetime import date

def seed_test_data():
    with Session(engine) as db:
        # Check if test data already exists
        existing_adresse = db.query(Adresse).filter(Adresse.straße == 'Musterstrasse').first()
        if existing_adresse:
            print("Test data already exists")
            return

        # Create test address
        test_adresse = Adresse(
            straße='Musterstrasse',
            land='Deutschland',
            ort='Musterstadt',
            hausnummer='1',
            postleitzahl='12345'
        )
        db.add(test_adresse)
        db.commit()
        db.refresh(test_adresse)

        # Create test customer
        test_kunde = Kunde(
            vorname='Max',
            nachname='Mustermann',
            adressid=test_adresse.adresseid,
            geburtsdatum=date(1990, 1, 1),
            telefonnummer='0123456789',
            email='max@example.com',
            namenskuerzel='MM'
        )
        db.add(test_kunde)
        db.commit()
        print("Test data seeded successfully")

if __name__ == "__main__":
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connected!")

    seed_test_data()