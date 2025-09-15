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
import tempfile
import os

pipeline_bp = Blueprint('pipeline', __name__)

@pipeline_bp.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if request contains form data or JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle form-data (including file uploads)
            file_type = request.form.get('file_type')
            
            if file_type == 'file':
                # Handle file upload
                if 'data' not in request.files:
                    return jsonify({"status": "error", "message": "No file uploaded"}), 400
                
                uploaded_file = request.files['data']
                if uploaded_file.filename == '':
                    return jsonify({"status": "error", "message": "No file selected"}), 400
                
                # Determine file extension from uploaded filename
                filename = uploaded_file.filename.lower()
                if filename.endswith('.fasta') or filename.endswith('.fa'):
                    file_suffix = '.fasta'
                elif filename.endswith('.txt'):
                    file_suffix = '.txt'
                elif filename.endswith('.csv'):
                    file_suffix = '.csv'
                else:
                    # Default to .txt for unknown extensions
                    file_suffix = '.txt'
                
                # Save uploaded file temporarily with appropriate extension
                with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix=file_suffix) as temp_file:
                    # Read and save the uploaded file content
                    content = uploaded_file.read().decode('utf-8')
                    temp_file.write(content)
                    temp_file_path = temp_file.name
                
                request_data = {
                    "file_type": "file",
                    "data": temp_file_path
                }
                
                try:
                    response = process_prediction_request(request_data)
                    return jsonify(response)
                finally:
                    # Clean up temporary file
                    if os.path.exists(temp_file_path):
                        os.unlink(temp_file_path)
                        
            elif file_type == 'manual':
                # Handle manual sequence input via form
                data = request.form.get('data')
                if not data:
                    return jsonify({"status": "error", "message": "No sequence data provided"}), 400
                
                request_data = {
                    "file_type": "manual",
                    "data": data
                }
                response = process_prediction_request(request_data)
                return jsonify(response)
            else:
                return jsonify({"status": "error", "message": "Invalid file_type. Must be 'file' or 'manual'"}), 400
                
        else:
            # Handle JSON data (existing functionality)
            request_data = request.get_json()
            if not request_data:
                return jsonify({"status": "error", "message": "No JSON data provided"}), 400
            response = process_prediction_request(request_data)
            return jsonify(response)
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
