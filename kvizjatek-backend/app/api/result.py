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
    Beküldi egy kitöltött kvíz válaszait, kiértékeli,
    és elmenti az eredményt. (Bejelentkezett felhasználó)
    Várt JSON:
    {
        "quiz_id": 1,
        "answers": [
            { "question_id": 10, "selected_answer": "Válasz A" },
            { "question_id": 11, "selected_answer": "Válasz C" }
        ]
    }
    """
    data = request.get_json()
    current_user_id = int(get_jwt_identity())

    if not data:
        return jsonify({"error": "Nincsenek adatok"}), 400
        
    quiz_id = data.get('quiz_id')
    answers = data.get('answers') # A frontend által küldött válaszok listája

    if not quiz_id or not isinstance(answers, list):
        return jsonify({"error": "Hiányzó 'quiz_id' vagy 'answers' lista"}), 400

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Kvíz nem található"}), 404

    try:
        score = 0
        total_questions = len(answers)
        
        # A kvízhez tartozó összes helyes válasz lekérése
        correct_questions = {q.id: q for q in quiz.questions}
        
        if total_questions != len(correct_questions):
             return jsonify({"error": "A válaszok száma nem egyezik a kérdések számával"}), 400

        # --- Kiértékelés a szerveren ---
        for answer in answers:
            question_id = answer.get('question_id')
            selected_answer = answer.get('selected_answer')
            
            question = correct_questions.get(question_id)
            
            if not question:
                continue # Hiba, a kérdés nem ehhez a kvízhez tartozik

            # A helyes válasz kikeresése az index alapján
            correct_answer_text = question.options[question.correct_option_index]
            
            if selected_answer == correct_answer_text:
                score += 1
        # --- Kiértékelés vége ---

        # Új eredmény mentése az adatbázisba
        new_result = Result(
            user_id=current_user_id,
            quiz_id=quiz_id,
            score=score,
            total_questions=total_questions
        )
        
        db.session.add(new_result)
        db.session.commit()
        
        return jsonify({"message": "Eredmény sikeresen mentve", "result_id": new_result.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Eredmény mentése sikertelen", "details": str(e)}), 500
    
@result_bp.route('/', methods=['GET'])
@jwt_required()
def get_results():
    """
    Get results.
    - Admins get all results.
    - Regular users get only their own results.
    """
    current_user_id = int(get_jwt_identity())
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
    
@result_bp.route('/<int:result_id>', methods=['GET'])
@jwt_required()
def get_result_by_id(result_id):
    """
    Get a specific result by its ID.
    Admins can see any result.
    Regular users can only see their own.
    """
    current_user_id = int(get_jwt_identity())
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

@result_bp.route('/user/<int:user_id>', methods=['GET'])
@admin_required
def get_results_for_user(user_id):
    """
    Get all results for a specific user. (Admin only)
    """
    if not User.query.get(user_id):
        return jsonify({"error": "User not found"}), 404
        
    try:
        results = Result.query.filter_by(user_id=user_id).all()
        result_list = []
        for res in results:
            result_list.append({
                "id": res.id,
                "quiz_id": res.quiz_id,
                "score": res.score,
                "total_questions": res.total_questions,
                "completed_at": res.completed_at.isoformat()
            })
        return jsonify(result_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve user's results", "details": str(e)}), 500