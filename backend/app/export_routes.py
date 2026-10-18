import io
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.export_service import export_bins_csv

router = APIRouter(
    prefix="/api/export",
    tags=["Data Export"]
)


@router.get("/bins.csv")
def download_bins_csv(db: Session = Depends(get_db)):
    csv_data = export_bins_csv(db)

    filename = "smartbin_report.csv"

    return StreamingResponse(
        io.BytesIO(csv_data.encode("utf-8")),
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
