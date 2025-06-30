import os
from flask import Flask
from flask_cors import CORS
from extensions import db
from routes import bp
import joblib

def create_app():
    app = Flask(__name__)

    # ✅ Correct DB path (instance/products.db)
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, 'instance', 'products.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ✅ Init extensions
    db.init_app(app)
    CORS(app)

    # ✅ Register routes
    app.register_blueprint(bp, url_prefix='/api')


    # ✅ Load anomaly model into config so routes can access it
    model_path = os.path.join(basedir, 'anomaly_detector.pkl')
    if os.path.exists(model_path):
        app.config['ANOMALY_MODEL'] = joblib.load(model_path)
    else:
        print("⚠️ anomaly_detector.pkl not found!")

    return app

