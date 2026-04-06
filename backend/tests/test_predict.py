def test_predict_agriculture_cues(client):
    r = client.post("/predict", json={"text": "Inspect crop stress in the north field"})
    assert r.status_code == 200
    data = r.json()
    assert data["predicted_label"] == "agriculture"
    assert data["predicted_domain"] == "Agriculture"
    assert 0.0 <= data["confidence"] <= 1.0
    assert len(data["top_predictions"]) == 3
    assert "recommended_action" in data
    assert data["input_text"] == "Inspect crop stress in the north field"


def test_predict_defence_cues(client):
    r = client.post("/predict", json={"text": "Perform border reconnaissance over sector 7"})
    assert r.status_code == 200
    data = r.json()
    assert data["predicted_label"] == "defence_military"


def test_predict_empty_rejected(client):
    r = client.post("/predict", json={"text": "   "})
    assert r.status_code == 422
