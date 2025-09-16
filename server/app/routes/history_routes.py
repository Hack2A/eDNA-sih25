from flask import Flask, Blueprint, request, jsonify

history_bp = Blueprint('history', __name__)
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from ..models.pipeline_result_model import PipelineResult
from datetime import datetime

@history_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    results = PipelineResult.query.filter_by(user_id=user_id).order_by(PipelineResult.created_at.desc()).all()
    
    history = []
    for result in results:
        history.append({
            "id": result.id,
            "result_json": result.result_json,
            "created_at": result.created_at.isoformat()
        })
    
    return jsonify({"status": "success", "history": history}), 200

@history_bp.route('/latest-result', methods=['GET'])
@jwt_required()
def get_latest_result():
    user_id = int(get_jwt_identity())
    latest = PipelineResult.query.filter_by(user_id=user_id).order_by(PipelineResult.created_at.desc()).first()
    if not latest:
        return jsonify({"status": "error", "message": "No results found for this user."}), 404

    result = {
        "id": latest.id,
        "result_json": latest.result_json,
        "created_at": latest.created_at.isoformat()
    }
    return jsonify({"status": "success", "latest_result": result}), 200