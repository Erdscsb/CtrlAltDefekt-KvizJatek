import pytest
from unittest.mock import patch
from flask_jwt_extended import create_access_token
from models import User, Quiz, Question
from extensions import db

# Helper to create a user and get headers
def get_auth_header(user_id=1, is_admin=False):
    token = create_access_token(identity=str(user_id))
    return {'Authorization': f'Bearer {token}'}

def setup_user(app, user_id=1, username="testuser", is_admin=False):
    with app.app_context():
        user = User(id=user_id, username=username, email=f"{username}@test.com", password_hash="pw", is_admin=is_admin)
        db.session.add(user)
        db.session.commit()

# --- GET TESTS ---

def test_get_all_quizzes_empty(client):
    response = client.get('/quiz/')
    assert response.status_code == 200
    assert response.get_json() == []

def test_get_quiz_details(client, app):
    # Setup data
    with app.app_context():
        q = Quiz(custom_topic="History", difficulty="Easy", created_by_user_id=1)
        ques = Question(question_text="Q1", options=["A", "B"], correct_option_index=0)
        q.questions.append(ques)
        db.session.add(q)
        db.session.commit()
        quiz_id = q.id

    response = client.get(f'/quiz/{quiz_id}')
    data = response.get_json()

    assert response.status_code == 200
    assert data['topic_name'] == "History"
    assert len(data['questions']) == 1
    # Check that correct_option_index is hidden from public
    assert "correct_option_index" not in data['questions'][0]

def test_get_quiz_not_found(client):
    response = client.get('/quiz/999')
    assert response.status_code == 404

# --- CREATE TESTS ---

def test_create_quiz_manual_success(client, app):
    setup_user(app)
    headers = get_auth_header(user_id=1)
    
    payload = {
        "custom_topic": "Math",
        "difficulty": "Medium",
        "questions": [
            {
                "question_text": "1+1?",
                "options": ["1", "2", "3"],
                "correct_option_index": 1
            }
        ]
    }
    
    response = client.post('/quiz/', json=payload, headers=headers)
    assert response.status_code == 201
    assert "Quiz created successfully" in response.get_json()['message']

def test_create_quiz_validation_error(client, app):
    setup_user(app)
    headers = get_auth_header(user_id=1)
    
    # Missing 'difficulty'
    payload = {"custom_topic": "Math", "questions": []}
    
    response = client.post('/quiz/', json=payload, headers=headers)
    assert response.status_code == 400

# --- AI GENERATION TEST (MOCKED) ---

@patch('app.ai_generator.generate_quiz_questions') 
def test_create_quiz_ai_success(mock_generate, client, app):
    """
    We mock 'generate_quiz_questions' so we don't call the real AI.
    We tell the mock what to return when it is called.
    """
    setup_user(app)
    headers = get_auth_header(user_id=1)
    
    # Define what the fake AI returns
    mock_generate.return_value = [
        {"question_text": "AI Q1", "options": ["A", "B"], "correct_option_index": 0}
    ]
    
    payload = {
        "custom_topic": "Science",
        "difficulty": "Hard",
        "ai_generate": True,
        "num_questions": 1
    }
    
    response = client.post('/quiz/', json=payload, headers=headers)
    
    assert response.status_code == 201
    assert "questions_count" in response.get_json()
    assert response.get_json()['questions_count'] == 1
    
    # Verify the mock was actually called
    mock_generate.assert_called_once()

# --- DELETE TESTS ---

def test_delete_quiz_owner(client, app):
    setup_user(app, user_id=1)
    headers = get_auth_header(user_id=1)
    
    with app.app_context():
        # Quiz created by user 1
        q = Quiz(custom_topic="My Quiz", difficulty="Easy", created_by_user_id=1)
        db.session.add(q)
        db.session.commit()
        quiz_id = q.id
        
    response = client.delete(f'/quiz/{quiz_id}', headers=headers)
    assert response.status_code == 200

def test_delete_quiz_forbidden(client, app):
    setup_user(app, user_id=1) # The owner
    setup_user(app, user_id=2, username="hacker") # The attacker
    
    # User 2 tries to delete User 1's quiz
    attacker_headers = get_auth_header(user_id=2)
    
    with app.app_context():
        q = Quiz(custom_topic="User1 Quiz", difficulty="Easy", created_by_user_id=1)
        db.session.add(q)
        db.session.commit()
        quiz_id = q.id
        
    response = client.delete(f'/quiz/{quiz_id}', headers=attacker_headers)
    assert response.status_code == 403
    assert "permission" in response.get_json()['error']

# --- UPDATE TESTS ---

def test_update_quiz_success(client, app):
    setup_user(app, user_id=1)
    headers = get_auth_header(user_id=1)
    
    with app.app_context():
        q = Quiz(custom_topic="Old Topic", difficulty="Easy", created_by_user_id=1)
        q.questions.append(Question(question_text="Old Q", options=["A","B"], correct_option_index=0))
        db.session.add(q)
        db.session.commit()
        quiz_id = q.id
        
    payload = {
        "custom_topic": "New Topic",
        "questions": [
            {"question_text": "New Q", "options": ["C","D"], "correct_option_index": 1}
        ]
    }
    
    response = client.put(f'/quiz/{quiz_id}', json=payload, headers=headers)
    
    assert response.status_code == 200
    
    # Verify DB update
    with app.app_context():
        updated_quiz = Quiz.query.get(quiz_id)
        assert updated_quiz.custom_topic == "New Topic"
        assert len(updated_quiz.questions) == 1
        assert updated_quiz.questions[0].question_text == "New Q"