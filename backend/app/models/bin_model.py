from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String
from app.database.base import Base


class Bin(Base):
    """SQLAlchemy model for a SmartBin waste bin."""

    __tablename__ = "bins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    capacity_l = Column(Float, nullable=False, default=1200)
    fill_level = Column(Float, nullable=False, default=0)
    priority = Column(String(20), nullable=False, default="low")
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

