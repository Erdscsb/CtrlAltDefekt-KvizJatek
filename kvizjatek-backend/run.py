import os
from app import create_app
from app.extensions import db

app = create_app()

@app.shell_context_processor
def make_shell_context():
    pass
    # Importáljuk a modelleket, hogy elérhetők legyenek a shellben
    #from app.models import User, Quiz, Question, Result, Topic
    #return {
    #    'db': db,
    #    'User': User,
    #    'Quiz': Quiz,
    #    'Question': Question,
    #    'Result': Result,
    #    'Topic': Topic
    #}

def setup_database(app_instance):
    db_path_str = app_instance.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), db_path_str)

    if not os.path.exists(db_path):
        print(f"Adatbázis nem található itt: {db_path}")
        print("Adatbázis és táblák létrehozása...")
        with app_instance.app_context():
            db.create_all()
        print("Adatbázis sikeresen létrehozva.")
    else:
        print(f"Adatbázis már létezik itt: {db_path}")

if __name__ == '__main__':
    setup_database(app)
    
    app.run(debug=True)