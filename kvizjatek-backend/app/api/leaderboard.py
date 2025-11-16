from flask import jsonify, Blueprint
from app.models import Result, User
from app.extensions import db
from sqlalchemy import func
from flask_jwt_extended import jwt_required # <-- 1. Import jwt_required

# Create a Blueprint for the leaderboard
leaderboard_bp = Blueprint('leaderboard', __name__, url_prefix='/leaderboard')

@leaderboard_bp.route('/', methods=['GET'])
@jwt_required() # <-- 2. Add the decorator
def get_leaderboard():
    """
    Get the leaderboard. (Authenticated users only)
    This ranks all users by their total combined score
    from all quizzes they have taken.
    Returns the Top 10 users.
    """
    try:
        # Query to get the sum of scores for each user
        # We join with the User table to get the username
        # We group by the user's ID and username
        # We order by the total_score (descending)
        # We limit the result to the top 10
        top_users = db.session.query(
            User.id,
            User.username,
            func.sum(Result.score).label('total_score')
        ).join(User, User.id == Result.user_id) \
         .group_by(User.id, User.username) \
         .order_by(func.sum(Result.score).desc()) \
         .limit(10) \
         .all()

        # Format the data for the JSON response
        leaderboard = []
        for rank, user in enumerate(top_users):
            leaderboard.append({
                "rank": rank + 1,
                "user_id": user.id,
                "username": user.username,
                "total_score": int(user.total_score) # Cast to int
            })

        return jsonify(leaderboard), 200

    except Exception as e:
        return jsonify({"error": "Failed to retrieve leaderboard", "details": str(e)}), 500