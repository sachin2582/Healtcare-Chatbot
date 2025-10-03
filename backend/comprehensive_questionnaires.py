"""
Comprehensive questionnaires for healthcare chatbot
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from models import Questionnaire
from sqlalchemy.orm import Session

# Comprehensive questionnaires for different healthcare scenarios
COMPREHENSIVE_QUESTIONNAIRES = [
    # General/Greeting Questionnaires
    {
        "trigger_keywords": "hello,hi,hey,good morning,good afternoon,good evening,greetings,start,begin",
        "question": "Hello! I'm your healthcare assistant. How can I help you today?",
        "response_template": "Hello! I'm here to help you with your healthcare needs. You can ask me about:\n• Booking appointments\n• Health packages\n• Symptoms and medical advice\n• Emergency situations\n• General health questions\n\nWhat would you like assistance with?",
        "category": "general",
        "priority": 1
    },
    {
        "trigger_keywords": "help,assistance,support,what can you do,services,options",
        "question": "I can help you with various healthcare services. What specific assistance do you need?",
        "response_template": "I can assist you with:\n\n🏥 **Appointments**: Book doctor appointments, check availability\n📋 **Health Packages**: Browse and book health checkup packages\n🩺 **Symptoms**: Get initial guidance on symptoms (not medical diagnosis)\n🚨 **Emergency**: Get emergency contact information\n💊 **Medications**: Basic medication information\n📞 **Callbacks**: Request a callback from our healthcare team\n\nWhat service would you like to use?",
        "category": "general",
        "priority": 2
    },
    
    # Appointment Related Questionnaires
    {
        "trigger_keywords": "appointment,book appointment,schedule,meet doctor,see doctor,consultation",
        "question": "I'd be happy to help you book an appointment! What type of consultation do you need?",
        "response_template": "Great! To book an appointment, I'll need some information:\n\n1. **Specialty needed**: What type of doctor do you need to see?\n2. **Preferred date**: When would you like to schedule?\n3. **Preferred time**: Morning, afternoon, or evening?\n4. **Your details**: Name, phone number, and email\n\nWe have specialists in:\n• General Medicine\n• Cardiology\n• Dermatology\n• Gynecology\n• Pediatrics\n• Orthopedics\n• And more!\n\nWhat specialty do you need?",
        "category": "appointment",
        "priority": 1
    },
    {
        "trigger_keywords": "availability,slots,time slots,when available,doctor schedule",
        "question": "Let me check doctor availability for you. Which specialty are you looking for?",
        "response_template": "I can check availability for our doctors. Here's what I need:\n\n• **Specialty**: Which type of doctor?\n• **Date preference**: Any specific date or date range?\n• **Time preference**: Morning (9 AM - 12 PM), Afternoon (12 PM - 5 PM), or Evening (5 PM - 8 PM)?\n\nOur doctors typically have slots available Monday to Saturday. Which specialty interests you?",
        "category": "appointment",
        "priority": 2
    },
    
    # Symptoms and Medical Advice Questionnaires
    {
        "trigger_keywords": "symptoms,pain,ache,fever,cough,headache,stomach,feeling unwell,sick",
        "question": "I understand you're experiencing symptoms. Can you tell me more about what you're feeling?",
        "response_template": "I'm here to provide initial guidance on your symptoms. Please note: **This is not a medical diagnosis** - you should consult a doctor for proper evaluation.\n\nTo help you better, please describe:\n\n1. **Main symptom**: What's bothering you most?\n2. **Duration**: How long have you had this?\n3. **Severity**: On a scale of 1-10, how would you rate it?\n4. **Other symptoms**: Any additional symptoms?\n5. **Triggers**: What makes it better or worse?\n\nBased on your symptoms, I can:\n• Provide general guidance\n• Suggest if you need immediate care\n• Recommend which type of doctor to see\n• Help you book an appointment\n\nWhat's your main symptom?",
        "category": "symptoms",
        "priority": 1
    },
    {
        "trigger_keywords": "fever,high temperature,hot,burning up",
        "question": "You mentioned fever. Can you tell me more about your temperature and other symptoms?",
        "response_template": "Fever can be a sign of various conditions. Here's what you should know:\n\n**If you have fever, please monitor:**\n• Temperature (normal: 98.6°F/37°C)\n• Duration of fever\n• Other symptoms (cough, body aches, etc.)\n• Hydration level\n\n**When to seek immediate care:**\n• Temperature above 103°F (39.4°C)\n• Fever lasting more than 3 days\n• Difficulty breathing\n• Severe headache\n• Rash with fever\n\n**General care:**\n• Stay hydrated\n• Rest\n• Use fever-reducing medications as directed\n• Monitor symptoms\n\nWould you like me to help you book an appointment with a doctor to evaluate your fever?",
        "category": "symptoms",
        "priority": 2
    },
    {
        "trigger_keywords": "chest pain,heart pain,chest discomfort,breathing difficulty,shortness of breath",
        "question": "Chest pain and breathing issues are serious symptoms. Can you describe what you're experiencing?",
        "response_template": "**⚠️ IMPORTANT**: Chest pain and breathing difficulties can be serious. Here's what you need to know:\n\n**If you have ANY of these, seek immediate medical attention:**\n• Severe chest pain\n• Pain radiating to arm, jaw, or back\n• Shortness of breath\n• Sweating or nausea with chest pain\n• Rapid or irregular heartbeat\n\n**Emergency numbers:**\n• Ambulance: 108\n• Emergency: 102\n\n**For non-emergency chest discomfort:**\n• Monitor your symptoms\n• Avoid physical exertion\n• Don't ignore persistent symptoms\n\n**I strongly recommend:**\n1. If symptoms are severe → Go to emergency room immediately\n2. If mild but persistent → Book urgent appointment with cardiologist\n3. If recurring → Schedule appointment with general physician\n\nWould you like me to help you book an urgent appointment?",
        "category": "emergency",
        "priority": 1
    },
    
    # Emergency Questionnaires
    {
        "trigger_keywords": "emergency,urgent,immediate help,critical,life threatening,accident",
        "question": "This sounds like an emergency situation. Can you tell me what's happening?",
        "response_template": "**🚨 EMERGENCY CONTACTS:**\n\n**Immediate Emergency:**\n• Ambulance: 108\n• Police: 100\n• Fire: 101\n\n**Our Emergency Services:**\n• Emergency Department: [Hospital Emergency Number]\n• 24/7 Helpline: [Emergency Helpline]\n\n**If this is a life-threatening emergency:**\n1. Call 108 immediately\n2. Go to nearest emergency room\n3. Don't wait for appointment booking\n\n**For urgent but non-life-threatening situations:**\n• I can help you book an urgent appointment\n• Contact our emergency helpline\n\n**Is this a life-threatening emergency that requires immediate ambulance (108)?**",
        "category": "emergency",
        "priority": 1
    },
    {
        "trigger_keywords": "accident,injury,fall,cut,bleeding,broken bone,sprain",
        "question": "You mentioned an accident or injury. How serious is it and what type of injury?",
        "response_template": "For accidents and injuries, here's what you should do:\n\n**🚨 Call 108 immediately if:**\n• Heavy bleeding\n• Unconsciousness\n• Severe head injury\n• Broken bones with deformity\n• Difficulty breathing\n• Chest or abdominal injury\n\n**For minor injuries:**\n• Clean and bandage cuts\n• Apply ice to reduce swelling\n• Rest the injured area\n• Elevate if possible\n\n**When to see a doctor:**\n• Deep cuts that may need stitches\n• Suspected broken bones\n• Injuries that don't improve\n• Signs of infection\n\n**I can help you:**\n1. Book urgent appointment with orthopedic doctor\n2. Find nearest emergency care center\n3. Connect you with our emergency helpline\n\nWhat type of injury are you dealing with?",
        "category": "emergency",
        "priority": 2
    },
    
    # Health Packages Questionnaires
    {
        "trigger_keywords": "health package,health checkup,medical checkup,full body checkup,preventive care",
        "question": "I'd be happy to help you with our health packages! What type of checkup are you looking for?",
        "response_template": "We offer comprehensive health packages for different needs:\n\n**🏥 Available Health Packages:**\n\n**Basic Health Checkup** - ₹2,500\n• Complete Blood Count, Blood Sugar, Blood Pressure\n• Ideal for: Young adults (18-40 years)\n\n**Comprehensive Health Checkup** - ₹5,000\n• Basic package + Lipid Profile, Kidney Function, Liver Function\n• Ideal for: Adults (25-50 years)\n\n**Executive Health Checkup** - ₹8,000\n• Comprehensive + Cardiac Markers, Thyroid, Vitamin D\n• Ideal for: Working professionals (30-60 years)\n\n**Senior Health Checkup** - ₹10,000\n• Executive + Bone Density, Cancer Markers, Heart Stress Test\n• Ideal for: Seniors (50+ years)\n\n**Features:**\n• Home sample collection available\n• Reports in 24 hours\n• Doctor consultation included\n• Digital reports\n\nWhich package interests you?",
        "category": "general",
        "priority": 3
    },
    {
        "trigger_keywords": "price,cost,how much,charges,fee,payment",
        "question": "I can provide you with detailed pricing information. What service are you asking about?",
        "response_template": "Here are our current pricing details:\n\n**💰 Consultation Fees:**\n• General Physician: ₹500\n• Specialist Consultation: ₹800\n• Senior Consultant: ₹1,200\n\n**📋 Health Packages:**\n• Basic Checkup: ₹2,500\n• Comprehensive: ₹5,000\n• Executive: ₹8,000\n• Senior: ₹10,000\n\n**💳 Payment Options:**\n• Cash\n• Credit/Debit Cards\n• UPI\n• Insurance accepted (check with provider)\n\n**📞 Callback Service:**\n• Free callback within 2 hours\n• No charges for consultation booking\n\nWould you like to:\n1. Book a consultation?\n2. Get more details about health packages?\n3. Request a callback for pricing discussion?",
        "category": "general",
        "priority": 4
    },
    
    # Medication Questionnaires
    {
        "trigger_keywords": "medicine,medication,drug,prescription,tablet,capsule,side effects",
        "question": "I can help with general medication information. What would you like to know?",
        "response_template": "I can provide general information about medications. **Important**: Always consult your doctor for medical advice.\n\n**I can help with:**\n• General information about common medications\n• Side effects awareness\n• Dosage timing\n• Drug interactions (basic)\n• Storage requirements\n\n**What I cannot do:**\n• Prescribe medications\n• Diagnose conditions\n• Replace doctor consultation\n• Provide medical advice for specific conditions\n\n**For medication concerns:**\n• Consult your prescribing doctor\n• Contact pharmacist\n• In case of severe side effects, seek immediate medical help\n\n**Emergency medication issues:**\n• Severe allergic reactions → Call 108\n• Overdose → Go to emergency room immediately\n\nWhat specific medication information do you need?",
        "category": "medication",
        "priority": 3
    },
    
    # Callback Request Questionnaires
    {
        "trigger_keywords": "callback,call me back,contact me,phone call,speak to someone",
        "question": "I can arrange a callback for you! What's your contact number and preferred time?",
        "response_template": "Perfect! I can arrange a callback from our healthcare team.\n\n**Callback Service:**\n• Free callback within 2 hours\n• Available 9 AM - 8 PM, Monday to Saturday\n• Our team will call you back to discuss your needs\n\n**To arrange callback, I need:**\n1. **Mobile number**: Your contact number\n2. **Preferred time**: Morning, Afternoon, or Evening\n3. **Reason**: What would you like to discuss?\n\n**Our team can help with:**\n• Appointment booking\n• Health package queries\n• General health questions\n• Insurance and payment queries\n• Medical records assistance\n\nPlease provide your mobile number and I'll arrange the callback right away!",
        "category": "general",
        "priority": 2
    },
    
    # Location and Contact Information
    {
        "trigger_keywords": "location,address,where,clinic,hospital,visit,come to",
        "question": "I can provide you with our location details. Are you looking for our main clinic or a specific branch?",
        "response_template": "**📍 Our Locations:**\n\n**Main Clinic:**\n• Address: [Main Clinic Address]\n• Timings: Monday-Saturday, 9 AM - 8 PM\n• Emergency: 24/7\n\n**Branch Clinics:**\n• [Branch 1 Address]\n• [Branch 2 Address]\n\n**🅿️ Facilities:**\n• Parking available\n• Wheelchair accessible\n• Pharmacy on-site\n• Lab services\n• Emergency services\n\n**📱 Contact Information:**\n• Phone: [Main Phone Number]\n• Emergency: [Emergency Number]\n• Email: [Email Address]\n\n**🚗 How to reach:**\n• Public transport accessible\n• Major landmarks nearby\n• GPS coordinates available\n\nWould you like directions to a specific location or more details about our facilities?",
        "category": "general",
        "priority": 4
    },
    
    # Insurance and Payment
    {
        "trigger_keywords": "insurance,claim,coverage,payment,finance,credit card,cashless",
        "question": "I can help with insurance and payment information. What specific details do you need?",
        "response_template": "**💳 Payment & Insurance Information:**\n\n**Accepted Payment Methods:**\n• Cash\n• Credit/Debit Cards (Visa, MasterCard, RuPay)\n• UPI (PhonePe, Google Pay, Paytm)\n• Net Banking\n• EMI options available\n\n**🏥 Insurance Coverage:**\n• We accept most major insurance providers\n• Cashless treatment available\n• Pre-authorization support\n• Claim assistance provided\n\n**📋 Insurance Process:**\n1. Bring insurance card/ID\n2. Pre-authorization (if required)\n3. Treatment\n4. Direct billing to insurance\n\n**💡 Financial Assistance:**\n• EMI options for major treatments\n• Corporate tie-ups available\n• Senior citizen discounts\n• Regular patient benefits\n\n**Need help with:**\n• Checking insurance coverage?\n• Understanding payment options?\n• Setting up cashless treatment?\n\nWhat specific payment or insurance assistance do you need?",
        "category": "general",
        "priority": 4
    },
    
    # Doctor Information
    {
        "trigger_keywords": "doctor,specialist,consultant,physician,expertise,qualification",
        "question": "I can provide information about our doctors and specialists. What specialty are you interested in?",
        "response_template": "**👨‍⚕️ Our Medical Team:**\n\n**Available Specialties:**\n• **General Medicine** - Dr. [Name] (15+ years)\n• **Cardiology** - Dr. [Name] (20+ years)\n• **Dermatology** - Dr. [Name] (12+ years)\n• **Gynecology** - Dr. [Name] (18+ years)\n• **Pediatrics** - Dr. [Name] (10+ years)\n• **Orthopedics** - Dr. [Name] (16+ years)\n• **ENT** - Dr. [Name] (14+ years)\n• **Ophthalmology** - Dr. [Name] (11+ years)\n\n**Our Doctors:**\n• Highly qualified and experienced\n• Board-certified specialists\n• Regular training and updates\n• Patient-centered approach\n• Multi-language support\n\n**Consultation Features:**\n• Detailed examination\n• Personalized treatment plans\n• Follow-up care\n• Digital prescriptions\n• Health records maintenance\n\nWhich specialty are you looking for? I can provide more details about specific doctors and their availability.",
        "category": "general",
        "priority": 3
    },
    
    # Follow-up and General Health
    {
        "trigger_keywords": "follow up,next appointment,checkup,review,progress,improvement",
        "question": "I can help you schedule a follow-up appointment. When was your last visit and what's the follow-up for?",
        "response_template": "**📅 Follow-up Appointment Booking:**\n\n**For follow-up appointments, I need:**\n1. **Previous visit date**: When did you last visit?\n2. **Doctor name**: Which doctor did you see?\n3. **Follow-up reason**: What's the follow-up for?\n4. **Preferred date/time**: Your availability\n\n**Follow-up Guidelines:**\n• Usually scheduled 1-2 weeks after initial visit\n• Bring previous reports and prescriptions\n• Note any changes in symptoms\n• Prepare questions for the doctor\n\n**Benefits of Regular Follow-ups:**\n• Monitor treatment progress\n• Adjust medications if needed\n• Early detection of issues\n• Continuous care and support\n\n**I can help you:**\n• Check doctor availability\n• Book convenient time slots\n• Send appointment reminders\n• Coordinate with previous treatment\n\nWhat's the follow-up for, and when would you like to schedule it?",
        "category": "appointment",
        "priority": 3
    },
    
    # General Health Advice
    {
        "trigger_keywords": "health advice,healthy lifestyle,prevention,wellness,diet,exercise",
        "question": "I'm happy to share general health and wellness tips! What area of health are you interested in?",
        "response_template": "**💪 General Health & Wellness Tips:**\n\n**🥗 Nutrition:**\n• Eat balanced meals with fruits, vegetables, whole grains\n• Stay hydrated (8-10 glasses of water daily)\n• Limit processed foods and sugar\n• Include lean proteins and healthy fats\n\n**🏃‍♂️ Physical Activity:**\n• 30 minutes of moderate exercise daily\n• Include cardio and strength training\n• Take regular breaks if you have a desk job\n• Aim for 10,000 steps daily\n\n**😴 Sleep & Stress:**\n• 7-9 hours of quality sleep\n• Practice stress management techniques\n• Maintain regular sleep schedule\n• Create relaxing bedtime routine\n\n**🩺 Preventive Care:**\n• Regular health checkups\n• Vaccinations up to date\n• Screenings as recommended\n• Know your family medical history\n\n**🚫 Avoid:**\n• Smoking and excessive alcohol\n• Sedentary lifestyle\n• Ignoring symptoms\n• Self-medication\n\nWould you like specific advice on any of these areas?",
        "category": "general",
        "priority": 5
    },
    
    # Additional Specialized Questionnaires
    {
        "trigger_keywords": "diabetes,sugar,blood sugar,glucose,insulin",
        "question": "You mentioned diabetes or blood sugar concerns. Can you tell me more about your specific situation?",
        "response_template": "**🩸 Diabetes Information & Support:**\n\n**Important**: Always follow your doctor's advice for diabetes management.\n\n**General Guidelines:**\n• Monitor blood sugar regularly\n• Follow prescribed medication schedule\n• Maintain healthy diet\n• Regular physical activity\n• Regular doctor checkups\n\n**Warning Signs to Watch:**\n• High blood sugar symptoms\n• Low blood sugar symptoms\n• Changes in vision\n• Frequent infections\n• Slow healing wounds\n\n**When to Seek Immediate Care:**\n• Very high or very low blood sugar\n• Difficulty breathing\n• Confusion or unconsciousness\n• Severe nausea/vomiting\n\n**I can help you:**\n• Book appointment with endocrinologist\n• Connect with diabetes educator\n• Schedule regular monitoring\n\nWould you like to book an appointment with our diabetes specialist?",
        "category": "symptoms",
        "priority": 2
    },
    {
        "trigger_keywords": "pregnancy,pregnant,maternity,antenatal,delivery,baby",
        "question": "Congratulations! I can help you with pregnancy-related care and appointments. What do you need assistance with?",
        "response_template": "**🤱 Pregnancy Care Services:**\n\n**Available Services:**\n• Antenatal checkups\n• Ultrasound scans\n• Pregnancy monitoring\n• Delivery planning\n• Postnatal care\n• Baby care consultations\n\n**Pregnancy Care Schedule:**\n• First trimester: Monthly visits\n• Second trimester: Bi-weekly visits\n• Third trimester: Weekly visits\n• High-risk pregnancies: As recommended\n\n**Our Obstetric Team:**\n• Experienced gynecologists\n• 24/7 emergency care\n• Delivery suite facilities\n• NICU support\n\n**Important Reminders:**\n• Take prenatal vitamins\n• Regular checkups\n• Monitor fetal movements\n• Know warning signs\n\n**Emergency Pregnancy Symptoms:**\n• Severe abdominal pain\n• Heavy bleeding\n• Severe headache\n• Vision problems\n• Reduced fetal movement\n\nWhat specific pregnancy care do you need?",
        "category": "appointment",
        "priority": 2
    },
    {
        "trigger_keywords": "child,baby,infant,pediatric,children,kids",
        "question": "I can help you with pediatric care for your child. What specific care does your child need?",
        "response_template": "**👶 Pediatric Care Services:**\n\n**Available Services:**\n• Well-baby checkups\n• Vaccinations\n• Growth monitoring\n• Development assessments\n• Illness consultations\n• Emergency pediatric care\n\n**Age-based Care:**\n• Newborn (0-1 month)\n• Infant (1-12 months)\n• Toddler (1-3 years)\n• Preschool (3-5 years)\n• School age (5-12 years)\n• Adolescent (12-18 years)\n\n**Our Pediatric Team:**\n• Board-certified pediatricians\n• Child-friendly environment\n• Emergency pediatric care\n• Specialist referrals\n\n**Vaccination Schedule:**\n• Birth to 18 months\n• School-age boosters\n• Adolescent vaccines\n• Catch-up schedules\n\n**When to Seek Immediate Care:**\n• High fever in infants\n• Breathing difficulties\n• Severe dehydration\n• Unconsciousness\n• Severe allergic reactions\n\nWhat specific care does your child need?",
        "category": "appointment",
        "priority": 2
    },
    {
        "trigger_keywords": "mental health,depression,anxiety,stress,psychological,counseling",
        "question": "I understand you're concerned about mental health. I can help connect you with appropriate mental health resources.",
        "response_template": "**🧠 Mental Health Support:**\n\n**Available Services:**\n• Mental health consultations\n• Counseling sessions\n• Psychiatric evaluations\n• Therapy sessions\n• Crisis intervention\n• Support groups\n\n**Our Mental Health Team:**\n• Licensed psychiatrists\n• Clinical psychologists\n• Counselors\n• Social workers\n\n**Common Concerns We Address:**\n• Anxiety and depression\n• Stress management\n• Relationship issues\n• Grief and loss\n• Addiction support\n• Trauma counseling\n\n**Crisis Support:**\n• 24/7 crisis helpline\n• Emergency mental health services\n• Suicide prevention support\n• Immediate intervention\n\n**Confidentiality:**\n• All sessions are confidential\n• Professional standards maintained\n• Privacy protected\n\n**When to Seek Immediate Help:**\n• Thoughts of self-harm\n• Severe depression\n• Panic attacks\n• Suicidal thoughts\n• Psychotic symptoms\n\nWould you like to schedule a mental health consultation?",
        "category": "appointment",
        "priority": 2
    },
    {
        "trigger_keywords": "elderly,senior,old age,geriatric,aging,65+",
        "question": "I can help you with specialized care for elderly patients. What specific assistance do you need?",
        "response_template": "**👴👵 Geriatric Care Services:**\n\n**Specialized Services:**\n• Comprehensive geriatric assessments\n• Chronic disease management\n• Medication reviews\n• Fall risk assessments\n• Memory evaluations\n• Quality of life assessments\n\n**Common Health Concerns:**\n• Arthritis and joint problems\n• Heart disease\n• Diabetes management\n• High blood pressure\n• Memory issues\n• Vision and hearing problems\n\n**Our Geriatric Team:**\n• Geriatricians\n• Physical therapists\n• Occupational therapists\n• Social workers\n• Nutritionists\n\n**Care Coordination:**\n• Multi-specialty care\n• Family involvement\n• Care planning\n• Regular monitoring\n• Emergency support\n\n**Preventive Care:**\n• Regular health screenings\n• Vaccinations\n• Bone density tests\n• Cancer screenings\n• Cardiovascular assessments\n\n**Support Services:**\n• Home health care\n• Rehabilitation services\n• Transportation assistance\n• Social activities\n\nWhat specific geriatric care service do you need?",
        "category": "appointment",
        "priority": 2
    }
]

def populate_comprehensive_questionnaires():
    """Populate the database with comprehensive questionnaires"""
    db = next(get_db())
    
    try:
        # Clear existing questionnaires
        db.query(Questionnaire).delete()
        
        # Add comprehensive questionnaires
        questionnaires = COMPREHENSIVE_QUESTIONNAIRES
        
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
        print(f"✅ Successfully added {len(questionnaires)} comprehensive questionnaires to the database")
        
        # Print summary
        print("\n📋 Questionnaire Summary:")
        categories = ["general", "symptoms", "appointment", "emergency", "medication"]
        for category in categories:
            count = db.query(Questionnaire).filter(Questionnaire.category == category).count()
            print(f"   {category.title()}: {count} questionnaires")
            
    except Exception as e:
        print(f"❌ Error populating questionnaires: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_comprehensive_questionnaires()
