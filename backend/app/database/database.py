# Import the function to create a database engine
from sqlalchemy import create_engine

# Import sessionmaker to manage database sessions
from sqlalchemy.orm import sessionmaker

# Import the Base class used by all database models
from app.database.base import Base

# SQLite database file location
DATABASE_URL = "sqlite:///./smartbin.db"

# Create the database engine
# check_same_thread=False allows SQLite to work with FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create a factory for database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Provide a database session to API routes
def get_db():
    db = SessionLocal()
    try:
        # Return the session to the route
        yield db
    finally:
        # Always close the session after use
        db.close()
