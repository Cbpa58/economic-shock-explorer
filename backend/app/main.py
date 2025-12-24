from app.services.analysis import compute_shock_impact
from app.services.fred import fetch_series
from app.shock_periods import SHOCKS
from fastapi import FastAPI
from typing import Optional
import pandas as pd

app = FastAPI(title="Economic Shock Explorer API")

@app.get("/indicator/{series_id}")
def get_indicator(series_id: str):
    df = fetch_series(series_id)
    return df.to_dict(orient="records")
