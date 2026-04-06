from app.services.inference.mock import MockInferenceService


def test_mock_top_three():
    svc = MockInferenceService()
    out = svc.predict("search for survivors near the flooded riverbank")
    assert len(out.top_predictions) == 3
    assert out.predicted_label == "rescue"
