from flask import request, jsonify, Blueprint
from app.models import User
from app.extensions import db, bcrypt, jwt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Hiányzó adatok (email, username, password szükséges)"}), 400

        email = data['email']
        username = data['username']
        password = data['password']

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Ez az e-mail cím már foglalt"}), 409
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Ez a felhasználónév már foglalt"}), 409

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": f"Sikeres regisztráció! Felhasználó létrehozva: {username}"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Szerverhiba történt a regisztráció során.", "details": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Hiányzó adatok (email, password szükséges)"}), 400

        email = data['email']
        password = data['password']

        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({"error": "Hibás e-mail cím vagy jelszó"}), 401

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify(
            access_token=access_token,
            refresh_token=refresh_token,
            user={
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            }
        ), 200

    except Exception as e:
        return jsonify({"error": "Szerverhiba történt a bejelentkezés során.", "details": str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        return jsonify(access_token=new_access_token), 200
    except Exception as e:
        return jsonify({"error": "Hiba a token frissítése során.", "details": str(e)}), 500