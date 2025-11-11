import math


def get_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the Haversine distance between two points on the Earth."""

    if not (lat1 and lon1 and lat2 and lon2):
        return 0

    R = 6371000  # Earth radius on meters

    # Convert degrees in radians
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    # Apply Haversine formula
    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
