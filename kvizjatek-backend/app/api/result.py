from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Result, User, Quiz
from app.extensions import db
from app.permission import admin_required

# Create a Blueprint for results
result_bp = Blueprint('result', __name__, url_prefix='/result')

@result_bp.route('/', methods=['POST'])
@jwt_required()
def submit_result():
    """
    Submit a new result for a quiz. (Logged-in users)
    Expects JSON:
    {
        "quiz_id": 1,
        "score": 8,
        "total_questions": 10
    }
    """
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    quiz_id = data.get('quiz_id')
    score = data.get('score')
    total_questions = data.get('total_questions')

    if not all([quiz_id, score is not None, total_questions is not None]):
        return jsonify({"error": "Missing 'quiz_id', 'score', or 'total_questions'"}), 400

    # Validate quiz existence
    if not Quiz.query.get(quiz_id):
        return jsonify({"error": "Quiz not found"}), 404
        
    try:
        new_result = Result(
            user_id=current_user_id,
            quiz_id=quiz_id,
            score=score,
            total_questions=total_questions
        )
        
        db.session.add(new_result)
        db.session.commit()
        
        return jsonify({"message": "Result submitted successfully", "result_id": new_result.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to submit result", "details": str(e)}), 500