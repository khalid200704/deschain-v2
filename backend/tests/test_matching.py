def test_match_requires_auth(client):
    res = client.post("/api/v1/matching/groups/match", json={
        "product_name": "Beras", "product_category": "Sembako",
        "quantity": 100, "unit": "kg", "budget": 1000000,
        "delivery_city": "Pontianak"
    })
    assert res.status_code == 403
