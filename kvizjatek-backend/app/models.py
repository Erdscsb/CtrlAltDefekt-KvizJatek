import datetime
from .extensions import db
from sqlalchemy.dialects.sqlite import JSON

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    
    quizzes = db.relationship('Quiz', back_populates='created_by_user', lazy=True)
    results = db.relationship('Result', back_populates='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Topic(db.Model):
    __tablename__ = 'topics'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    
    quizzes = db.relationship('Quiz', back_populates='topic', lazy=True)

    def __repr__(self):
        return f'<Topic {self.name}>'

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=True)
    custom_topic = db.Column(db.String(150), nullable=True)
    
    difficulty = db.Column(db.String(50), nullable=False)
    
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    
    created_by_user = db.relationship('User', back_populates='quizzes')
    topic = db.relationship('Topic', back_populates='quizzes')
    
    questions = db.relationship('Question', back_populates='quiz', lazy=True, cascade="all, delete-orphan")
    
    results = db.relationship('Result', back_populates='quiz', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Quiz {self.id} (Téma: {self.custom_topic or self.topic.name})>'

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    
    question_text = db.Column(db.Text, nullable=False)
    
    options = db.Column(db.JSON, nullable=False)
    
    correct_option_index = db.Column(db.Integer, nullable=False)
    
    quiz = db.relationship('Quiz', back_populates='questions')

    def __repr__(self):
        return f'<Question {self.id} (QuizID: {self.quiz_id})>'

class Result(db.Model):
    __tablename__ = 'results'
    
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    
    score = db.Column(db.Integer, nullable=False) 
    total_questions = db.Column(db.Integer, nullable=False)
    
    completed_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    user = db.relationship('User', back_populates='results')
    quiz = db.relationship('Quiz', back_populates='results')

    def __repr__(self):
        return f'<Result {self.id} (User: {self.user_id}, Score: {self.score}/{self.total_questions})>'