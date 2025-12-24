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
