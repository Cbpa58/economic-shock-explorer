import pandas as pd

def shock_summary(df: pd.DataFrame, shock: dict):
    pre = df[
        (df["date"] >= pd.to_datetime(shock["pre_start"])) &
        (df["date"] <= pd.to_datetime(shock["pre_end"]))
    ]

    post = df[
        (df["date"] >= pd.to_datetime(shock["post_start"])) &
        (df["date"] <= pd.to_datetime(shock["post_end"]))
    ]

    return {
        "pre_period": {
            "mean": round(pre["value"].mean(), 2),
            "std": round(pre["value"].std(), 2),
        },
        "post_period": {
            "mean": round(post["value"].mean(), 2),
            "std": round(post["value"].std(), 2),
            "peak": round(post["value"].max(), 2),
        }
    }
