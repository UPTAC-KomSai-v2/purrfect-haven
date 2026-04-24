import { useNavigate } from 'react-router-dom';
import '../styles/report.css';

function ReportRescue() {
  const navigate = useNavigate();

  return (
    <>
      <section className="report-section">
        <h1>Submit a Report</h1>
        <p>Spotted an animal in distress in Tacloban City? You can report to save a life.</p>
      </section>
      
      <section className="report-container">
        <div className="report-form">
          <p>Rescue Report Form</p>
          <p>Contact Details</p>

          <div className="report-form-group">
            <label htmlFor='fullName'>Full Name</label>
            <input type="text" id="fullName" name="fullName" placeholder="Juan dela Crus" />
          </div>

          <div className="report-form-group">
            <label htmlFor='contactNumber'>Contact Number</label>
            <input type="tel" id="contactNumber" name="contactNumber" placeholder="09xx-xxx-xxxx" />
          </div>

          <p>Animal Details</p>

          <div className="report-form-group">
            <label htmlFor='animalType'>Animal Type</label>
            <input type="text" id="animalType" name="animalType" placeholder="e.g., Dog, Cat, etc." />
          </div>

          <div className="report-form-group">
            <label htmlFor='estNum'>Estimated Number</label>
            <input type="number" id="estNum" name="estNum" placeholder="e.g., 1, 2, 3" />
          </div>

          <div className="report-form-group full">
            <label htmlFor='location'>Location</label>
            <input type="text" id="location" name="location" placeholder="Exact address or nearest landmark" />
          </div>

          <div className="report-form-group">
            <label htmlFor='dateSpotted'>Date Spotted</label>
            <input type="date" id="dateSpotted" name="dateSpotted" placeholder="e.g., Today, March 28" />
          </div>

          <div className="report-form-group">
            <label htmlFor='timeSpotted'>Time Spotted</label>
            <input type="time" id="timeSpotted" name="timeSpotted" placeholder="2:30 PM" />
          </div>

          <div className="report-form-group full">
            <label htmlFor='description'>Condition & Description</label>
            <textarea id="description" name="description" placeholder="Describe the animal's condition, behavior, and any immediate dangers." rows="4"></textarea>
          </div>
          <div className="report-form-group full">
            <label>Upload Photos or Videos</label>

            <div className="upload-box">
              <div className="upload-icon">📷</div>
              <p>Upload photos or videos of the animal</p>
              <small>JPG, PNG, MP4 up to 10MB each • Max 5 files</small>
              <input type="file" multiple accept="image/*,video/*" />
            </div>
          </div>

          <div className="privacy-box">
            <input type="checkbox" id="privacy" />
            <label htmlFor="privacy">
              <strong>Data Privacy</strong>
              <br />
              By submitting this report, you consent to sharing your contact info with our rescue volunteers for coordination purposes. Your information is kept confidential.
            </label>
          </div>

          <div className="submit-box">
            <button type="submit" className="submit-btn">
              Submit Rescue Report
            </button>
          </div>

        </div>
      </section>
    </>
  );
}

export default ReportRescue;