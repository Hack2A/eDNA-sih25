from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.dashboard_modle import UserSummary

summary_bp = Blueprint("summary", __name__)

@summary_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    user_id = int(get_jwt_identity())
    summary = UserSummary.query.filter_by(user_id=user_id).first()
    if not summary:
        return jsonify({"status": "error", "message": "No summary found"}), 404

    return jsonify({
        "status": "success",
        "user_id": user_id,
        "total_reports_generated": summary.total_reports_generated,
        "total_species_found": summary.total_species_found,
        "unique_species_found": summary.unique_species_found,
        "potential_discoveries": summary.potential_discoveries
    })
