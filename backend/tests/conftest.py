import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("MODEL_BACKEND", "mock")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")


@pytest.fixture
def client() -> TestClient:
    from app.main import create_app

    app = create_app()
    with TestClient(app) as c:
        yield c
