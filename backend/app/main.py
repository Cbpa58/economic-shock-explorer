from app.services.fred import fetch_series
from app.shock_periods import SHOCKS
from fastapi import FastAPI
from typing import Optional
import pandas as pd

from app.services.analysis import shock_summary
from app.models.shocks import COVID_SHOCK
from app.services.fred import fetch_series
from app.services.interpretation import interpret_unemployment

from app.services.timeseries import slice_timeseries
from app.models.shocks import COVID_SHOCK




app = FastAPI(title="Economic Shock Explorer API")

@app.get("/indicator/{series_id}")
def get_indicator(series_id: str):
    df = fetch_series(series_id)
    return df.to_dict(orient="records")

@app.get("/shock/covid/{series_id}")
def covid_impact(series_id: str):
    series_id = series_id.upper()  # 🔑 normalize input

    df = fetch_series(series_id)
    summary = shock_summary(df, COVID_SHOCK)

    interpretation = None
    if series_id == "UNRATE":
        interpretation = interpret_unemployment(summary)

    return {
        "shock": "COVID-19",
        "indicator": series_id,
        "summary": summary,
        "interpretation": interpretation
    }

@app.get("/chart/{series_id}")
def chart_data(series_id: str):
    series_id = series_id.upper()

    df = fetch_series(series_id)
    df = slice_timeseries(df, start="2015-01-01")

    return {
        "indicator": series_id,
        "data": df.to_dict(orient="records"),
        "shock": {
            "name": COVID_SHOCK["name"],
            "start": COVID_SHOCK["start"],
            "end": COVID_SHOCK["post_end"]
        }
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
