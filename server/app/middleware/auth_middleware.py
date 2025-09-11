from functools import wraps
from flask import request, jsonify
from app.utils.token import decode_token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing!"}), 401

        data = decode_token(token)
        if not data:
            return jsonify({"error": "Token is invalid or expired!"}), 401

        request.user_id = data["user_id"]  # attach user id

        return f(*args, **kwargs)
    return decorated
