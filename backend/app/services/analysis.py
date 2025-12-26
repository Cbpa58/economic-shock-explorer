import pandas as pd

YEAR = pd.Timedelta(days=365)

def shock_summary(df: pd.DataFrame, shock: dict):
    pre_5y = df[(df["date"] >= pd.to_datetime(shock["pre_start"]) - 4*YEAR) & 
                (df["date"] <= pd.to_datetime(shock["pre_end"]))]
    
    during = df[(df["date"] >= pd.to_datetime(shock["post_start"])) & 
                (df["date"] <= pd.to_datetime(shock["post_end"]))]

    # Post 5y = 5 years after post_end
    post_5y = df[(df["date"] > pd.to_datetime(shock["post_end"])) & 
                 (df["date"] <= pd.to_datetime(shock["post_end"]) + 5*YEAR)]

    def summary_stats(sub_df):
        return {
            "mean": round(sub_df["value"].mean(), 2),
            "std": round(sub_df["value"].std(), 2),
            "min": round(sub_df["value"].min(), 2),
            "max": round(sub_df["value"].max(), 2),
        }

    return {
        "pre_5y": summary_stats(pre_5y),
        "during": summary_stats(during),
        "post_5y": summary_stats(post_5y),
    }
