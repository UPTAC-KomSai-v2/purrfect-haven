import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPets } from '../services/petsService.js';
import PetCard from '../components/PetCard.jsx';
import Hero from '../components/Hero.jsx';
import Button from '../components/Button.jsx';
import '../styles/landing.css';
import faqItems from '../data/faqs.json';
import ResponsiveImage from '../components/ResponsiveImage';

function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(0);

  // State for the pets shown in the "Available Pets" section on the homepage.
  // We fetch these from the backend instead of hardcoding them.
  const [featuredPets, setFeaturedPets] = useState([]);

  // Fetch a few available pets when the page first loads.
  // We only show 4 pets on the homepage as a preview — the full list is on /pets.
  useEffect(() => {
    async function fetchFeaturedPets() {
      try {
        const pets = await getPets();
        // slice(0, 4) keeps only the first 4 pets from the list
        setFeaturedPets(pets.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured pets:', err);
        // If this fails, the section just shows nothing — no big deal
      }
    }
    fetchFeaturedPets();
  }, []);

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? -1 : index);

  return (
    <>
      <Hero />
      
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
            <Button>Adopt Now</Button>
          </div>
        </div>
      </section>

      
      <section className="pets-adoption">
        <div className="section-header">
          <h1>Available Pets for Adoption</h1>
          <p>Find your perfect furry friend from our loving pets waiting for their forever homes!</p>
        </div>

        {/* Pets are now fetched from the backend.
            If the list is empty (still loading or API failed), nothing shows. */}
        <div className="pets-grid">
          {featuredPets.map((pet) => (
            <PetCard key={pet.pet_id} pet={pet} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/pets')}>View All</Button>
        </div>
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