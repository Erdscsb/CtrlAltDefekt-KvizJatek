def test_register_success(client):
    payload = {"username": "newuser", "email": "new@test.com", "password": "password123"}
    response = client.post('/api/auth/register', json=payload)
    
    assert response.status_code == 201
    assert "Sikeres regisztráció" in response.get_json()['message'] #

def test_register_missing_email(client):
    payload = {"username": "newuser", "password": "password123"} # Nincs email
    response = client.post('/api/auth/register', json=payload)
    
    assert response.status_code == 400
    assert "Hiányzó adatok" in response.get_json()['error'] #

def test_register_missing_username(client):
    payload = {"email": "new@test.com", "password": "password123"}
    response = client.post('/api/auth/register', json=payload)
    
    assert response.status_code == 400

def test_register_missing_password(client):
    payload = {"username": "newuser", "email": "new@test.com"}
    response = client.post('/api/auth/register', json=payload)
    
    assert response.status_code == 400

def test_register_duplicate_email(client):
    # 1. User létrehozása
    client.post('/api/auth/register', json={"username": "u1", "email": "exist@test.com", "password": "pw"})
    
    # 2. Próbálkozás ugyanazzal az e-maillel
    response = client.post('/api/auth/register', json={
        "username": "u2", "email": "exist@test.com", "password": "pw"
    })
    
    assert response.status_code == 409
    assert "Ez az e-mail cím már foglalt" in response.get_json()['error'] #

def test_register_duplicate_username(client):
    client.post('/api/auth/register', json={"username": "taken", "email": "u1@test.com", "password": "pw"})
    
    response = client.post('/api/auth/register', json={
        "username": "taken", "email": "u2@test.com", "password": "pw"
    })
    
    assert response.status_code == 409
    assert "Ez a felhasználónév már foglalt" in response.get_json()['error'] #

def test_password_is_hashed(client, app):
    from app.models import User
    
    password = "secretpassword"
    client.post('/api/auth/register', json={"username": "hashcheck", "email": "hash@test.com", "password": password})
    
    with app.app_context():
        user = User.query.filter_by(username="hashcheck").first()
        assert user.password_hash != password
        assert user.password_hash.startswith('$2b$') or len(user.password_hash) > 20 # Bcrypt check

def test_login_success(client):
    # Először regisztrálunk
    client.post('/api/auth/register', json={"username": "loginuser", "email": "login@test.com", "password": "pw"})
    
    response = client.post('/api/auth/login', json={"email": "login@test.com", "password": "pw"})
    
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "login@test.com" #

def test_login_wrong_password(client):
    client.post('/api/auth/register', json={"username": "u", "email": "u@test.com", "password": "correct"})
    
    response = client.post('/api/auth/login', json={"email": "u@test.com", "password": "wrong"})
    
    assert response.status_code == 401
    assert "Hibás e-mail cím vagy jelszó" in response.get_json()['error'] #

def test_login_nonexistent_email(client):
    response = client.post('/api/auth/login', json={"email": "ghost@test.com", "password": "any"})
    
    assert response.status_code == 401
    assert "Hibás e-mail cím vagy jelszó" in response.get_json()['error'] #

def test_login_missing_data(client):
    # Csak email, jelszó nélkül
    response = client.post('/api/auth/login', json={"email": "u@test.com"})
    
    assert response.status_code == 400
    assert "Hiányzó adatok" in response.get_json()['error'] #

def test_login_response_structure(client):
    client.post('/api/auth/register', json={"username": "struct", "email": "struct@test.com", "password": "pw"})
    res = client.post('/api/auth/login', json={"email": "struct@test.com", "password": "pw"})
    
    user_data = res.get_json()['user']
    assert "id" in user_data
    assert "username" in user_data
    assert "is_admin" in user_data
    assert user_data["is_admin"] is False #

def test_refresh_token_success(client):
    # 1. Regisztráció és Login
    client.post('/api/auth/register', json={"username": "ref", "email": "ref@t.com", "password": "p"})
    login_res = client.post('/api/auth/login', json={"email": "ref@t.com", "password": "p"})
    refresh_token = login_res.get_json()['refresh_token']
    
    # 2. Refresh hívás
    # Fontos: A Flask-JWT-Extended általában 'Authorization: Bearer <token>' header-t vár
    response = client.post('/api/auth/refresh', headers={
        'Authorization': f'Bearer {refresh_token}'
    })
    
    assert response.status_code == 200
    assert "access_token" in response.get_json() #

def test_refresh_missing_token(client):
    response = client.post('/api/auth/refresh') # Nincs header
    
    # 401 Unauthorized várható (vagy 422, konfigurációtól függően, de default a 401 JWT nélkül)
    assert response.status_code in [401, 422]

def test_refresh_invalid_token(client):
    response = client.post('/api/auth/refresh', headers={
        'Authorization': 'Bearer invalid_token_string'
    })
    
    # Érvénytelen token esetén 422 Unprocessable Entity a gyakori a flask-jwt-extended-nél
    assert response.status_code in [401, 422]
