import React from 'react';


const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

function AdoptionRequestCard({ request, isExpanded, onToggle, onApprove, onReject }) {
  const isDecided = request.status !== 'pending';
  console.log(request);

  return (
    <div className={`admin-card status-${request.status}`}>
      
      {/* HEADER */}
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>{request.pet?.name} — {request.applicant?.full_name}</h2>
          <p className="header-meta">
            Requested by {request.applicant?.full_name}  {formatDate(request.date_applied)}
          </p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {/* CONTENT */}
      {isExpanded && (
        <div className="card-content">
          <div className="card-grid">
            {/* PET INFO */}
            <div className="info-section">
              <h3 className="section-title">PET DETAILS</h3>

              <div className="pet-card-mini">
                {/* Basic Info */}
                <div className="pet-mini-info">
                  <h4 className="pet-mini-name">
                    Pet Name
                  </h4>
                  <p>{request.pet?.name || 'Unknown Pet'}</p>

                  <h4 className="pet-mini-name">
                    Animal Type
                  </h4>
                  <p>{request.pet?.species_name || 'Unknown'}</p>

                  <h4 className="pet-mini-name">
                    Breed
                  </h4>
                  <p className="pet-mini-meta">{request.pet?.breed ? ` ${request.pet.breed}` : ''}</p>
                </div>
              </div>
            </div>
            {/* LEFT: APPLICANT INFO */}
            <div className="info-section">
              <h3 className="section-title">APPLICANT INFO</h3>

              <div className="detail-item">
                <h4>Full Name</h4>
                <p>{request.applicant?.full_name}</p>
              </div>

              <div className="detail-item">
                <h4>Email</h4>
                <p>{request.applicant?.email}</p>
              </div>

              <div className="detail-item">
                <h4>Phone</h4>
                <p>{request.applicant?.cell_num}</p>
              </div>

              <div className="detail-item">
                <h4>Location</h4>
                <p>{request.applicant_address}</p>
              </div>

              <div className="detail-item">
                <h4>Motivation</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {request.motivation}
                </p>
              </div>
            </div>

            {/* RIGHT: HOME & PET CONTEXT */}
            <div className="info-section">
              <h3 className="section-title">LIVING SITUATION</h3>

              <div className="detail-item">
                <h4>First Pet</h4>
                <p>{request.is_first_pet ? 'Yes' : 'No'}</p>
              </div>

              <div className="detail-item">
                <h4>Pet Experience</h4>
                <p>{request.has_experience ? 'Yes' : 'No'}</p>
              </div>

              <div className="detail-item">
                <h4>Other Pets</h4>
                <p>{request.has_other_pets ? 'Yes' : 'No'}</p>
              </div>

              <div className="detail-item">
                <h4>Has Children</h4>
                <p>{request.has_children ? 'Yes' : 'No'}</p>
              </div>

              <div className="detail-item">
                <h4>Home Ownership</h4>
                <p>{request.owns_home ? 'Owns home' : 'Rents'}</p>
              </div>
            </div>
          </div>

          <div className="card-grid"> 
            {/* FINANCIAL SECTION */}
            <div className="info-section">
              <h3 className="section-title">FINANCIAL CAPABILITY</h3>

              <div className="detail-item">
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {request.financial_capability}
                </p>
              </div>

              {request.files?.length > 0 && (
                <div className="detail-item">
                  <h4>Uploaded Files</h4>
                  <ul>
                    {request.files.map((file, idx) => (
                      <li key={idx}>{file}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* STATUS */}
            <div className="info-section">
              <h4>Status</h4>
              <p>
                {request.status.toUpperCase()}
              </p>
            </div>
          </div>
          

          {/* ACTION BUTTONS */}
          {!isDecided && (
            <div className="action-buttons">
              <button className="approve-btn" onClick={onApprove}>
                Approve Adoption
              </button>
              <button className="reject-btn" onClick={onReject}>
                Reject Request
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdoptionRequestCard;