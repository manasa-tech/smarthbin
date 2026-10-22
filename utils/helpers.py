from datetime import datetime


def get_current_timestamp():
    """Return the current local timestamp."""
    return datetime.now().isoformat(timespec="seconds")


def calculate_fill_percentage(current, capacity):
    """Calculate bin fill percentage safely."""
    if (
        not isinstance(current, (int, float))
        or isinstance(current, bool)
        or not isinstance(capacity, (int, float))
        or isinstance(capacity, bool)
        or capacity <= 0
        or current < 0
    ):
        return 0

    percentage = (current / capacity) * 100
    return round(min(percentage, 100), 1)


def get_bin_status(fill_level):
    """Return a status based on the bin fill level."""
    if not isinstance(fill_level, (int, float)) or isinstance(fill_level, bool):
        return "Unknown"

    if not 0 <= fill_level <= 100:
        return "Unknown"

    if fill_level >= 90:
        return "Overflowing"
    elif fill_level >= 70:
        return "Nearly Full"
    else:
        return "Normal"


def format_response(success, message, data=None):
    """Build a consistent API response."""
    response = {
        "success": success,
        "message": message
    }

    if data is not None:
        response["data"] = data

    return response
