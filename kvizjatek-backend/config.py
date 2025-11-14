import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(basedir, '..', '.env')) 

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ez_egy_nagyon_titkos_kulcs_dev_celra'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, '..', 'site.db')
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'ez_egy_eros_jwt_kulcs'
    

    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') 
    OPENAI_BASE_URL = os.environ.get('OPENAI_BASE_URL') 