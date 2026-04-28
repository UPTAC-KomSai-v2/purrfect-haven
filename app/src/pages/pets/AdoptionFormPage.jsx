import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // dagdag: useNavigate
import { submitAdoptionApplication } from '../../services/adoptionsService.js';  // bago

import { getPetById } from '../../services/petsService.js';
import '../../styles/forms.css';
import '../../styles/adoptform.css';
import Button from '../../components/Button.jsx';
import { Paperclip } from "lucide-react";

function getPhotoUrl(filePath) {
  if (!filePath) return 'https://placehold.co/400x400?text=No+Photo';
  return `http://localhost:3000/${filePath}`;
}

function AdoptFormPage() {
  // react use state
  const { id } = useParams(); // grabs the :id from the URL
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [aboutSelf, setAboutSelf] = useState('');
  const [firstPet, setFirstPet] = useState(false);
  const [petExperience, setPetExperience] = useState(false);
  const [otherPets, setOtherPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [homeOwnership, setHomeOwnerhsip] = useState('');
  const [financialCapTxt, setFinancialCapTxt] = useState('');
  const [pet, setPet] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
      async function fetchPet() {
        setLoading(true);
        setError('');
  
        try {
          const fetched = await getPetById(id);
          setPet(fetched);
          setSelectedPhotoIndex(0); // reset photo selection when loading a new pet
        } catch (err) {
          console.error('Failed to load pet:', err);
          if (err.response?.status === 404) {
            setError('Pet not found.');
          } else {
            setError('Could not load pet details. Please try again later.');
          }
        } finally {
          setLoading(false);
        }
      }
  
      fetchPet();
    }, [id]);

  // handle submit POST req. connect to endpoint built
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    // basic validation
    const newErrors = {};
    if (!fullname)        newErrors.fullname        = 'Full Name is required';
    if (!email)           newErrors.email           = 'Email is required';
    if (!phoneNo)         newErrors.phoneNo         = 'Phone Number is required';
    if (!location)        newErrors.location        = 'Location is required';
    if (!aboutSelf)       newErrors.aboutSelf       = 'Please tell us why you want to adopt';
    if (!homeOwnership)   newErrors.homeOwnership   = 'Home Ownership is required';
    if (!financialCapTxt) newErrors.financialCapTxt = 'Financial capability is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // ipasa sa backend.  hindi natin isinasama ang fullname/email/phone
    // kasi ginagamit ng backend yung user record (galing sa session).
    try {
      await submitAdoptionApplication({
        pet_id: parseInt(id),
        applicant_address:    location,
        is_first_pet:         firstPet,
        has_experience:       petExperience,
        has_other_pets:       otherPets,
        has_children:         hasChildren,
        owns_home:            homeOwnership === 'own',
        financial_capability: financialCapTxt,
        motivation:           aboutSelf,
      });

      // pag successful, dalhin sa profile para makita yung application
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit application. Please try again.';
      setGeneralError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading pet details...</p>;
  }

  if (error) {
    return <p className="status-message error-message">{error}</p>;
  }

  if (!pet) {
    return null; // shouldn't happen, but just in case
  }

  const photos = pet.photos || [];
  const mainPhoto = photos[selectedPhotoIndex];
  const mainPhotoUrl = mainPhoto
    ? getPhotoUrl()
    : getPhotoUrl(null);

  return (
    <div className="adoptpet-container">
      <h1>Adoption Form</h1>
      <p>Thank you for your interest in adopting Callie! Please fill out the form below to start the adoption process.</p>
      
      <div className="adoptpet-card">
        <div className="info-card">
          <img
            src={mainPhotoUrl}
            alt={pet.name}
            className="detail-main-photo"
          />

          <div>
            <h2 className="info-card-name">{pet.name}</h2>
            {pet.location_held && (
              <p className="info-card-location">{pet.location_held}</p>
            )}

            {/* Info rows — only render the ones that have data */}
            <div className="info-card-rows">
              {pet.species_name && (
                <div className="info-row">
                  <span className="info-label">Type</span>
                  <span className="info-value">{pet.species_name}</span>
                </div>
              )}
              {pet.breed && (
                <div className="info-row">
                  <span className="info-label">Breed</span>
                  <span className="info-value">{pet.breed}</span>
                </div>
              )}
              {pet.sex && (
                <div className="info-row">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{pet.sex}</span>
                </div>
              )}
              {pet.age !== null && pet.age !== undefined && (
                <div className="info-row">
                  <span className="info-label">Age</span>
                  <span className="info-value">
                    {pet.age} {pet.age === 1 ? 'year' : 'years'}
                  </span>
                </div>
              )}
              {pet.color && (
                <div className="info-row">
                  <span className="info-label">Color/Pattern</span>
                  <span className="info-value">{pet.color}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="adoptpet-card">
        {generalError && <div className="error-banner">{generalError}</div>}
        
        <h2>Adoption Application</h2>
        <h3>Your Contact Info</h3>

        <form className="adoptpet-form" onSubmit={handleSubmit}>
          <div className="flex-col">
            <div className="flex-row">
              <div className="flex-col contact-info-container">
                <div className={`form-group ${errors.fullname ? 'form-group-error' : ''}`}>
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="e.g. Juan dela Cruz"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className={errors.fullname ? 'input-error' : ''}
                    required
                  />
                  {errors.fullname && <span className="error-text">{errors.fullname}</span>}
                </div>

                <div className={`form-group ${errors.phoneNo ? 'form-group-error' : ''}`}>
                  <label htmlFor="phoneNo">Phone No.</label>
                  <input
                    id="phoneNo"
                    type="text"
                    placeholder="09xxx-xxx-xxxx"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className={errors.phoneNo ? 'input-error' : ''}
                    required
                  />
                  {errors.phoneNo && <span className="error-text">{errors.phoneNo}</span>}
                </div>
              </div>
              <div className="flex-col contact-info-container">
                <div className={`form-group ${errors.email ? 'form-group-error' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'input-error' : ''}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className={`form-group ${errors.location ? 'form-group-error' : ''}`}>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g. Barangay 83-B, San Jose, Tacloban City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={errors.location ? 'input-error' : ''}
                    required
                  />
                  {errors.location && <span className="error-text">{errors.location}</span>}
                </div>
              </div>
            </div>
            <div className="flex-col">
              <div className={`form-group ${errors.aboutSelf ? 'form-group-error' : ''}`}>
                <h3>Tell us about yourself</h3>
                <label htmlFor="aboutSelf">Why do you want to adopt Callie?</label>
                <textarea
                  id="aboutSelf"
                  placeholder="Please share experiences with pets, living situation, and why you think Callie would be a good fit for your family..."
                  value={aboutSelf}
                  onChange={(e) => setAboutSelf(e.target.value)}
                  className={errors.aboutSelf ? 'input-error' : ''}
                  required
                />
                {errors.aboutSelf && <span className="error-text">{errors.aboutSelf}</span>}
              </div>

              <h4>Please Check all that apply:</h4>
              <div className="checkbox-group">
                <input
                  id="firstPet"
                  type="checkbox"
                  checked={firstPet}
                  onChange={(e) => setFirstPet(e.target.checked)}
                />
                <label htmlFor="firstPet">This would be my first pet</label>
              </div>
              <div className="checkbox-group">
                <input
                  id="petExperience"
                  type="checkbox"
                  checked={petExperience}
                  onChange={(e) => setPetExperience(e.target.checked)}
                />
                <label htmlFor="petExperience">I have experience taking care of a cat/dog</label>
              </div>
              <div className="checkbox-group">
                <input
                  id="otherPets"
                  type="checkbox"
                  checked={otherPets}
                  onChange={(e) => setOtherPets(e.target.checked)}
                />
                <label htmlFor="otherPets">I have other pets at home</label>
              </div>
              <div className="checkbox-group">
                <input
                  id="hasChildren"
                  type="checkbox"
                  checked={hasChildren}
                  onChange={(e) => setHasChildren(e.target.checked)}
                />
                <label htmlFor="hasChildren">I have children at home</label>
              </div>

              <h4>Verification Information</h4>
              <h5>Home Ownership*</h5>
              <div className="radio-group">
                <input
                  id="ownHome"
                  type="radio"
                  checked={homeOwnership === 'own'}
                  onChange={() => setHomeOwnership('own')}
                />
                <label htmlFor="ownHome">I own my home</label>
              </div>
              <div className="radio-group">
                <input
                  id="rentHome"
                  type="radio"
                  checked={homeOwnership === 'rent'}
                  onChange={(e) => setHomeOwnerhsip('rent')}
                />
                <label htmlFor="rentHome">I rent/lease my home (with landlord approval for pets)</label>
              </div>              
              <div>
                <h5>Financial Capability Proof*</h5>
                <p>Please provide proof of your financial capability to care for the pet. This can Include:</p>
                <ul>
                  <li>LinkedIn profile URL</li>
                  <li>Employment details (company name, position)</li>
                  <li>Professional credential ors certifications</li>
                  <li>Previous pet ownership experience with veterinary care history</li>
                </ul>
                <div className={`form-group ${errors.aboutSelf ? 'form-group-error' : ''}`}>
                  <h3>Tell us about yourself</h3>
                  <label htmlFor="financialCapTxt">Why do you want to adopt Callie?</label>
                  <textarea
                    id="financialCapTxt"
                    placeholder="Provide financial capability proof here..."
                    value={financialCapTxt}
                    onChange={(e) => setFinancialCapTxt(e.target.value)}
                    className={errors.financialCapTxt ? 'input-error' : ''}
                    required
                  />
                  {errors.financialCapTxt && <span className="error-text">{errors.financialCapTxt}</span>}
                </div>
                
                <div className="adoptpet-upload-container">
                  <div className="adoptpet-upload-dropzone">
                    <Paperclip size={30} />
                    <p>Upload Proof of Financial Capability (File)</p>
                    <small>PDF, Doc up to 10MB each • Max 5 files</small>
                    <input type="file" multiple accept="image/*,video/*" className="adoptpet-hidden-file" />
                  </div>
                </div>

              </div>
              
            </div>


            <Button type="submit" disabled={loading}>
              Submit Adoption Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdoptFormPage;