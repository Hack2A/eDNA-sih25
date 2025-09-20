from sqlalchemy import event
from app.models.pipeline_result_model import PipelineResult
from app.models.dashboard_modle import UserSummary
from app.extensions import db

@event.listens_for(PipelineResult, "after_insert")
def update_summary_after_pipeline_insert(mapper, connection, target):
    try:
        predictions = target.result_json.get("predictions", [])
        user_id = target.user_id

        summary = UserSummary.query.filter_by(user_id=user_id).first()
        if not summary:
            summary = UserSummary(user_id=user_id, species_list=[])
            db.session.add(summary)

        summary.update_summary(predictions)
        db.session.commit()
    except Exception as e:
        print("⚠️ Summary update failed:", e)
        db.session.rollback()
