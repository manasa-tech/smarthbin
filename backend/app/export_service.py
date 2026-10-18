import csv
import io
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.bin_model import Bin


def export_bins_csv(db: Session) -> str:
    """Export current SmartBin database records as CSV."""

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Bin ID",
        "Bin Name",
        "Latitude",
        "Longitude",
        "Capacity (L)",
        "Fill Level (%)",
        "Priority",
        "Last Updated"
    ])

    bins = db.query(Bin).order_by(Bin.id).all()

    for bin_item in bins:
        writer.writerow([
            bin_item.id,
            bin_item.name,
            bin_item.lat,
            bin_item.lng,
            bin_item.capacity_l,
            bin_item.fill_level,
            bin_item.priority,
            bin_item.updated_at.isoformat()
            if bin_item.updated_at else ""
        ])

    return output.getvalue()
