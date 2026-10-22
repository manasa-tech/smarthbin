from flask import Blueprint, request, jsonify
from database import get_db

reports_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/api/reports"
)


@reports_bp.route("", methods=["GET"])
def get_reports():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM reports ORDER BY created_at DESC"
        ).fetchall()

    return jsonify([dict(row) for row in rows])


@reports_bp.route("", methods=["POST"])
def create_report():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    location = data.get("location")
    issue = data.get("issue")
    description = data.get("description", "")

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "Name is required"}), 400

    if not isinstance(location, str) or not location.strip():
        return jsonify({"error": "Location is required"}), 400

    if not isinstance(issue, str) or not issue.strip():
        return jsonify({"error": "Issue is required"}), 400

    if not isinstance(description, str):
        return jsonify({"error": "Description must be text"}), 400

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO reports
            (name, location, issue, description, status)
            VALUES (?, ?, ?, ?, 'Pending')
            """,
            (
                name.strip(),
                location.strip(),
                issue.strip(),
                description.strip()
            )
        )

        report_id = cursor.lastrowid

        report = conn.execute(
            "SELECT * FROM reports WHERE id = ?",
            (report_id,)
        ).fetchone()

    return jsonify(dict(report)), 201


@reports_bp.route("/<int:report_id>", methods=["PATCH"])
def update_report(report_id):
    data = request.get_json(silent=True) or {}
    status = data.get("status")

    allowed_statuses = ["Pending", "In Progress", "Resolved"]

    if status not in allowed_statuses:
        return jsonify({
            "error": "Status must be Pending, In Progress, or Resolved"
        }), 400

    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM reports WHERE id = ?",
            (report_id,)
        ).fetchone()

        if existing is None:
            return jsonify({"error": "Report not found"}), 404

        conn.execute(
            "UPDATE reports SET status = ? WHERE id = ?",
            (status, report_id)
        )

        updated = conn.execute(
            "SELECT * FROM reports WHERE id = ?",
            (report_id,)
        ).fetchone()

    return jsonify({
        "message": "Report updated successfully",
        "report": dict(updated)
    })
