from flask import Blueprint, request, jsonify
from app.models.user_model import User
from app.extensions import db, bcrypt, jwt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

auth_bp = Blueprint("auth_bp", __name__)

# ==========================
# JWT Custom Error Handlers
# ==========================
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "status": "error",
        "message": "Token has expired"
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    return jsonify({
        "status": "error",
        "message": "Invalid token: " + error_string
    }), 422

@jwt.unauthorized_loader
def missing_token_callback(error_string):
    return jsonify({
        "status": "error",
        "message": "Missing token: " + error_string
    }), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "status": "error",
        "message": "Token has been revoked"
    }), 401

# ==========================
# Register route
# ==========================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

# ==========================
# Login route
# ==========================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    user_data = {
        "id": user.id,
        "email": user.email
    }

    return jsonify({
        "access_token": access_token,
        "user": user_data
    }), 200

# ==========================
# Profile route
# ==========================
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user_data = {
        "id": user.id,
        "email": user.email
    }

    return jsonify({"user": user_data}), 200

# ==========================
# Check Token route
# ==========================
@auth_bp.route("/check-auth", methods=["GET"])
@jwt_required()
def check_token():
    user_id = get_jwt_identity()
    return jsonify({
        "status": "success",
        "message": "Token is valid",
        "user_id": user_id
    }), 200
