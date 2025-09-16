from flask import Blueprint, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.pipeline_result_model import PipelineResult   # Assuming you have a History model defined

history_bp = Blueprint('history', __name__, url_prefix='/history')

@history_bp.route('/', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    histories = PipelineResult.query.filter_by(user_id=user_id).order_by(PipelineResult.created_at.desc()).all()
    history_list = [
        {
            'id': h.id,
            'user_id': h.user_id,
            'created_at': h.created_at.isoformat(),
            'result_json': h.result_json
        }
        for h in histories
    ]
    return jsonify(history_list)