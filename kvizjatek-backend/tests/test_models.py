import pytest

def test_user_creation_defaults(app):
    from app.models import User
    from app.extensions import db
    
    # Context szükséges az adatbázis művelethez
    with app.app_context():
        user = User(username='testuser', email='test@test.com', password_hash='hash123')
        db.session.add(user)
        db.session.commit()  # Itt kerül be a default érték az adatbázisba
        
        # Frissítjük az objektumot az adatbázisból
        db.session.refresh(user)
        
        assert user.username == 'testuser'
        assert user.email == 'test@test.com'
        assert user.is_admin is False

def test_user_representation():
    from app.models import User
    user = User(username='testuser', email='test@test.com', password_hash='xxx')
    assert repr(user) == '<User testuser>'  

def test_admin_user_creation():
    from app.models import User
    admin = User(username='admin', email='admin@test.com', password_hash='xxx', is_admin=True)
    assert admin.is_admin is True

def test_model_unique_username(app):
    from app.models import User
    from app.extensions import db
    from sqlalchemy.exc import IntegrityError

    u1 = User(username='unique', email='u1@test.com', password_hash='x')
    u2 = User(username='unique', email='u2@test.com', password_hash='y')
    
    db.session.add(u1)
    db.session.commit()
    
    db.session.add(u2)
    with pytest.raises(IntegrityError): # (Unique constraint)
        db.session.commit()
    db.session.rollback()

def test_model_unique_email(app):
    from app.models import User
    from app.extensions import db
    from sqlalchemy.exc import IntegrityError

    u1 = User(username='u1', email='same@test.com', password_hash='x')
    u2 = User(username='u2', email='same@test.com', password_hash='y')
    
    db.session.add(u1)
    db.session.commit()
    
    db.session.add(u2)
    with pytest.raises(IntegrityError): #
        db.session.commit()
    db.session.rollback()
