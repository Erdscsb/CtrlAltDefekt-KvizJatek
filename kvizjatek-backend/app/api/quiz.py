from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Quiz, Question, User, Topic
from app.extensions import db
from app.permission import admin_required

# Create a Blueprint for quizzes
quiz_bp = Blueprint('quiz', __name__, url_prefix='/quiz')

@quizzes_bp.route('/', methods=['POST'])
@jwt_required()
def create_quiz():
    """
    Create a new quiz with its questions. (Logged-in users)
    Expects a JSON payload like:
    {
        "topic_id": 1, (optional)
        "custom_topic": "My Custom Topic", (optional, one of topic_id or custom_topic required)
        "difficulty": "Medium",
        "questions": [
            {
                "question_text": "What is 2+2?",
                "options": ["3", "4", "5", "6"],
                "correct_option_index": 1
            },
            ...
        ]
    }
    """
    data = request.get_json()
    current_user_id = get_jwt_identity()

    # --- Validation ---
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    topic_id = data.get('topic_id')
    custom_topic = data.get('custom_topic')
    difficulty = data.get('difficulty')
    questions_data = data.get('questions')

    if not (topic_id or custom_topic):
        return jsonify({"error": "Either 'topic_id' or 'custom_topic' is required"}), 400
    if not difficulty:
        return jsonify({"error": "Missing 'difficulty'"}), 400
    if not questions_data or not isinstance(questions_data, list) or len(questions_data) == 0:
        return jsonify({"error": "Missing 'questions' list or list is empty"}), 400

    # Validate topic if ID is provided
    if topic_id and not Topic.query.get(topic_id):
        return jsonify({"error": f"Topic with id {topic_id} not found"}), 404
        
    # --- Creation ---
    try:
        # Create Quiz instance
        new_quiz = Quiz(
            topic_id=topic_id,
            custom_topic=custom_topic,
            difficulty=difficulty,
            created_by_user_id=current_user_id
        )
        
        # Create Question instances
        for q_data in questions_data:
            if not all(k in q_data for k in ('question_text', 'options', 'correct_option_index')):
                raise ValueError("Each question must have 'question_text', 'options', and 'correct_option_index'")
            
            if not isinstance(q_data['options'], list) or len(q_data['options']) < 2:
                raise ValueError("Question 'options' must be a list with at least 2 items")
            
            if not (0 <= q_data['correct_option_index'] < len(q_data['options'])):
                raise ValueError("Invalid 'correct_option_index'")

            new_question = Question(
                question_text=q_data['question_text'],
                options=q_data['options'], # Stored as JSON
                correct_option_index=q_data['correct_option_index']
            )
            # Add question to the quiz's question list
            new_quiz.questions.append(new_question)

        # Add to session and commit transaction
        db.session.add(new_quiz)
        db.session.commit()
        
        return jsonify({"message": "Quiz created successfully", "quiz_id": new_quiz.id}), 201

    except ValueError as ve:
        db.session.rollback()
        return jsonify({"error": f"Invalid question data: {ve}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create quiz", "details": str(e)}), 500