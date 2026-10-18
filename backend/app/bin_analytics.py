from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.assistant_tools import get_bin_summary, get_priority_bins

router = APIRouter(
    prefix="/api/analytics",
    tags=["Bin Analytics"]
)


@router.get("/bins")
def bin_analytics(db: Session = Depends(get_db)):
    return get_bin_summary(db)


@router.get("/priority-bins")
def priority_bin_analytics(db: Session = Depends(get_db)):
    return {
        "priority_bins": get_priority_bins(db)
    }
