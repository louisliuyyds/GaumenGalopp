from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create database engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models (uncomment when first mapping and controllers are implemented)
Base = declarative_base()

# Dependency for getting database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# try:
#     # Create engine
#     engine = create_engine(DATABASE_URL)
#
#     # Test connection
#     with engine.connect() as connection:
#         result = connection.execute(text("SELECT 1"))
#         print("✅ Database connection successful!")
#         print(f"Test query result: {result.fetchone()}")
#
#         # Get database version
#         version = connection.execute(text("SELECT version()"))
#         print(f"Database version: {version.fetchone()[0]}")
#
# except Exception as e:
#     print(f"❌ Database connection failed!")
#     print(f"Error: {e}")
