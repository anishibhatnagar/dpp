from flask import Flask
from flask_cors import CORS        # ✅ Add this
from extensions import db
from routes import bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    CORS(app)                      # ✅ Allow frontend to call backend
    app.register_blueprint(bp)

    return app
