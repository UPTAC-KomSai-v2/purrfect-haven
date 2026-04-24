import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/adoptform.css';
import { Paperclip } from "lucide-react";

function AdoptFormPage() {
  // react use state
  const [fullname, setFullname] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [aboutSelf, setAboutSelf] = useState('');
  const [firstPet, setFirstPet] = useState(false);
  const [petExperience, setPetExperience] = useState(false);
  const [otherPets, setOtherPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [homeOwnership, setHomeOwnerhsip] = useState('');
  const [financialCapTxt, setFinancialCapTxt] = useState('');

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // handle submit POST req. connect to endpoint built
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="adoptpet-container">
      <h1>Adoption Form</h1>
      <p>Thank you for your interest in adopting Callie! Please fill out the form below to start the adoption process.</p>
      
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

                <div className={`form-group ${errors.contactNo ? 'form-group-error' : ''}`}>
                  <label htmlFor="contactNo">Contact No.</label>
                  <input
                    id="contactNo"
                    type="text"
                    placeholder="09xxx-xxx-xxxx"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className={errors.contactNo ? 'input-error' : ''}
                    required
                  />
                  {errors.contactNo && <span className="error-text">{errors.contactNo}</span>}
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
                <button className="file-upload" type="button">
                  <Paperclip size={30} />
                  <p>Upload File of Financial Capability Proof</p>
                  <p>PDF, DOC up to 10MB each - Max 5 files</p>
                </button>
              </div>
              
            </div>


            <button type="submit" className="adoptpet-button" disabled={loading}>
              Submit Adoption Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdoptFormPage;