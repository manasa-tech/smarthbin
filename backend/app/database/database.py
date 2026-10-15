from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import Base, engine, get_db
from app.models.bin_model import Bin


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="SmartBin API",
    description="AI-powered smart waste management backend",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE SETUP
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# REQUEST MODEL
# ============================================================

class BinUpdate(BaseModel):
    fill_level: float


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_priority(fill_level: float) -> str:

    if fill_level >= 95:
        return "critical"

    if fill_level >= 80:
        return "high"

    if fill_level >= 60:
        return "medium"

    return "low"


def get_prediction(fill_level: float) -> float:
    """
    Simple prototype prediction.

    The current SmartBin prototype uses a transparent
    simulated growth rate rather than a trained forecasting model.
    """

    growth_rate = 8.0

    remaining = max(
        0,
        100 - fill_level
    )

    hours = remaining / growth_rate

    return round(hours, 1)


def format_bin(bin_data: Bin) -> dict:

    return {
        "id": bin_data.id,
        "name": bin_data.name,
        "lat": bin_data.lat,
        "lng": bin_data.lng,
        "capacity_l": bin_data.capacity_l,
        "fill_level": bin_data.fill_level,
        "priority": get_priority(bin_data.fill_level),
        "predicted_overflow_hours": get_prediction(
            bin_data.fill_level
        ),
        "updated_at": (
            bin_data.updated_at.isoformat()
            if bin_data.updated_at
            else None
        )
    }


# ============================================================
# INITIAL 18 BINS
# ============================================================

INITIAL_BINS = [
    {
        "id": 1,
        "name": "Bin 1",
        "lat": 12.9351,
        "lng": 77.5551,
        "capacity_l": 1200,
        "fill_level": 35
    },
    {
        "id": 2,
        "name": "Bin 2",
        "lat": 12.9368,
        "lng": 77.5582,
        "capacity_l": 1200,
        "fill_level": 72
    },
    {
        "id": 3,
        "name": "Bin 3",
        "lat": 12.9385,
        "lng": 77.5610,
        "capacity_l": 1200,
        "fill_level": 91
    },
    {
        "id": 4,
        "name": "Bin 4",
        "lat": 12.9402,
        "lng": 77.5640,
        "capacity_l": 1200,
        "fill_level": 48
    },
    {
        "id": 5,
        "name": "Bin 5",
        "lat": 12.9420,
        "lng": 77.5670,
        "capacity_l": 1200,
        "fill_level": 86
    },
    {
        "id": 6,
        "name": "Bin 6",
        "lat": 12.9440,
        "lng": 77.5700,
        "capacity_l": 1200,
        "fill_level": 64
    },
    {
        "id": 7,
        "name": "Bin 7",
        "lat": 12.9460,
        "lng": 77.5730,
        "capacity_l": 1200,
        "fill_level": 95
    },
    {
        "id": 8,
        "name": "Bin 8",
        "lat": 12.9480,
        "lng": 77.5760,
        "capacity_l": 1200,
        "fill_level": 28
    },
    {
        "id": 9,
        "name": "Bin 9",
        "lat": 12.9500,
        "lng": 77.5790,
        "capacity_l": 1200,
        "fill_level": 78
    },
    {
        "id": 10,
        "name": "Bin 10",
        "lat": 12.9520,
        "lng": 77.5820,
        "capacity_l": 1200,
        "fill_level": 54
    },
    {
        "id": 11,
        "name": "Bin 11",
        "lat": 12.9540,
        "lng": 77.5850,
        "capacity_l": 1200,
        "fill_level": 88
    },
    {
        "id": 12,
        "name": "Bin 12",
        "lat": 12.9560,
        "lng": 77.5880,
        "capacity_l": 1200,
        "fill_level": 42
    },
    {
        "id": 13,
        "name": "Bin 13",
        "lat": 12.9580,
        "lng": 77.5910,
        "capacity_l": 1200,
        "fill_level": 67
    },
    {
        "id": 14,
        "name": "Bin 14",
        "lat": 12.9600,
        "lng": 77.5940,
        "capacity_l": 1200,
        "fill_level": 93
    },
    {
        "id": 15,
        "name": "Bin 15",
        "lat": 12.9620,
        "lng": 77.5970,
        "capacity_l": 1200,
        "fill_level": 51
    },
    {
        "id": 16,
        "name": "Bin 16",
        "lat": 12.9640,
        "lng": 77.6000,
        "capacity_l": 1200,
        "fill_level": 82
    },
    {
        "id": 17,
        "name": "Bin 17",
        "lat": 12.9660,
        "lng": 77.6030,
        "capacity_l": 1200,
        "fill_level": 39
    },
    {
        "id": 18,
        "name": "Bin 18",
        "lat": 12.9680,
        "lng": 77.6060,
        "capacity_l": 1200,
        "fill_level": 97
    }
]


# ============================================================
# SEED DATABASE
# ============================================================

def seed_bins():

    db = get_db()

    session = next(db)

    try:

        existing_bins = session.query(Bin).count()

        if existing_bins > 0:
            return

        for data in INITIAL_BINS:

            bin_object = Bin(
                id=data["id"],
                name=data["name"],
                lat=data["lat"],
                lng=data["lng"],
                capacity_l=data["capacity_l"],
                fill_level=data["fill_level"],
                priority=get_priority(
                    data["fill_level"]
                ),
                updated_at=datetime.utcnow()
            )

            session.add(bin_object)

        session.commit()

    finally:
        session.close()


# Seed database when application starts
seed_bins()


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "SmartBin API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "service": "SmartBin API"
    }


# ============================================================
# GET ALL BINS
# ============================================================

@app.get("/api/bins")
def get_bins(
    db: Session = Depends(get_db)
):

    bins = (
        db
        .query(Bin)
        .order_by(Bin.id)
        .all()
    )

    return [
        format_bin(bin_data)
        for bin_data in bins
    ]


# ============================================================
# GET SINGLE BIN
# ============================================================

@app.get("/api/bins/{bin_id}")
def get_single_bin(
    bin_id: int,
    db: Session = Depends(get_db)
):

    bin_data = (
        db
        .query(Bin)
        .filter(Bin.id == bin_id)
        .first()
    )

    if not bin_data:

        raise HTTPException(
            status_code=404,
            detail="Bin not found"
        )

    return format_bin(bin_data)


# ============================================================
# UPDATE BIN FILL LEVEL
# ============================================================

@app.patch("/api/bins/{bin_id}")
def update_bin(
    bin_id: int,
    payload: BinUpdate,
    db: Session = Depends(get_db)
):

    # Validate fill level
    if payload.fill_level < 0 or payload.fill_level > 100:

        raise HTTPException(
            status_code=400,
            detail="Fill level must be between 0 and 100"
        )

    # Find bin
    bin_data = (
        db
        .query(Bin)
        .filter(Bin.id == bin_id)
        .first()
    )

    if not bin_data:

        raise HTTPException(
            status_code=404,
            detail="Bin not found"
        )

    # Update
    bin_data.fill_level = payload.fill_level

    bin_data.priority = get_priority(
        payload.fill_level
    )

    bin_data.updated_at = datetime.utcnow()

    db.commit()

    db.refresh(bin_data)

    return format_bin(bin_data)


# ============================================================
# GET PRIORITY BINS
# ============================================================

@app.get("/api/priority-bins")
def get_priority_bins(
    db: Session = Depends(get_db)
):

    bins = (
        db
        .query(Bin)
        .filter(Bin.fill_level >= 80)
        .order_by(
            Bin.fill_level.desc()
        )
        .all()
    )

    return [
        format_bin(bin_data)
        for bin_data in bins
    ]


# ============================================================
# DASHBOARD STATISTICS
# ============================================================

@app.get("/api/dashboard/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    bins = (
        db
        .query(Bin)
        .order_by(Bin.id)
        .all()
    )

    total_bins = len(bins)

    priority_bins = len([
        b for b in bins
        if b.fill_level >= 80
    ])

    average_fill = (
        sum(b.fill_level for b in bins)
        / total_bins
        if total_bins > 0
        else 0
    )

    critical_bins = len([
        b for b in bins
        if b.fill_level >= 95
    ])

    return {
        "total_bins": total_bins,
        "priority_bins": priority_bins,
        "critical_bins": critical_bins,
        "average_fill": round(
            average_fill,
            1
        )
    }