# -------------------------------
# Stage 1: Build dependencies
# -------------------------------
FROM python:3.11-slim AS build

WORKDIR /app

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy server and pipeline requirements
COPY server/requirements.txt ./server/requirements.txt
COPY pipeline/requirements.txt ./pipeline/requirements.txt

# Install Python dependencies separately for server and pipeline
RUN pip install --no-cache-dir -r server/requirements.txt
RUN pip install --no-cache-dir -r pipeline/requirements.txt

# -------------------------------
# Stage 2: Final runtime image
# -------------------------------
FROM python:3.11-slim

WORKDIR /app

# Copy installed dependencies from build stage
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

# Copy the application code
COPY server/ ./server
COPY pipeline/ ./pipeline

# Set working directory to server
WORKDIR /app/server

EXPOSE 5000

# Start the Flask app
CMD ["python", "run.py"]
