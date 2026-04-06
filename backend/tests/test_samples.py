def test_samples(client):
    r = client.get("/samples")
    assert r.status_code == 200
    data = r.json()
    assert "prompts" in data
    assert len(data["prompts"]) >= 12
