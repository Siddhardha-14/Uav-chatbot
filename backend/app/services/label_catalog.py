"""Single source of truth for intent labels and domain display names."""

from dataclasses import dataclass


@dataclass(frozen=True)
class LabelInfo:
    label_id: str
    domain: str
    display_name: str


LABELS: tuple[LabelInfo, ...] = (
    LabelInfo("agriculture", "Agriculture", "Agriculture"),
    LabelInfo("defence_military", "Defence / military", "Defence / military"),
    LabelInfo("surveillance", "Surveillance", "Surveillance"),
    LabelInfo("rescue", "Rescue", "Rescue"),
)

LABEL_IDS: tuple[str, ...] = tuple(x.label_id for x in LABELS)
DOMAIN_BY_LABEL: dict[str, str] = {x.label_id: x.domain for x in LABELS}
DISPLAY_BY_LABEL: dict[str, str] = {x.label_id: x.display_name for x in LABELS}
UNIQUE_DOMAINS: tuple[str, ...] = tuple(dict.fromkeys(x.domain for x in LABELS))


def label_to_domain(label_id: str) -> str:
    if label_id not in DOMAIN_BY_LABEL:
        raise KeyError(f"Unknown label: {label_id}")
    return DOMAIN_BY_LABEL[label_id]
