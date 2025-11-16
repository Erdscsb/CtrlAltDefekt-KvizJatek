from flask import Flask
from config import Config
from .extensions import db, jwt, migrate, ma

def create_app(config_class=Config):

    app = Flask(__name__)
    
    app.config.from_object(config_class)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    
    from .api.auth import auth_bp
    from .api.topics import topics_bp
    from .api.quiz import quiz_bp
    from .api.result import result_bp
    from .api.admin import admin_bp
    from .api.profile import profile_bp
    from .api.leaderboard import leaderboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(topics_bp, url_prefix='/api/topics')
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
    app.register_blueprint(result_bp, url_prefix='/api/result')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')

    @app.route('/api/health')
    def health_check():
        return {"status": "ok"}, 200

    return app