from flask import Flask
from .config import Config
from .extensions import db, jwt, bcrypt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Import models (needed so SQLAlchemy knows about them)
    from .models.user_model import User  
    from .models.pipeline_result_model import PipelineResult
    with app.app_context():
         db.create_all()   # Create tables if they don’t exist

    # Register Blueprints (routes)
    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    from .routes.pipeline_routes import pipeline_bp
    app.register_blueprint(pipeline_bp, url_prefix="/api")
    from .routes.history_routes import history_bp
    app.register_blueprint(history_bp, url_prefix="/api")
    return app
