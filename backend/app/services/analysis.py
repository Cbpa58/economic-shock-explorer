import pandas as pd

def compute_shock_impact(df, pre_period, shock_period):
    pre_start, pre_end = pre_period
    shock_start, shock_end = shock_period

    # Initialize period column
    df['period'] = 'post-shock'

    # Apply masks
    mask_pre = (df['date'] >= pd.to_datetime(pre_start)) & (df['date'] <= pd.to_datetime(pre_end))
    df.loc[mask_pre, 'period'] = 'pre-shock'

    mask_shock = (df['date'] >= pd.to_datetime(shock_start)) & (df['date'] <= pd.to_datetime(shock_end))
    df.loc[mask_shock, 'period'] = 'shock'

    # Compute pre-shock mean using only pre-shock rows
    pre_mean = df.loc[df['period'] == 'pre-shock', 'value'].mean()
    df['pct_change_from_pre'] = ((df['value'] - pre_mean) / pre_mean) * 100

    print(df[['date', 'value', 'period', 'pct_change_from_pre']].head(24))

    return df
