import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPets } from '../services/petsService.js';
import { getFeaturedStory } from '../services/storiesService.js';
import PetCard from '../components/PetCard.jsx';
import Hero from '../components/Hero.jsx';
import Button from '../components/Button.jsx';
import '../styles/landing.css';
import faqItems from '../data/faqs.json';
import ResponsiveImage from '../components/ResponsiveImage';

function formatStoryDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getPhotoUrl(filePath) {
  if (!filePath) return null;
  return `http://localhost:3000/${filePath}`;
}

function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(0);
  const [featuredPets, setFeaturedPets] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);

  useEffect(() => {
    async function fetchFeaturedPets() {
      try {
        const pets = await getPets();
        setFeaturedPets(pets.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured pets:', err);
      }
    }
    fetchFeaturedPets();
  }, []);

  useEffect(() => {
    async function fetchStory() {
      try {
        const story = await getFeaturedStory();
        setFeaturedStory(story);
      } catch (err) {
        console.error('Failed to load featured story:', err);
      }
    }
    fetchStory();
  }, []);

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? -1 : index);

  return (
    <>
      <Hero />
    
      <section className="featured-story">
        <h1>Featured Story</h1>
        <div className="story-content">
          {featuredStory ? (
            <>
              {/* prefer cover_photo (story photo o fallback pet_photo) */}
              {featuredStory.cover_photo ? (
                <img
                  src={getPhotoUrl(featuredStory.cover_photo)}
                  alt={featuredStory.pet.name}
                />
              ) : (
                <ResponsiveImage name="julie-anne" type="stories" alt={featuredStory.pet.name} lazy={true} />
              )}
              <div className="story-text">
                <p className="story-label">Adoption Success Story</p>
                <h2>"{featuredStory.title}"</h2>
                <p>{featuredStory.content}</p>
                <p className="story-adopter">{featuredStory.adopter_name}</p>
                <p className="story-adopter" style={{ color: 'var(--color-text-secondary)', fontWeight: '400', fontSize: '12px' }}>
                  Adopted {featuredStory.pet.name} • {formatStoryDate(featuredStory.published_at)}
                </p>
                <button className="story-button" onClick={() => navigate('/pets')}>Adopt Now</button>
              </div>
            </>
          ) : (
            // hardcoded fallback
            <>
              <ResponsiveImage name="julie-anne" type="stories" alt="Julie Anne with adopted cat Henhen" lazy={true} />
              <div className="story-text">
                <p className="story-label">Adoption Success Story</p>
                <h2>"Henhen changed our lives and we changed hers"</h2>
                <p>
                  When we first met Henhen, she was a tiny kitten hiding behind a stack of boxes — scared, hungry,
                  and unsure who to trust. We weren't planning on adopting that day, but the moment she looked up
                  at us, we knew. She came home with us, and our lives have never been the same since. Watching
                  her grow into a confident, loving cat has been one of the most rewarding experiences of our
                  lives. Thank you, Purrfect Haven, for giving us our family member.
                </p>
                <p className="story-adopter">Julie Anne Santos</p>
                <p className="story-adopter" style={{ color: 'var(--color-text-secondary)', fontWeight: '400', fontSize: '12px' }}>
                  Adopted Henhen • Dec 2023
                </p>
                <button className="story-button" onClick={() => navigate('/pets')}>Adopt Now</button>
              </div>
            </>
          )}

        </div>
      </section>

      <section className="pets-adoption">
        <div className="section-header">
          <h1>Available Pets for Adoption</h1>
          <p>Find your perfect furry friend from our loving pets waiting for their forever homes!</p>
        </div>
        <div className="pets-grid">
          {featuredPets.map((pet) => <PetCard key={pet.pet_id} pet={pet} />)}
        </div>

        {/* Uses Custom button reusable component */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/pets')}>View All</Button>
        </div>

      </section>

      <section className="faq-section">
        <div className="section-header"><h1>Frequently Asked Questions</h1></div>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{item.question}</span>
                <span className="faq-toggle">▼</span>
              </button>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Landing;