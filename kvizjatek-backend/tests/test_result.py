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

def create_quiz_environment(app, user_id=1):
    from app.models import Quiz, Question
    from app.extensions import db
    
    with app.app_context():
        q = Quiz(custom_topic="Test Quiz", difficulty="Medium", created_by_user_id=user_id)
        db.session.add(q)
        db.session.commit()
        
        q1 = Question(quiz_id=q.id, question_text="Q1", options=["A", "B"], correct_option_index=0)
        q2 = Question(quiz_id=q.id, question_text="Q2", options=["C", "D"], correct_option_index=1)
        
        db.session.add_all([q1, q2])
        db.session.commit()
        
        return q.id, [q1.id, q2.id]

def test_submit_result_perfect_score(client, app):
    headers = setup_auth_headers(app, user_id=1)
    quiz_id, q_ids = create_quiz_environment(app)
    
    payload = {
        "quiz_id": quiz_id,
        "answers": [
            {"question_id": q_ids[0], "selected_answer": "A"},
            {"question_id": q_ids[1], "selected_answer": "D"}
        ]
    }
    
    response = client.post('/api/result/', json=payload, headers=headers)
    assert response.status_code == 201
    
    from app.models import Result
    with app.app_context():
        res = Result.query.first()
        assert res.score == 2
        assert res.total_questions == 2

def test_submit_result_partial_score(client, app):
    headers = setup_auth_headers(app, user_id=1)
    quiz_id, q_ids = create_quiz_environment(app)
    
    payload = {
        "quiz_id": quiz_id,
        "answers": [
            {"question_id": q_ids[0], "selected_answer": "A"},
            {"question_id": q_ids[1], "selected_answer": "C"} 
        ]
    }
    
    client.post('/api/result/', json=payload, headers=headers)
    
    from app.models import Result
    with app.app_context():
        res = Result.query.first()
        assert res.score == 1

def test_submit_result_invalid_quiz_id(client, app):
    headers = setup_auth_headers(app, user_id=1)
    payload = {"quiz_id": 999, "answers": []}
    response = client.post('/api/result/', json=payload, headers=headers)
    assert response.status_code == 404

def test_submit_result_count_mismatch(client, app):
    headers = setup_auth_headers(app, user_id=1)
    quiz_id, q_ids = create_quiz_environment(app)
    
    payload = {
        "quiz_id": quiz_id,
        "answers": [
            {"question_id": q_ids[0], "selected_answer": "A"}
        ]
    }
    
    response = client.post('/api/result/', json=payload, headers=headers)
    assert response.status_code == 400
    assert "nem egyezik" in response.get_json()['error']

def test_get_results_user_isolation(client, app):
    from app.models import Result, Quiz
    from app.extensions import db
    
    quiz_id, _ = create_quiz_environment(app)
    
    setup_auth_headers(app, user_id=2, username="user2")
    
    with app.app_context():
        db.session.add(Result(user_id=1, quiz_id=quiz_id, score=10, total_questions=10))
        db.session.add(Result(user_id=2, quiz_id=quiz_id, score=5, total_questions=10))
        db.session.commit()

    headers_u1 = setup_auth_headers(app, user_id=1)
    res_u1 = client.get('/api/result/', headers=headers_u1)
    data_u1 = res_u1.get_json()
    
    assert len(data_u1) == 1
    assert data_u1[0]['user_id'] == 1

def test_get_results_admin_visibility(client, app):
    quiz_id, _ = create_quiz_environment(app)
    from app.models import Result
    from app.extensions import db
    
    setup_auth_headers(app, user_id=2, username="normie")
    
    with app.app_context():
        db.session.add(Result(user_id=1, quiz_id=quiz_id, score=10, total_questions=10))
        db.session.add(Result(user_id=2, quiz_id=quiz_id, score=5, total_questions=10))
        db.session.commit()
        
    headers_admin = setup_auth_headers(app, user_id=1, is_admin=True)
    res = client.get('/api/result/', headers=headers_admin)
    data = res.get_json()
    
    assert len(data) == 2

def test_get_specific_result_forbidden(client, app):
    quiz_id, _ = create_quiz_environment(app)
    from app.models import Result
    from app.extensions import db
    
    with app.app_context():
        r = Result(user_id=1, quiz_id=quiz_id, score=10, total_questions=10)
        db.session.add(r)
        db.session.commit()
        res_id = r.id
        
    headers_u2 = setup_auth_headers(app, user_id=2, username="thief")
    response = client.get(f'/api/result/{res_id}', headers=headers_u2)
    
    assert response.status_code == 403
    assert "not have permission" in response.get_json()['error']

def test_get_specific_result_admin_success(client, app):
    quiz_id, _ = create_quiz_environment(app)
    from app.models import Result
    from app.extensions import db
    
    with app.app_context():
        r = Result(user_id=2, quiz_id=quiz_id, score=5, total_questions=10)
        db.session.add(r)
        db.session.commit()
        res_id = r.id
        
    headers_admin = setup_auth_headers(app, user_id=1, is_admin=True)
    response = client.get(f'/api/result/{res_id}', headers=headers_admin)
    
    assert response.status_code == 200
    assert response.get_json()['user_id'] == 2

def test_get_results_for_specific_user_admin(client, app):
    quiz_id, _ = create_quiz_environment(app)
    from app.models import Result
    from app.extensions import db
    
    setup_auth_headers(app, user_id=5, username="target")
    
    with app.app_context():
        db.session.add(Result(user_id=5, quiz_id=quiz_id, score=1, total_questions=5))
        db.session.add(Result(user_id=5, quiz_id=quiz_id, score=2, total_questions=5))
        db.session.add(Result(user_id=1, quiz_id=quiz_id, score=5, total_questions=5))
        db.session.commit()
        
    headers_admin = setup_auth_headers(app, user_id=1, is_admin=True)
    response = client.get('/api/result/user/5', headers=headers_admin)
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2

def test_get_results_for_user_not_admin(client, app):
    headers_user = setup_auth_headers(app, user_id=2, is_admin=False)
    response = client.get('/api/result/user/1', headers=headers_user)
    assert response.status_code == 403