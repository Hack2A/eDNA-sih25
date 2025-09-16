from app.extensions import db

class PipelineResult(db.Model):
    __tablename__ = 'pipeline_results'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    result_json = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, result_json, created_at):
        self.user_id = user_id
        self.result_json = result_json
        self.created_at = created_at