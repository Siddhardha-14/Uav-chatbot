def test_labels_shape(client):
    r = client.get("/labels")
    assert r.status_code == 200
    data = r.json()
    assert "labels" in data
    assert "domains" in data
    assert "label_to_domain" in data
    assert len(data["labels"]) == 4
    assert "agriculture" in data["labels"]
