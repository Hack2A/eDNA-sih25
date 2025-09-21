from app.extensions import db
from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import JSON

class UserSummary(db.Model):
    __tablename__ = "user_summary"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=True, nullable=False)
    total_reports_generated = Column(Integer, default=0)
    total_species_found = Column(Integer, default=0)
    unique_species_found = Column(Integer, default=0)
    potential_discoveries = Column(Integer, default=0)
    species_list = Column(JSON, default=list)

    def update_summary(self, predictions: list):
        self.total_reports_generated += 1

        species_found = []
        for pred in predictions:
            final_taxonomy = pred.get("final_taxonomy")
            if final_taxonomy:
                species_found.append(final_taxonomy)
                if final_taxonomy.lower() in ["n/a", "unknown", "outlier"]:
                    self.potential_discoveries += 1
                    
        self.total_species_found += len(species_found)

        current = set(self.species_list or [])
        new = set(species_found)
        updated = current.union(new)
        self.species_list = list(updated)
        self.unique_species_found = len(self.species_list)
