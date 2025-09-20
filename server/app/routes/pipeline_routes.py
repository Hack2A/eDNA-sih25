import sys
import os
from datetime import datetime
from app.models.pipeline_result_model import PipelineResult
from app.models.dashboard_modle import UserSummary
from app import db

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

# Add pipeline directory to sys.path for internal pipeline imports
PIPELINE_DIR = os.path.join(PROJECT_ROOT, 'pipeline')
if PIPELINE_DIR not in sys.path:
    sys.path.append(PIPELINE_DIR)

# Add pipeline venv site-packages to sys.path
PIPELINE_VENV = os.path.join(PIPELINE_DIR, 'venv', 'Lib', 'site-packages')
if os.path.exists(PIPELINE_VENV) and PIPELINE_VENV not in sys.path:
    sys.path.insert(0, PIPELINE_VENV)

from pipeline.predict_and_annotate import process_prediction_request
from flask import Blueprint, request, jsonify
import tempfile
from flask_jwt_extended import jwt_required, get_jwt_identity

pipeline_bp = Blueprint('pipeline', __name__)

@pipeline_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        user_id = int(get_jwt_identity())

        # Handle file or manual input
        if request.content_type and 'multipart/form-data' in request.content_type:
            file_type = request.form.get('file_type')
            
            if file_type == 'file':
                if 'data' not in request.files:
                    return jsonify({"status": "error", "message": "No file uploaded"}), 400
                
                uploaded_file = request.files['data']
                if uploaded_file.filename == '':
                    return jsonify({"status": "error", "message": "No file selected"}), 400
                
                filename = uploaded_file.filename.lower()
                if filename.endswith('.fasta') or filename.endswith('.fa'):
                    file_suffix = '.fasta'
                elif filename.endswith('.txt'):
                    file_suffix = '.txt'
                elif filename.endswith('.csv'):
                    file_suffix = '.csv'
                else:
                    file_suffix = '.txt'
                
                with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix=file_suffix) as temp_file:
                    content = uploaded_file.read().decode('utf-8')
                    temp_file.write(content)
                    temp_file_path = temp_file.name
                
                request_data = {
                    "file_type": "file",
                    "data": temp_file_path,
                    "user_id": user_id
                }
                
                try:
                    response = process_prediction_request(request_data)
                    response["user_id"] = user_id

                    # Save result to PipelineResult
                    result_entry = PipelineResult(
                        user_id=user_id,
                        result_json=response,
                        created_at=datetime.utcnow()
                    )
                    db.session.add(result_entry)
                    db.session.commit()

                    # Update UserSummary
                    summary = UserSummary.query.filter_by(user_id=user_id).first()
                    if not summary:
                        summary = UserSummary(user_id=user_id, species_list=[])
                        db.session.add(summary)
                        db.session.commit()  # Commit new summary

                    summary.update_summary(response.get("predictions", []))
                    db.session.commit()

                    return jsonify(response)
                finally:
                    if os.path.exists(temp_file_path):
                        os.unlink(temp_file_path)

            elif file_type == 'manual':
                data = request.form.get('data')
                if not data:
                    return jsonify({"status": "error", "message": "No sequence data provided"}), 400
                
                request_data = {
                    "file_type": "manual",
                    "data": data,
                    "user_id": user_id
                }
                response = process_prediction_request(request_data)
                response["user_id"] = user_id

                # Save result to PipelineResult
                result_entry = PipelineResult(
                    user_id=user_id,
                    result_json=response,
                    created_at=datetime.utcnow()
                )
                db.session.add(result_entry)
                db.session.commit()

                # Update UserSummary
                summary = UserSummary.query.filter_by(user_id=user_id).first()
                if not summary:
                    summary = UserSummary(user_id=user_id, species_list=[])
                    db.session.add(summary)
                    db.session.commit()

                summary.update_summary(response.get("predictions", []))
                db.session.commit()

                return jsonify(response)
            else:
                return jsonify({"status": "error", "message": "Invalid file_type. Must be 'file' or 'manual'"}), 400
                
        else:
            # JSON input
            request_data = request.get_json()
            if not request_data:
                return jsonify({"status": "error", "message": "No JSON data provided"}), 400
            request_data["user_id"] = user_id
            response = process_prediction_request(request_data)
            response["user_id"] = user_id

            # Save result to PipelineResult
            result_entry = PipelineResult(
                user_id=user_id,
                result_json=response,
                created_at=datetime.utcnow()
            )
            db.session.add(result_entry)
            db.session.commit()

            # Update UserSummary
            summary = UserSummary.query.filter_by(user_id=user_id).first()
            if not summary:
                summary = UserSummary(user_id=user_id, species_list=[])
                db.session.add(summary)
                db.session.commit()

            summary.update_summary(response.get("predictions", []))
            db.session.commit()

            return jsonify(response)
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
