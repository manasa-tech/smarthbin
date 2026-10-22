from flask import Blueprint, jsonify
from database import get_db

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


@dashboard_bp.route("", methods=["GET"])
def get_dashboard():
    with get_db() as conn:
        total_bins = conn.execute(
            "SELECT COUNT(*) FROM bins"
        ).fetchone()[0]

        overflowing_bins = conn.execute(
            "SELECT COUNT(*) FROM bins WHERE fill_level >= 90"
        ).fetchone()[0]

        nearly_full_bins = conn.execute(
            "SELECT COUNT(*) FROM bins WHERE fill_level >= 70 AND fill_level < 90"
        ).fetchone()[0]

        normal_bins = conn.execute(
            "SELECT COUNT(*) FROM bins WHERE fill_level < 70"
        ).fetchone()[0]

        average_fill = conn.execute(
            "SELECT AVG(fill_level) FROM bins"
        ).fetchone()[0]

        total_reports = conn.execute(
            "SELECT COUNT(*) FROM reports"
        ).fetchone()[0]

        pending_reports = conn.execute(
            "SELECT COUNT(*) FROM reports WHERE status = 'Pending'"
        ).fetchone()[0]

        recent_bins = conn.execute(
            "SELECT * FROM bins ORDER BY updated_at DESC LIMIT 5"
        ).fetchall()

    return jsonify({
        "total_bins": total_bins,
        "overflowing_bins": overflowing_bins,
        "nearly_full_bins": nearly_full_bins,
        "normal_bins": normal_bins,
        "average_fill_level": round(average_fill or 0, 1),
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "recent_bins": [dict(row) for row in recent_bins]
    })
