def interpret_unemployment(summary):
    pre = summary["pre_5y"]["mean"]
    during = summary["during"]["mean"]
    post = summary["post_5y"]["mean"]

    delta_during = during - pre
    delta_post = post - pre

    direction = "increased" if delta_during > 0 else "decreased"

    return (
        f"Unemployment {direction} by "
        f"{abs(round(delta_during, 2))} percentage points during the shock. "
        f"Five years after the shock, unemployment was "
        f"{round(delta_post, 2)} points different compared to the pre-shock period."
    )


def interpret_cpi(summary):
    pre = summary["pre_5y"]["mean"]
    during = summary["during"]["mean"]
    post = summary["post_5y"]["mean"]

    delta_during = during - pre
    delta_post = post - pre

    return (
        f"Inflation changed by "
        f"{round(delta_during, 2)} points during the shock. "
        f"Five years after the shock, CPI was "
        f"{round(delta_post, 2)} points different compared to pre-shock levels."
    )
