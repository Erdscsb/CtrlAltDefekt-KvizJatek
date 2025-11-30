import pytest

def setup_auth_headers(app, user_id=1, username="testuser", is_admin=False):
    from app.models import User
    from app.extensions import db
    from flask_jwt_extended import create_access_token
    
    with app.app_context():
        if not User.query.get(user_id):
            user = User(id=user_id, username=username, email=f"{username}@test.com", password_hash="pw", is_admin=is_admin)
            db.session.add(user)
            db.session.commit()
        
        token = create_access_token(identity=str(user_id))
        return {'Authorization': f'Bearer {token}'}

def test_get_all_topics_empty(client):
    response = client.get('/api/topics/')
    assert response.status_code == 200
    assert response.get_json() == []

def test_get_all_topics_populated(client, app):
    from app.models import Topic
    from app.extensions import db
    with app.app_context():
        db.session.add(Topic(name="History"))
        db.session.add(Topic(name="Science"))
        db.session.commit()

    response = client.get('/api/topics/')
    data = response.get_json()
    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]['name'] == "History"

def test_get_single_topic_success(client, app):
    from app.models import Topic
    from app.extensions import db
    with app.app_context():
        t = Topic(name="Geography")
        db.session.add(t)
        db.session.commit()
        t_id = t.id

    response = client.get(f'/api/topics/{t_id}')
    assert response.status_code == 200
    assert response.get_json()['name'] == "Geography"

def test_get_single_topic_not_found(client):
    response = client.get('/api/topics/999')
    assert response.status_code == 404

def test_create_topic_admin_success(client, app):
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    payload = {"name": "New Topic"}
    
    response = client.post('/api/topics/', json=payload, headers=headers)
    assert response.status_code == 201
    assert response.get_json()['name'] == "New Topic"

def test_create_topic_user_forbidden(client, app):
    headers = setup_auth_headers(app, user_id=2, is_admin=False)
    payload = {"name": "Hacker Topic"}
    
    response = client.post('/api/topics/', json=payload, headers=headers)
    assert response.status_code == 403
    assert "Admin access required" in response.get_json()['error']

def test_create_topic_duplicate_name(client, app):
    from app.models import Topic
    from app.extensions import db
    
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    with app.app_context():
        db.session.add(Topic(name="Existing"))
        db.session.commit()

    response = client.post('/api/topics/', json={"name": "Existing"}, headers=headers)
    assert response.status_code == 409
    assert "Topic already exists" in response.get_json()['error']

def test_create_topic_missing_data(client, app):
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    response = client.post('/api/topics/', json={}, headers=headers)
    assert response.status_code == 400

def test_update_topic_success(client, app):
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    from app.models import Topic
    from app.extensions import db
    
    with app.app_context():
        t = Topic(name="Old Name")
        db.session.add(t)
        db.session.commit()
        t_id = t.id

    response = client.put(f'/api/topics/{t_id}', json={"name": "New Name"}, headers=headers)
    assert response.status_code == 200
    assert response.get_json()['name'] == "New Name"

def test_update_topic_duplicate_conflict(client, app):
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    from app.models import Topic
    from app.extensions import db
    
    with app.app_context():
        db.session.add(Topic(name="Topic A"))
        db.session.add(Topic(name="Topic B"))
        db.session.commit()
        topic_a = Topic.query.filter_by(name="Topic A").first()
        t_id = topic_a.id

    response = client.put(f'/api/topics/{t_id}', json={"name": "Topic B"}, headers=headers)
    assert response.status_code == 409

def test_delete_topic_success(client, app):
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    from app.models import Topic
    from app.extensions import db
    
    with app.app_context():
        t = Topic(name="To Delete")
        db.session.add(t)
        db.session.commit()
        t_id = t.id

    response = client.delete(f'/api/topics/{t_id}', headers=headers)
    assert response.status_code == 200
    assert "Topic deleted successfully" in response.get_json()['message']

def test_delete_topic_conflict_with_quiz(client, app):
    headers = setup_auth_headers(app, user_id=1, is_admin=True)
    from app.models import Topic, Quiz, User
    from app.extensions import db
    
    with app.app_context():
        u = User.query.get(1)
        t = Topic(name="Used Topic")
        db.session.add(t)
        db.session.commit()
        
        q = Quiz(topic_id=t.id, difficulty="Easy", created_by_user_id=u.id)
        db.session.add(q)
        db.session.commit()
        t_id = t.id

    response = client.delete(f'/api/topics/{t_id}', headers=headers)
    assert response.status_code == 409
    assert "being used by one or more quizzes" in response.get_json()['error']