import sys
import os

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../'))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from pipeline.predict_and_annotate import process_prediction_request
from flask import Blueprint, request, jsonify

pipeline_bp = Blueprint('pipeline', __name__)

@pipeline_bp.route('/predict', methods=['POST'])
def predict():
    try:
        request_data = request.get_json()
        response = process_prediction_request(request_data)
        return jsonify(response)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
