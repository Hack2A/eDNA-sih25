from sqlalchemy import Column, Integer, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class PipelineResult(Base):
    __tablename__ = 'pipeline_results'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    result_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False)

    def __init__(self, user_id, result_json, created_at):
        self.user_id = user_id
        self.result_json = result_json
        self.created_at = created_at