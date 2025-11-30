import pytest

def test_leaderboard_empty(client, app):
    """Test that leaderboard returns empty list if no results exist."""
    from flask_jwt_extended import create_access_token
    
    # We need a token to access this endpoint
    with app.app_context():
        token = create_access_token(identity="1")
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/leaderboard/', headers=headers)
    
    assert response.status_code == 200
    assert response.get_json() == []

def test_leaderboard_calculation(client, app):
    """Test that users are ranked correctly by total score."""
    from app.models import User, Result
    from app.extensions import db
    from flask_jwt_extended import create_access_token

    with app.app_context():
        # 1. Create Users
        u1 = User(username="Alice", email="alice@test.com", password_hash="pw")
        u2 = User(username="Bob", email="bob@test.com", password_hash="pw")
        u3 = User(username="Charlie", email="charlie@test.com", password_hash="pw")
        db.session.add_all([u1, u2, u3])
        db.session.commit()

        # 2. Add Results
        # Assuming we need quiz_id, but the leaderboard logic only sums scores.
        # We use dummy quiz_id=1 for simplicity.
        r1 = Result(user_id=u1.id, quiz_id=1, score=100)
        r2 = Result(user_id=u1.id, quiz_id=1, score=50)  # Alice Total: 150
        r3 = Result(user_id=u2.id, quiz_id=1, score=200) # Bob Total: 200
        r4 = Result(user_id=u3.id, quiz_id=1, score=10)  # Charlie Total: 10
        
        db.session.add_all([r1, r2, r3, r4])
        db.session.commit()

        # Generate token for User 1 (Alice)
        token = create_access_token(identity="1")

    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/leaderboard/', headers=headers)
    data = response.get_json()

    assert response.status_code == 200
    assert len(data) == 3
    
    # Check Rank 1: Bob (200)
    assert data[0]['username'] == "Bob"
    assert data[0]['total_score'] == 200
    assert data[0]['rank'] == 1

    # Check Rank 2: Alice (150)
    assert data[1]['username'] == "Alice"
    assert data[1]['total_score'] == 150

    # Check Rank 3: Charlie (10)
    assert data[2]['username'] == "Charlie"
    assert data[2]['total_score'] == 10

def test_leaderboard_unauthorized(client):
    """Test access without token."""
    response = client.get('/leaderboard/')
    assert response.status_code in [401, 422]