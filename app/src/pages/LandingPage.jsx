import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';
import faqItems from '../data/faqs.json';
import ResponsiveImage from '../components/ResponsiveImage';

function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(0);

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? -1 : index);

  return (
    <>
      {/* Hero is ok for now */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Every Pet Deserves a</h1>
          <h1>Loving Home</h1>
          <p>Browse adoptable pets around Tacloban City, report animals in need, or post community adoptions. Together, we can make a difference for our Tacloban fur babies.</p>
          <div className="hero-buttons">
            <button className="hero-button" onClick={() => navigate('/pets')}>Find a pet</button>
            <button className="hero-button" onClick={() => navigate('/report')}>Report a rescue</button>
          </div>
        </div>
      </section>

      {/* New button out of place */}
      <section className="featured-story">
        <h1>Featured Story</h1>
        <div className="story-content">
          <ResponsiveImage name="julie-anne" type="stories" alt="Julie Anne with adopted cat Henhen" lazy={true} />
          <div className="story-text">
            <p className="story-label">Adoption Success Story</p>
            <h2>"Henhen changed our lives and we changed hers"</h2>
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            <p className="story-adopter">Julie Anne Santos</p>
            <p className="story-adopter" style={{ color: 'var(--color-text-secondary)', fontWeight: '400', fontSize: '12px' }}>Adopted Henhen • Dec 2023</p>
            <button className="story-button">Adopt Now</button>
          </div>
        </div>
      </section>

      
      <section className="pets-adoption">
        <div className="section-header">
          <h1>Available Pets for Adoption</h1>
          <p>Find your perfect furry friend from our loving pets waiting for their forever homes!</p>
        </div>
        <div className="pets-grid">
          <div className="pet-card">
            <ResponsiveImage name="callie" type="pets" alt="Callie adoption pet" lazy={true} className="pet-image" />
            <p className="pet-name">Callie</p>
            <p className="pet-breed">Puspin</p>
            <p className="pet-age">3 yrs</p>
            <p className="pet-gender">Female</p>
          </div>
          <div className="pet-card">
            <ResponsiveImage name="elliot" type="pets" alt="Elliot adoption pet" lazy={true} className="pet-image" />
            <p className="pet-name">Elliot</p>
            <p className="pet-breed">German Shepherd</p>
            <p className="pet-age">3 yrs</p>
            <p className="pet-gender">Male</p>
          </div>
          <div className="pet-card">
            <ResponsiveImage name="samsam" type="pets" alt="Samsam adoption pet" lazy={true} className="pet-image" />
            <p className="pet-name">Samsam</p>
            <p className="pet-breed">Aspin</p>
            <p className="pet-age">3 yrs</p>
            <p className="pet-gender">Female</p>
          </div>
          <div className="pet-card">
            <ResponsiveImage name="tikay" type="pets" alt="Tikay adoption pet" lazy={true} className="pet-image" />
            <p className="pet-name">Tikay</p>
            <p className="pet-breed">Puspin</p>
            <p className="pet-age">3 yrs</p>
            <p className="pet-gender">Male</p>
          </div>
        </div>
        <button className="view-all-button" onClick={() => navigate('/pets')}>View All</button>
      </section>

      {/* Loop over instead*/}
      <section className="faq-section">
        <div className="section-header">
          <h1>Frequently Asked Questions</h1>
        </div>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{item.question}</span>
                <span className="faq-toggle">▼</span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Landing;