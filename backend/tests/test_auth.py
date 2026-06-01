def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "sehat"

def test_register_success(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "test@deschain.id",
        "password": "Test1234!",
        "first_name": "Test",
        "last_name": "User",
        "phone": "081234567890",
        "user_type": "umkm"
    })
    assert res.status_code == 201
    assert res.json()["success"] is True
    assert "access_token" in res.json()["data"]

def test_register_duplicate_email(client):
    data = {"email": "dup@test.id", "password": "Test1234!", "first_name": "A",
            "last_name": "B", "phone": "08111", "user_type": "umkm"}
    client.post("/api/v1/auth/register", json=data)
    res = client.post("/api/v1/auth/register", json=data)
    assert res.status_code == 400

def test_login_success(client):
    client.post("/api/v1/auth/register", json={
        "email": "login@test.id", "password": "Test1234!",
        "first_name": "A", "last_name": "B", "phone": "082", "user_type": "umkm"
    })
    res = client.post("/api/v1/auth/login", json={
        "email": "login@test.id", "password": "Test1234!"
    })
    assert res.status_code == 200
    assert res.json()["success"] is True

def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "email": "wp@test.id", "password": "Test1234!",
        "first_name": "A", "last_name": "B", "phone": "083", "user_type": "umkm"
    })
    res = client.post("/api/v1/auth/login", json={
        "email": "wp@test.id", "password": "WrongPassword!"
    })
    assert res.status_code == 401
