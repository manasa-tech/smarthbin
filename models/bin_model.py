def calculate_status(fill_level):
    """
    Determine the bin status based on its fill percentage.
    """
    if fill_level >= 90:
        return "Overflowing"
    elif fill_level >= 70:
        return "Nearly Full"
    else:
        return "Normal"


def serialize_bin(row):
    """
    Convert a database row into a dictionary.
    """
    return dict(row)
