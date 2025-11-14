from flask import request, jsonify, Blueprint
from app.models import Topic
from app.extensions import db
from app.permission import admin_required

# Create a Blueprint for topics
# All topic management (Create, Update, Delete) is restricted to admins.
# Reading topics is open to everyone.
topics_bp = Blueprint('topics', __name__, url_prefix='/topics')

@topics_bp.route('/', methods=['POST'])
@admin_required
def create_topic():
    """
    Create a new topic. (Admin only)
    """
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Missing topic name"}), 400

    if Topic.query.filter_by(name=data['name']).first():
        return jsonify({"error": "Topic already exists"}), 409

    try:
        new_topic = Topic(name=data['name'])
        db.session.add(new_topic)
        db.session.commit()
        return jsonify({"id": new_topic.id, "name": new_topic.name}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create topic", "details": str(e)}), 500