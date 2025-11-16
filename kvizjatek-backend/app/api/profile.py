from flask import jsonify, Blueprint
from app.models import User, Result, Quiz, Topic
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_my_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    }), 200

@profile_bp.route('/', methods=['DELETE'])
@jwt_required()
def delete_my_profile():
    """Saját profil törlése (Delete)."""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    try:
        
        Result.query.filter_by(user_id=user.id).delete()
        
        Quiz.query.filter_by(created_by_user_id=user.id).delete()
        
        db.session.delete(user)
        
        db.session.commit()
        
        return jsonify({"message": "A fiókod sikeresen törölve."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Hiba történt a fiók törlése során.", "details": str(e)}), 500