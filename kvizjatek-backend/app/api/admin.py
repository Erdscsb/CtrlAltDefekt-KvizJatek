from flask import request, jsonify, Blueprint
from app.models import User, Topic
from app.extensions import db, bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from app.permission import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """(Admin) Összes felhasználó listázása."""
    users = User.query.all()
    output = []
    for user in users:
        output.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        })
    return jsonify(output), 200
@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user_by_id(user_id):
    """(Admin) Egy felhasználó adatainak lekérése ID alapján."""
    user = User.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """(Admin) Felhasználó adatainak frissítése."""
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "E-mail cím már foglalt"}), 409
        user.email = data['email']
        
    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Felhasználónév már foglalt"}), 409
        user.username = data['username']

    if 'password' in data and data['password']:
        user.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    if 'is_admin' in data:
        user.is_admin = data['is_admin']

    db.session.commit()
    return jsonify({"message": "Felhasználó frissítve"}), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """(Admin) Felhasználó törlése."""
    
    current_admin_id = get_jwt_identity()
    if user_id == current_admin_id:
        return jsonify({"error": "Adminisztrátor nem törölheti saját magát."}), 403

    user = User.query.get_or_404(user_id)
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Felhasználó törölve"}), 200