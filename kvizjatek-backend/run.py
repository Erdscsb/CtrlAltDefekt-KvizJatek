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

def list_routes():
    """Listing all api endpoints"""
    print("----------------------------------------------------------------")
    print("Flask endpoints list")
    print("----------------------------------------------------------------")
    
    # app.url_map tartalmazza az összes útvonalat
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods - set(['OPTIONS', 'HEAD']))
        print(f"Endpoint: {rule.endpoint:<20} | Methods: {methods:<10} | URL: {rule.rule}")

if __name__ == '__main__':
    list_routes()
    app.run(debug=True)