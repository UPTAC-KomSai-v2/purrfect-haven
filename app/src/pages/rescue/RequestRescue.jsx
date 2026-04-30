import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from '../../components/FormCard.jsx';
import Button from '../../components/Button.jsx';
import api from '../../services/api.js';
import '../../styles/forms.css';
import '../../styles/rescue.css';

function RequestRescue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    animalType: '',
    estNum: '',
    location: '',
    dateSpotted: '',
    timeSpotted: '',
    description: '',
  });

  const [privacyConsent, setPrivacyConsent] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.contactNumber || !formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!privacyConsent) {
      setError('You must consent to the data privacy terms to submit.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/rescue', {
        ...formData,
        privacyConsent,
      });

      setSuccess('Rescue report submitted successfully! Redirecting to confirmation...');
      setFormData({
        fullName: '',
        contactNumber: '',
        animalType: '',
        estNum: '',
        location: '',
        dateSpotted: '',
        timeSpotted: '',
        description: '',
      });
      setPrivacyConsent(false);

      // Lock a one time access to navigating this page? (upon submitting only etc.)
      setTimeout(() => {
        navigate(`/rescue/${response.data.reportId}`);
      }, 2500);
    } catch (err) {
      console.error('Error submitting rescue report:', err);
      setError(
        err.response?.data?.error || 'Failed to submit rescue report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard 
      title="Submit a Rescue Request"
      subtitle="Spotted an animal in distress in Tacloban City? You can report to save a life."
      maxWidth={600}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div className="report-form-group">
          <label htmlFor='fullName'>Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Juan dela Crus"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="report-form-group">
          <label htmlFor='contactNumber'>Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            placeholder="09xx-xxx-xxxx"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <p style={{ width: '100%' }}>Animal Details</p>

        <div className="report-form-group">
          <label htmlFor='animalType'>Animal Type</label>
          <input
            type="text"
            id="animalType"
            name="animalType"
            placeholder="e.g., Dog, Cat, etc."
            value={formData.animalType}
            onChange={handleInputChange}
          />
        </div>

        <div className="report-form-group">
          <label htmlFor='estNum'>Estimated Number</label>
          <input
            type="number"
            id="estNum"
            name="estNum"
            placeholder="e.g., 1, 2, 3"
            value={formData.estNum}
            onChange={handleInputChange}
          />
        </div>

        <div className="report-form-group full">
          <label htmlFor='location'>Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Exact address or nearest landmark"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="report-form-group">
          <label htmlFor='dateSpotted'>Date Spotted</label>
          <input
            type="date"
            id="dateSpotted"
            name="dateSpotted"
            value={formData.dateSpotted}
            onChange={handleInputChange}
          />
        </div>

        <div className="report-form-group">
          <label htmlFor='timeSpotted'>Time Spotted</label>
          <input
            type="time"
            id="timeSpotted"
            name="timeSpotted"
            value={formData.timeSpotted}
            onChange={handleInputChange}
          />
        </div>

        <div className="report-form-group full">
          <label htmlFor='description'>Condition & Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the animal's condition, behavior, and any immediate dangers."
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="report-form-group full">
          <label>Upload Photos or Videos</label>

          <div className="upload-box">
            <div className="upload-icon">📷</div>
            <p>Upload photos or videos of the animal</p>
            <small>JPG, PNG, MP4 up to 10MB each • Max 5 files</small>
            <input type="file" multiple accept="image/*,video/*" disabled />
            <small style={{ display: 'block', marginTop: '8px', color: '#999' }}>
              (Photo uploads coming soon)
            </small>
          </div>
        </div>

        <div className="privacy-box" style={{ width: '100%' }}>
          <input
            type="checkbox"
            id="privacy"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
          />
          <label htmlFor="privacy">
            <strong>Data Privacy</strong>
            <br />
            By submitting this report, you consent to sharing your contact info with our rescue volunteers for coordination purposes. Your information is kept confidential.
          </label>
        </div>

        {error && (
          <div style={{ width: '100%', backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '8px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ width: '100%', backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '4px', marginBottom: '8px' }}>
            {success}
          </div>
        )}

        <div className="submit-box" style={{ width: '100%' }}>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Rescue Report'}
          </Button>
        </div>
      </form>
    </FormCard>
  );
}

export default RequestRescue;