import { useState, useEffect } from 'react';
import { getPets, getAdoptedPets } from '../services/petsService.js';
import PetCard from '../components/PetCard.jsx';
import '../styles/pets.css';

const SPECIES_FILTERS = [
  { label: 'All Types', value: '' },
  { label: 'Cats',      value: 'cat' },
  { label: 'Dogs',      value: 'dog' },
  { label: 'Birds',     value: 'bird' },
  { label: 'Others',    value: 'other' }, 
];

function AdoptionListPage() {
  // --- State ---
  const [availablePets, setAvailablePets] = useState([]); 
  const [adoptedPets, setAdoptedPets]     = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(''); 
  const [locationSearch, setLocationSearch] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAvailablePets() {
      setLoading(true);
      setError('');

      try {
        const pets = await getPets({
          species:  selectedSpecies,
          location: locationSearch,
        });
        setAvailablePets(pets);
      } catch (err) {
        console.error('Failed to load pets:', err);
        setError('Could not load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchAvailablePets();
  }, [selectedSpecies, locationSearch]);

  useEffect(() => {
    async function fetchAdoptedPets() {
      try {
        const pets = await getAdoptedPets();
        setAdoptedPets(pets);
      } catch (err) {
        console.error('Failed to load adopted pets:', err);
      }
    }

    fetchAdoptedPets();
  }, []);

  return (
    <div className="adopt-page">
      <section className="adopt-header">
        <h1>Pets For Adoption</h1>
        <p>
          Browse through list of pets up for adoption and find the perfect
          companion waiting to meet you!
        </p>
      </section>

      <section className="adopt-filters">
        <div className="filter-chips">
          {SPECIES_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={
                'filter-chip ' +
                (selectedSpecies === filter.value ? 'filter-chip-active' : '')
              }
              onClick={() => setSelectedSpecies(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="location-search">
          <label htmlFor="location-input">Location</label>
          <input
            id="location-input"
            type="text"
            placeholder="Search for a pet location"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="pets-section">
        {loading && <p className="status-message">Loading pets...</p>}

        {error && <p className="status-message error-message">{error}</p>}

        {!loading && !error && availablePets.length === 0 && (
          <p className="status-message">
            No pets match your filters. Try a different search.
          </p>
        )}

        {!loading && !error && availablePets.length > 0 && (
          <div className="pets-grid">
            {availablePets.map((pet) => (
              <PetCard key={pet.pet_id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {adoptedPets.length > 0 && (
        <section className="pets-section adopted-section">
          <h2>Successfully Adopted Pets</h2>
          <p className="section-subtitle">
            These pets have found their forever homes!
          </p>
          <div className="pets-grid">
            {adoptedPets.map((pet) => (
              <PetCard key={pet.pet_id} pet={pet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdoptionListPage;