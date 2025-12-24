import requests
import pandas as pd

FRED_API_URL = "https://api.stlouisfed.org/fred/series/observations"
API_KEY = "635c054d32fb97ece1f60d487a2135a2"

def fetch_series(series_id):
    params = {
        "series_id": series_id,
        "api_key": API_KEY,
        "file_type": "json"
    }

    r = requests.get(FRED_API_URL, params=params)
    data = r.json()["observations"]

    df = pd.DataFrame(data)

    df["date"] = pd.to_datetime(df["date"])
    df["value"] = pd.to_numeric(df["value"], errors="coerce")

    # 🔑 THIS IS THE FIX
    df = df.dropna(subset=["value"])

    return df[["date", "value"]]

