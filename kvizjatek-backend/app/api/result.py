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
    
@result_bp.route('/', methods=['GET'])
@jwt_required()
def get_results():
    """
    Get results.
    - Admins get all results.
    - Regular users get only their own results.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    try:
        if user.is_admin:
            # Admin: Get all results
            results = Result.query.all()
        else:
            # Regular user: Get only their own results
            results = Result.query.filter_by(user_id=current_user_id).all()
        
        result_list = []
        for res in results:
            result_list.append({
                "id": res.id,
                "user_id": res.user_id,
                "quiz_id": res.quiz_id,
                "score": res.score,
                "total_questions": res.total_questions,
                "completed_at": res.completed_at.isoformat()
            })
            
        return jsonify(result_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve results", "details": str(e)}), 500
    
@results_bp.route('/<int:result_id>', methods=['GET'])
@jwt_required()
def get_result_by_id(result_id):
    """
    Get a specific result by its ID.
    Admins can see any result.
    Regular users can only see their own.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    result = Result.query.get(result_id)
    
    if not result:
        return jsonify({"error": "Result not found"}), 404
        
    # Check permission
    if not user.is_admin and result.user_id != current_user_id:
        return jsonify({"error": "You do not have permission to view this result"}), 403
        
    return jsonify({
        "id": result.id,
        "user_id": result.user_id,
        "quiz_id": result.quiz_id,
        "score": result.score,
        "total_questions": result.total_questions,
        "completed_at": result.completed_at.isoformat()
    }), 200