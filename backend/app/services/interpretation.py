def interpret_unemployment(summary: dict):
    delta = summary["post_period"]["mean"] - summary["pre_period"]["mean"]

    if delta > 1:
        direction = "increased sharply"
    elif delta > 0:
        direction = "increased moderately"
    else:
        direction = "remained stable"

    return (
        f"Average unemployment {direction} following the COVID-19 shock"
    )

def interpret_cpi(summary: dict):
    delta = summary["post_period"]["mean"] - summary["pre_period"]["mean"]

    if delta > 10:
        return (
            "Average consumer prices rose significantly following the COVID-19 shock, "
            "reflecting supply constraints and subsequent demand recovery."
        )

    return "Consumer price changes remained relatively contained during the immediate post-COVID period."
