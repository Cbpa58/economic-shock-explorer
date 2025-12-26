from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.fred import get_fred_series
from app.services.analysis import shock_summary
from app.shocks import SHOCKS
from app.services.interpretation import interpret_unemployment, interpret_cpi

app = FastAPI(title="Economic Shock Explorer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---
@app.get("/indicator/{series_id}")
def get_indicator(series_id: str):
    df = get_fred_series(series_id.upper())
    return df.to_dict(orient="records")

@app.get("/shock/{shock}/{series_id}")
def analyze_shock(shock: str, series_id: str):
    shock_meta = SHOCKS.get(shock)
    if not shock_meta:
        raise HTTPException(status_code=404, detail="Unknown shock")

    df = get_fred_series(series_id.upper())

    # Fix: pass the whole shock dictionary
    summary = shock_summary(df, shock_meta)

    # Pick interpretation function based on indicator
    if "UNRATE" in series_id.upper():
        interpretation = interpret_unemployment(summary)
    elif "CPI" in series_id.upper():
        interpretation = interpret_cpi(summary)
    else:
        interpretation = "No interpretation available for this series."

    return {
        "shock": shock,
        "indicator": series_id.upper(),
        "summary": summary,
        "interpretation": interpretation
    }

@app.get("/chart/{series_id}")
def get_chart_data(series_id: str, shock: str = "covid"):
    series_id = series_id.upper()
    df = get_fred_series(series_id)
    shock_meta = SHOCKS.get(shock)
    
    if not shock_meta:
        return {"data": df.to_dict("records"), "shock": None}

    # Map to start/end for frontend
    shading_meta = {
        "start": shock_meta["post_start"],
        "end": shock_meta["post_end"],
        "name": shock.capitalize()  # optional
    }

    return {
        "data": df.to_dict("records"),
        "shock": shading_meta
    }
