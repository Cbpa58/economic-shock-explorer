import pandas as pd

def slice_timeseries(df: pd.DataFrame, start=None, end=None):
    if start:
        df = df[df["date"] >= pd.to_datetime(start)]
    if end:
        df = df[df["date"] <= pd.to_datetime(end)]

    return df.sort_values("date")
