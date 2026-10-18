from sqlalchemy.orm import Session
from app.models.bin_model import Bin


def get_bin_summary(db: Session):
    """Return a summary of bins using the database."""

    bins = db.query(Bin).all()

    if not bins:
        return {
            "total_bins": 0,
            "full_bins": 0,
            "average_fill_level": 0,
            "bins": []
        }

    bin_details = []

    for bin_item in bins:
        bin_details.append({
            "id": bin_item.id,
            "name": bin_item.name,
            "fill_level": bin_item.fill_level,
            "capacity_l": bin_item.capacity_l,
            "priority": bin_item.priority,
            "lat": bin_item.lat,
            "lng": bin_item.lng
        })

    average_fill = sum(
        item["fill_level"] for item in bin_details
    ) / len(bin_details)

    full_bins = sum(
        1 for item in bin_details
        if item["fill_level"] >= 80
    )

    return {
        "total_bins": len(bin_details),
        "full_bins": full_bins,
        "average_fill_level": round(average_fill, 2),
        "bins": bin_details
    }


def get_priority_bins(db: Session):
    """Return bins that need collection soon."""

    bins = (
        db.query(Bin)
        .filter(Bin.fill_level >= 80)
        .order_by(Bin.fill_level.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "fill_level": item.fill_level,
            "priority": item.priority
        }
        for item in bins
    ]
