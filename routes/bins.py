from flask import Blueprint, request, jsonify
from database import get_db
from models.bin_model import calculate_status
from datetime import datetime

bins_bp = Blueprint("bins", __name__, url_prefix="/api/bins")


@bins_bp.route("", methods=["GET"])
def get_bins():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM bins ORDER BY id"
        ).fetchall()

    return jsonify([dict(row) for row in rows])


@bins_bp.route("", methods=["POST"])
def create_bin():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    location = data.get("location")
    fill = data.get("fill_level", 0)

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "Valid name is required"}), 400

    if not isinstance(location, str) or not location.strip():
        return jsonify({"error": "Valid location is required"}), 400

    if (
        not isinstance(fill, int)
        or isinstance(fill, bool)
        or not 0 <= fill <= 100
    ):
        return jsonify({"error": "fill_level must be between 0 and 100"}), 400

    status = calculate_status(fill)
    now = datetime.now().isoformat(timespec="seconds")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO bins
            (name, location, fill_level, status, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name.strip(), location.strip(), fill, status, now)
        )
        bin_id = cursor.lastrowid

    return jsonify({
        "id": bin_id,
        "name": name.strip(),
        "location": location.strip(),
        "fill_level": fill,
        "status": status
    }), 201


@bins_bp.route("/<int:bin_id>", methods=["PATCH"])
def update_bin(bin_id):
    data = request.get_json(silent=True) or {}
    fill = data.get("fill_level")

    if (
        not isinstance(fill, int)
        or isinstance(fill, bool)
        or not 0 <= fill <= 100
    ):
        return jsonify({"error": "fill_level must be between 0 and 100"}), 400

    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM bins WHERE id = ?",
            (bin_id,)
        ).fetchone()

        if existing is None:
            return jsonify({"error": "Bin not found"}), 404

        status = calculate_status(fill)
        now = datetime.now().isoformat(timespec="seconds")

        conn.execute(
            """
            UPDATE bins
            SET fill_level = ?, status = ?, updated_at = ?
            WHERE id = ?
            """,
            (fill, status, now, bin_id)
        )

    return jsonify({
        "message": "Bin updated successfully",
        "id": bin_id,
        "fill_level": fill,
        "status": status
    })
