import sys
import os

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

pipeline_bp = Blueprint('pipeline', __name__)

@pipeline_bp.route('/predict', methods=['POST'])
def predict():
    try:
        request_data = request.get_json()
        response = process_prediction_request(request_data)
        return jsonify(response)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
