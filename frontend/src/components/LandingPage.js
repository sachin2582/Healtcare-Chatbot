import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import FloatingChatbot from './FloatingChatbot';
import CompleteAdminPanel from './CompleteAdminPanel';
import { useAppContext } from '../contexts/AppContext';
import { BRANDING, SERVICES, FALLBACK_DOCTORS, BUTTON_LABELS } from '../config/textConfig';
import './LandingPage.css';

const LandingPage = () => {
  const { patients, doctors, loading } = useAppContext();
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [clearChat, setClearChat] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const location = useLocation();

  // Use API doctors if available, otherwise fallback
  const displayDoctors = doctors.length > 0 ? doctors : FALLBACK_DOCTORS;

  const handleStartChat = (doctor) => {
    setSelectedDoctor(doctor);
    setShowChatbot(true);
    setClearChat(true); // Trigger chat clearing
    // Reset clearChat after a brief delay to allow the effect to trigger
    setTimeout(() => setClearChat(false), 100);
  };

  const handleCloseChat = () => {
    setShowChatbot(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>HealthCareAI</h1>
            <span className="tagline">Your Trusted Healthcare Partner</span>
          </div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#doctors">Our Doctors</a>
            <a href="#about">About</a>
            <button className="chat-btn" onClick={() => {
              setShowChatbot(true);
              setClearChat(true);
              setTimeout(() => setClearChat(false), 100);
            }}>
              Start Chat
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Advanced Healthcare at Your Fingertips</h1>
            <p>
              Experience the future of healthcare with our AI-powered assistant. 
              Get instant medical guidance, connect with doctors, and access 
              comprehensive health assessments 24/7.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowChatbot(true);
                  setClearChat(true);
                  setTimeout(() => setClearChat(false), 100);
                }}
              >
                Start Health Assessment
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
              <button 
                onClick={() => setShowAdmin(true)}
                style={{
                  background: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                🔧 Admin Panel
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="health-illustration">
              <div className="pulse-circle"></div>
              <div className="medical-icon">🏥</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {SERVICES.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors">
        <div className="container">
          <h2>Meet Our Expert Doctors</h2>
          <div className="doctors-grid">
            {displayDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-image">
                  <div className="placeholder-avatar">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                  <p className="experience">{doctor.experience} experience</p>
                  <button 
                    className="btn-consult"
                    onClick={() => handleStartChat(doctor)}
                  >
                    {BUTTON_LABELS.START_CHAT}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2>Why Choose Our Healthcare Platform?</h2>
              <ul className="features-list">
                <li>✅ Instant AI-powered health assessments</li>
                <li>✅ 24/7 availability for medical guidance</li>
                <li>✅ Expert doctor consultations</li>
                <li>✅ Comprehensive symptom analysis</li>
                <li>✅ Medication information and management</li>
                <li>✅ Emergency response protocols</li>
              </ul>
              <button 
                className="btn-primary"
                onClick={() => setShowChatbot(true)}
              >
                Try Our AI Assistant
              </button>
            </div>
            <div className="features-visual">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Availability</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Health Topics</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Expert Doctors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>HealthCareAI</h3>
              <p>Your trusted partner in healthcare technology, providing intelligent medical assistance and expert consultations.</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>AI Health Assessment</li>
                <li>Doctor Consultations</li>
                <li>Emergency Support</li>
                <li>Medication Management</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>Emergency: (555) 911-HELP</li>
                <li>Appointments: (555) 123-4567</li>
                <li>Email: support@healthcareai.com</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 HealthCareAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="chatbot-modal">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <h3>HealthCareAI Assistant</h3>
              {selectedDoctor && (
                <p>Consulting with {selectedDoctor.name} - {selectedDoctor.specialization}</p>
              )}
              <button className="close-btn" onClick={handleCloseChat}>×</button>
            </div>
            <div className="chatbot-content">
              <ChatInterface 
                patients={patients}
                doctors={doctors}
                selectedDoctor={selectedDoctor}
                onClose={handleCloseChat}
                clearChat={clearChat}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Widget */}
      <FloatingChatbot />

      {/* Admin Panel Modal */}
      {showAdmin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '95%',
            height: '90%',
            backgroundColor: 'white',
            borderRadius: '10px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAdmin(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '30px',
                cursor: 'pointer',
                zIndex: 10000
              }}
            >
              ×
            </button>
            <CompleteAdminPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
