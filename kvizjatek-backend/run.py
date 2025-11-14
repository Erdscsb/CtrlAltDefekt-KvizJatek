from app import create_app

app = create_app()

@app.shell_context_processor
def make_shell_context():
    from app.extensions import db
    from app.models import User, Quiz, Question, Result, Topic
    return {
        'db': db, 'User': User, 'Quiz': Quiz, 
        'Question': Question, 'Result': Result, 'Topic': Topic
    }

if __name__ == '__main__':
    app.run(debug=True)