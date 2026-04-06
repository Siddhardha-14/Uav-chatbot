"""Rule-based operational recommendations per intent label (v1)."""

RECOMMENDED_ACTION_BY_LABEL: dict[str, str] = {
    "agriculture": (
        "Mission type: precision agriculture. Workflow: grid flight over the AOI at low altitude "
        "with overlap for mapping; capture multispectral or RGB depending on crop stress goals. "
        "Sensors: multispectral / RGB camera; consider NDVI analytics for crop health."
    ),
    "defence_military": (
        "Mission type: tactical ISR. Workflow: corridor or orbit pattern with standoff distance "
        "per ROE; maintain comms and alternate recovery. Sensors: EO/IR gimbal; optional laser "
        "rangefinder where permitted. Coordinate with airspace control."
    ),
    "surveillance": (
        "Mission type: persistent area surveillance. Workflow: loiter or racetrack with "
        "scheduled revisit; log timestamps and geo-tags for evidence chain. Sensors: stabilized "
        "EO/IR; consider wide-area motion imagery if available."
    ),
    "rescue": (
        "Mission type: search and rescue / disaster response. Workflow: expanding square or "
        "parallel track search with low speed and high overlap near hazards. Sensors: thermal + "
        "RGB; loudspeaker optional for hailing. Prioritize battery reserves and weather margins."
    ),
}


def recommendation_for_label(label_id: str) -> str:
    return RECOMMENDED_ACTION_BY_LABEL.get(
        label_id,
        "General UAV mission: plan a safe corridor, check NOTAMs/airspace, and match sensors "
        "to the stated objective.",
    )
