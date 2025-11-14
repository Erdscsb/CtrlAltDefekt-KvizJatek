from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from app.models import User

def admin_required(fn):
    """
    Custom decorator to require admin privileges for a route.
    """
    @wraps(fn)
    @jwt_required()  # Ensures a valid JWT is present
    def wrapper(*args, **kwargs):
        # Get the user ID from the JWT
        current_user_id = get_jwt_identity()
        
        # Fetch the user from the database
        user = User.query.get(current_user_id)
        
        # Check if user exists and is an admin
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
            
        # If user is admin, proceed to the decorated function
        return fn(*args, **kwargs)
        
    return wrapper