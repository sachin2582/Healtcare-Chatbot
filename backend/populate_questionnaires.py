"""
Script to populate the database with sample questionnaires
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from models import Questionnaire
from sqlalchemy.orm import Session

# Sample questionnaires for different scenarios


def populate_questionnaires():
    """Populate the database with sample questionnaires"""
    db = next(get_db())
    
    try:
        # Clear existing questionnaires
        db.query(Questionnaire).delete()
        
        # Add sample questionnaires
        questionnaires = SAMPLE_QUESTIONNAIRES
        
        for q_data in questionnaires:
            questionnaire = Questionnaire(
                trigger_keywords=q_data["trigger_keywords"],
                question=q_data["question"],
                response_template=q_data["response_template"],
                category=q_data["category"],
                priority=q_data["priority"],
                is_active=True
            )
            db.add(questionnaire)
        
        db.commit()
        print(f"✅ Successfully added {len(questionnaires)} questionnaires to the database")
        
        # Print summary
        print("\n📋 Questionnaire Summary:")
        for category in ["general", "symptoms", "appointment", "emergency", "medication"]:
            count = db.query(Questionnaire).filter(Questionnaire.category == category).count()
            print(f"   {category.title()}: {count} questionnaires")
            
    except Exception as e:
        print(f"❌ Error populating questionnaires: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_questionnaires()
