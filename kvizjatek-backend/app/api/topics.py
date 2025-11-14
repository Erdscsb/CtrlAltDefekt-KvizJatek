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
    
@topics_bp.route('/', methods=['GET'])
def get_all_topics():
    """
    Get a list of all available topics. (Public)
    """
    try:
        topics = Topic.query.all()
        return jsonify([{"id": topic.id, "name": topic.name} for topic in topics]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve topics", "details": str(e)}), 500
    
@topics_bp.route('/<int:topic_id>', methods=['GET'])
def get_topic(topic_id):
    """
    Get a single topic by its ID. (Public)
    """
    topic = Topic.query.get(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404
    return jsonify({"id": topic.id, "name": topic.name}), 200

@topics_bp.route('/<int:topic_id>', methods=['PUT'])
@admin_required
def update_topic(topic_id):
    """
    Update a topic's name. (Admin only)
    """
    topic = Topic.query.get(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404

    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Missing topic name"}), 400

    # Check if new name already exists (and it's not this topic)
    existing = Topic.query.filter_by(name=data['name']).first()
    if existing and existing.id != topic_id:
        return jsonify({"error": "Topic name already in use"}), 409

    try:
        topic.name = data['name']
        db.session.commit()
        return jsonify({"id": topic.id, "name": topic.name}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update topic", "details": str(e)}), 500
    
@topics_bp.route('/<int:topic_id>', methods=['DELETE'])
@admin_required
def delete_topic(topic_id):
    """
    Delete a topic. (Admin only)
    Note: This might fail if quizzes are referencing this topic,
    unless cascading delete is set up or you handle it here.
    """
    topic = Topic.query.get(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404

    try:
        # Check if any quizzes are using this topic
        if topic.quizzes:
             return jsonify({
                 "error": "Cannot delete topic, it is being used by one or more quizzes."
             }), 409

        db.session.delete(topic)
        db.session.commit()
        return jsonify({"message": "Topic deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete topic", "details": str(e)}), 500