from flask import Blueprint, request, jsonify
from app.models.user_model import User
from app.extensions import db, bcrypt, jwt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth_bp", __name__)

# Register route
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


# Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    # ✅ Convert id to string for JWT subject
    access_token = create_access_token(identity=str(user.id))

    # Return token + user data
    user_data = {
        "id": user.id,
        "email": user.email
        # Add more fields here if your User model has them
    }

    return jsonify({
        "access_token": access_token,
        "user": user_data
    }), 200


# Profile route
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    # ✅ Convert back to int for database lookup
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user_data = {
        "id": user.id,
        "email": user.email
        # Add more fields here if your User model has them
    }

    return jsonify({"user": user_data}), 200
