def test_health_ok(client):
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["model_backend"] == "mock"
    assert "model_version" in data
    assert "version" in data
