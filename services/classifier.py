def classify_waste(name):
    """
    Basic rule-based waste classifier.
    This is a starter classifier, not a trained machine-learning model.
    """
    if not isinstance(name, str) or not name.strip():
        return {
            "success": False,
            "error": "Please provide a waste item name."
        }

    item = name.strip().lower()

    categories = {
        "Wet": [
            "food", "vegetable", "fruit", "peel", "leftover",
            "coffee grounds", "tea leaves", "eggshell"
        ],
        "Dry": [
            "paper", "cardboard", "plastic bottle", "newspaper",
            "metal can", "glass bottle", "wrapper", "plastic"
        ],
        "Hazardous": [
            "battery", "bulb", "paint", "chemical", "medicine",
            "pesticide", "e-waste", "electronic waste"
        ]
    }

    for category, keywords in categories.items():
        if any(keyword in item for keyword in keywords):
            return {
                "success": True,
                "item": name.strip(),
                "category": category,
                "message": f"This item may belong in the {category} waste category."
            }

    return {
        "success": True,
        "item": name.strip(),
        "category": "Unknown",
        "message": (
            "Unable to classify this item confidently. "
            "Check your local waste-segregation guidelines."
        )
    }
