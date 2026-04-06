import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(tags=["samples"])

_DATA = Path(__file__).resolve().parents[3] / "data" / "sample_prompts.json"


@router.get("/samples")
async def samples() -> dict:
    raw = _DATA.read_text(encoding="utf-8")
    return json.loads(raw)
