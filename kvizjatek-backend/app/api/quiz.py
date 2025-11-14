from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Quiz, Question, User, Topic
from app.extensions import db
from app.permission import admin_required
from app.ai_generator import generate_quiz_questions # <-- New: Import the AI service

# Create a Blueprint for quizzes
quiz_bp = Blueprint('quiz', __name__, url_prefix='/quiz')

@quiz_bp.route('/', methods=['POST'])
@jwt_required()
def create_quiz():
    """
    Create a new quiz with its questions. (Logged-in users)
    
    This endpoint supports:
    1. Manual questions (if 'ai_generate' is missing or false, 'questions' list is required).
    2. AI generation (if 'ai_generate': true, 'num_questions' is used to call AI).
    """
    data = request.get_json()
    current_user_id = get_jwt_identity()
    questions_data = [] # This list will hold questions, whether manual or AI-generated
    
    # --- Data Extraction ---
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    topic_id = data.get('topic_id')
    custom_topic = data.get('custom_topic')
    difficulty = data.get('difficulty')
    ai_generate = data.get('ai_generate', False) # Check for AI flag
    
    # --- Basic Validation ---
    if not (topic_id or custom_topic):
        return jsonify({"error": "Either 'topic_id' or 'custom_topic' is required"}), 400
    if not difficulty:
        return jsonify({"error": "Missing 'difficulty'"}), 400

    # Validate topic if ID is provided
    if topic_id and not Topic.query.get(topic_id):
        return jsonify({"error": f"Topic with id {topic_id} not found"}), 404
        
    # --- AI Question Generation Branch (If requested) ---
    if ai_generate:
        # Determine the topic name the AI will use
        topic_for_ai = custom_topic or (Topic.query.get(topic_id).name if topic_id else None)
        num_questions = data.get('num_questions', 5) # Default to 5 questions

        if not topic_for_ai:
             return jsonify({"error": "Cannot generate questions without a topic name (custom or from ID)"}), 400

        if not isinstance(num_questions, int) or not (1 <= num_questions <= 15):
            return jsonify({"error": "num_questions must be an integer between 1 and 15"}), 400

        # CALL THE AI SERVICE
        ai_response = generate_quiz_questions(topic_for_ai, difficulty, num_questions)
        
        if isinstance(ai_response, dict) and 'error' in ai_response:
            # AI generation failed, return the error details (e.g., bad API key, invalid JSON from AI)
            return jsonify(ai_response), 500
            
        questions_data = ai_response # Use the AI-generated list of questions
        
        if not questions_data:
             return jsonify({"error": "AI generated an empty set of questions. Try a different prompt."}), 500

    # --- Manual Question Entry Branch (If AI not requested) ---
    else:
        # Use the questions provided directly in the payload
        questions_data = data.get('questions')
        if not questions_data or not isinstance(questions_data, list) or len(questions_data) == 0:
            # Error if user didn't ask for AI and didn't provide manual questions
            return jsonify({"error": "Missing 'questions' list or list is empty for manual creation"}), 400


    # --- Database Transaction (Same for Manual and AI) ---
    try:
        # Create Quiz instance
        new_quiz = Quiz(
            topic_id=topic_id,
            custom_topic=custom_topic,
            difficulty=difficulty,
            created_by_user_id=current_user_id
        )
        
        # Create Question instances from questions_data
        for q_data in questions_data:
            if not all(k in q_data for k in ('question_text', 'options', 'correct_option_index')):
                raise ValueError("Each question must have 'question_text', 'options', and 'correct_option_index'")
            
            # Simple validation to ensure data matches model structure
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
        
        return jsonify({"message": "Quiz created successfully", "quiz_id": new_quiz.id, "questions_count": len(questions_data)}), 201

    except ValueError as ve:
        db.session.rollback()
        return jsonify({"error": f"Invalid question data: {ve}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create quiz", "details": str(e)}), 500
    
@quiz_bp.route('/', methods=['GET'])
def get_all_quizzes():
    """
    Get a list of all quizzes. (Public)
    This route does NOT return the questions, just quiz metadata.
    """
    try:
        quizzes = Quiz.query.all()
        result = []
        for quiz in quizzes:
            topic_name = quiz.custom_topic or (quiz.topic.name if quiz.topic else None)
            result.append({
                "id": quiz.id,
                "topic_name": topic_name,
                "difficulty": quiz.difficulty,
                "created_by_user_id": quiz.created_by_user_id,
                "created_at": quiz.created_at.isoformat()
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve quizzes", "details": str(e)}), 500
    
@quiz_bp.route('/<int:quiz_id>', methods=['GET'])
def get_quiz_details(quiz_id):
    """
    Get full details for a single quiz, including its questions. (Public)
    """
    try:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({"error": "Quiz not found"}), 404

        topic_name = quiz.custom_topic or (quiz.topic.name if quiz.topic else None)
        
        quiz_data = {
            "id": quiz.id,
            "topic_name": topic_name,
            "difficulty": quiz.difficulty,
            "created_by_user_id": quiz.created_by_user_id,
            "created_at": quiz.created_at.isoformat(),
            "questions": []
        }
        
        for q in quiz.questions:
            quiz_data["questions"].append({
                "id": q.id,
                "question_text": q.question_text,
                "options": q.options
                # We do NOT return correct_option_index to the client here
            })
            
        return jsonify(quiz_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve quiz details", "details": str(e)}), 500
    
@quiz_bp.route('/<int:quiz_id>', methods=['DELETE'])
@jwt_required()
def delete_quiz(quiz_id):
    """
    Delete a quiz. (Owner or Admin)
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    quiz = Quiz.query.get(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
        
    # Check permission: must be admin or the user who created the quiz
    if not user.is_admin and quiz.created_by_user_id != current_user_id:
        return jsonify({"error": "You do not have permission to delete this quiz"}), 403
        
    try:
        # Deletion will cascade to Questions and Results as per your model definition
        db.session.delete(quiz)
        db.session.commit()
        return jsonify({"message": "Quiz deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete quiz", "details": str(e)}), 500
    
@quiz_bp.route('/<int:quiz_id>', methods=['PUT'])
@jwt_required()
def update_quiz(quiz_id):
    """
    Update a quiz. (Owner or Admin)
    This will replace the quiz metadata and ALL associated questions.
    This is a full overwrite, not a partial patch.
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    quiz = Quiz.query.get(quiz_id)

    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    # Check permission: must be admin or the user who created the quiz
    if not user.is_admin and quiz.created_by_user_id != current_user_id:
        return jsonify({"error": "You do not have permission to edit this quiz"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # --- Update Quiz Metadata ---
        quiz.topic_id = data.get('topic_id', quiz.topic_id)
        quiz.custom_topic = data.get('custom_topic', quiz.custom_topic)
        quiz.difficulty = data.get('difficulty', quiz.difficulty)
        
        if not (quiz.topic_id or quiz.custom_topic):
             raise ValueError("Quiz must have either 'topic_id' or 'custom_topic'")

        # --- Replace Questions ---
        questions_data = data.get('questions')
        if questions_data is not None: # Allow updating metadata without changing questions
            
            # 1. Delete all existing questions for this quiz
            # The 'delete-orphan' cascade on the relationship handles this
            quiz.questions.clear() 
            db.session.flush() # Apply the clear operation

            # 2. Add new questions
            for q_data in questions_data:
                if not all(k in q_data for k in ('question_text', 'options', 'correct_option_index')):
                    raise ValueError("Each new question must have 'question_text', 'options', and 'correct_option_index'")
                
                new_question = Question(
                    quiz_id=quiz.id, # Explicitly set quiz_id
                    question_text=q_data['question_text'],
                    options=q_data['options'],
                    correct_option_index=q_data['correct_option_index']
                )
                db.session.add(new_question) # Add new question to session
        
        db.session.commit()
        return jsonify({"message": "Quiz updated successfully", "quiz_id": quiz.id}), 200

    except ValueError as ve:
        db.session.rollback()
        return jsonify({"error": f"Invalid data: {ve}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update quiz", "details": str(e)}), 500