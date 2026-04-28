import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getPhotoUrl(filePath, petName) {
  if (!filePath && !petName) {
    return 'https://placehold.co/200x200?text=No+Photo';
  }
  
  // Try to load from local assets first
  if (petName) {
    const fileName = `${petName.charAt(0).toLowerCase()}${petName.slice(1)}.jpg`;
    return `/assets/pets/${fileName}`;
  }
  
  // Fallback to server path
  return `http://localhost:3000/${filePath}`;
}

function PetCard({ pet }) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(getPhotoUrl(pet.primary_photo, pet.name));

  function handleClick() {
    navigate(`/pets/${pet.pet_id}`);
  }

  function handleImageError() {
    setImageSrc('https://placehold.co/200x200?text=No+Photo');
  }

  return (
    <div className="pet-card" onClick={handleClick}>
      <div className="pet-card-image-wrapper">
        <img
          src={imageSrc}
          alt={pet.name}
          className="pet-card-image"
          onError={handleImageError}
        />

        {pet.is_adopted === 1 && (
          <span className="pet-card-adopted-badge">Adopted!</span>
        )}
      </div>

      <p className="pet-card-name">{pet.name}</p>
      <p className="pet-card-breed">{pet.breed || pet.species_name}</p>
      {pet.age !== null && pet.age !== undefined && (
        <p className="pet-card-age">
          {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
        </p>
      )}
      {pet.sex && <p className="pet-card-gender">{pet.sex}</p>}
    </div>
  );
}

export default PetCard;