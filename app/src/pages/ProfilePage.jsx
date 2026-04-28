// profile dashboard — ipinapakita yung mga adoption requests, rescue reports,
// at community posts ng kasalukuyang user.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyAdoptions } from '../services/adoptionsService.js';
import '../styles/profile.css';

// helper — i-convert ang relative file path papuntang full url
function getPhotoUrl(filePath) {
  if (!filePath) return 'https://placehold.co/120x120?text=No+Photo';
  return `http://localhost:3000/${filePath}`;
}

// helper — format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// human-readable label per status
function getStatusLabel(status) {
  const labels = {
    pending: 'Pending Review',
    appointment_scheduled: 'Appointment Scheduled',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
  };
  return labels[status] || status;
}

function ProfilePage() {
  const { user } = useAuth();

  // adoption applications ng user
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  // i-fetch yung adoptions kapag nag-mount yung component
  useEffect(() => {
    async function fetchAdoptions() {
      try {
        const data = await getMyAdoptions();
        setAdoptions(data);
      } catch (err) {
        console.error('Failed to load adoptions:', err);
        setError('Could not load your adoption requests.');
      } finally {
        setLoading(false);
      }
    }
    fetchAdoptions();
  }, []);

  // kung wala pang user (loading pa), wag muna mag-render
  if (!user) return null;

  return (
    <div className="profile-container">
      {/* header — greeting at link papuntang settings */}
      <section className="profile-header">
        <div>
          <h1>Hello, {user.first_name}!</h1>
          <p>Welcome back to your dashboard.</p>
        </div>
        <Link to="/settings" className="profile-settings-link">
          Account Settings
        </Link>
      </section>

      {/* dashboard cards */}
      <section className="profile-dashboard">
        {/* my adoption requests */}
        <div className="dashboard-card dashboard-card-wide">
          <h2>My Adoption Requests</h2>

          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : adoptions.length === 0 ? (
            <p className="empty-state">
              Wala ka pang adoption requests.{' '}
              <Link to="/pets" className="inline-link">Browse pets</Link> to get started.
            </p>
          ) : (
            <div className="application-list">
              {adoptions.map((app) => (
                <ApplicationItem
                    key={app.adoption_id}
                    application={app}
                    isExpanded={!!expanded[app.adoption_id]}
                    onToggle={() =>
                    setExpanded((prev) => ({
                        ...prev,
                        [app.adoption_id]: !prev[app.adoption_id],
                    }))
                    }
                />
                ))}
            </div>
          )}
        </div>

        {/* todo: ipakita yung rescue reports — kapag handa na backend */}
        <div className="dashboard-card">
          <h2>My Rescue Reports</h2>
          <p className="empty-state">Wala pang rescue reports.</p>
        </div>

        {/* todo: ipakita yung community posts — kapag handa na backend */}
        <div className="dashboard-card">
          <h2>My Community Posts</h2>
          <p className="empty-state">Wala pang community posts.</p>
        </div>
      </section>
    </div>
  );
}

// helper component — isang adoption application row
// helper component — isang adoption application row, click to expand
function ApplicationItem({ application, isExpanded, onToggle }) {
  const {
    pet, status, date_applied,
    appointment_date, decision_note,
    motivation, financial_capability,
    applicant_address,
    is_first_pet, has_experience, has_other_pets, has_children,
    owns_home,
  } = application;

  return (
    <div className="application-item-wrapper">
      {/* clickable header row */}
      <button className="application-item" onClick={onToggle}>
        <img
          src={getPhotoUrl(pet.photo)}
          alt={pet.name}
          className="application-photo"
        />

        <div className="application-info">
          <div className="application-top">
            <h3>{pet.name}</h3>
            <span className={`status-badge status-${status}`}>
              {getStatusLabel(status)}
            </span>
          </div>

          <p className="application-meta">
            {pet.breed || pet.species_name} · Applied {formatDate(date_applied)}
          </p>

          {/* status-specific extra info na nasa header pa rin */}
          {status === 'appointment_scheduled' && appointment_date && (
            <p className="application-note">
              <strong>Appointment:</strong> {formatDate(appointment_date)}
            </p>
          )}
        </div>

        {/* chevron — bumabaliktad pag expanded */}
        <span className={`application-chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {/* expanded details */}
      {isExpanded && (
        <div className="application-details">
          {/* decision note kapag approved/rejected */}
          {(status === 'approved' || status === 'rejected') && decision_note && (
            <div className="detail-section">
              <h4>Decision Note from Foster Home</h4>
              <p className="detail-quote">"{decision_note}"</p>
            </div>
          )}

          {/* application contents */}
          <div className="detail-section">
            <h4>Your Motivation</h4>
            <p>"{motivation}"</p>
          </div>

          <div className="detail-section">
            <h4>Financial Capability</h4>
            <p>"{financial_capability}"</p>
          </div>

          <div className="detail-section">
            <h4>Application Details</h4>
            <p><strong>Address:</strong> {applicant_address}</p>
            <p><strong>Home Ownership:</strong> {owns_home ? 'Owns home' : 'Renting/leasing'}</p>
          </div>

          <div className="detail-section">
            <h4>Your Checklist</h4>
            <ul className="detail-checklist">
              <li>{is_first_pet ? '✓' : '✗'} First pet</li>
              <li>{has_experience ? '✓' : '✗'} Has pet care experience</li>
              <li>{has_other_pets ? '✓' : '✗'} Has other pets at home</li>
              <li>{has_children ? '✓' : '✗'} Has children at home</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;