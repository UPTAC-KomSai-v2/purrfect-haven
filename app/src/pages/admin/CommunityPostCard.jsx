import React from 'react';

function CommunityPostCard({ post, isExpanded, onToggle, onApprove, onReject }) {
  const isDecided = post.status !== 'pending';

  return (
    <div className={`admin-card status-${post.status}`}>
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>{post.pet_name} at {post.location}</h2>
          <p className="header-meta">
            Reported by {post.poster.full_name} &nbsp; {post.date_posted}
          </p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="card-content">
          <div className="card-grid card-grid-two">

            <div className="info-section">
              <h3 className="section-title">REPORT CONTENT</h3>
              
              <div className="detail-item">
                <h4>Pet Name</h4>
                <p>{post.pet_name}</p>
              </div>

              <div className="detail-item">
                <h4>Animal Type</h4>
                <p>{post.species_name}</p>
              </div>

              <div className="detail-item">
                <h4>Weight (kg)</h4>
                <p>{post.weight || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Breed</h4>
                <p>{post.breed || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Age</h4>
                <p>{post.age || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Gender</h4>
                <p>{post.sex || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Color/Pattern</h4>
                <p>{post.color || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Personality</h4>
                <p>{post.personality || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Organization/Foster Home</h4>
                <p>{post.organization || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>Health & Care</h4>
                <p>{post.health || 'N/A'}</p>
              </div>

              <div className="detail-item">
                <h4>About The Pet</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{post.description}</p>
              </div>
            </div>

            {/* Right Column: POSTED BY */}
            <div className="info-section">
              <h3 className="section-title">POSTED BY</h3>
              
              <div className="detail-item">
                <h4>Full Name</h4>
                <p>{post.poster.full_name}</p>
              </div>

              <div className="detail-item">
                <h4>Location Reported</h4>
                <p>{post.location}</p>
              </div>

              <div className="detail-item">
                <h4>Contact Info</h4>
                <p>{post.poster.cell_num}</p>
                <p>{post.poster.email}</p>
              </div>

              <div className="detail-item">
                <h4>Current Status</h4>
                <p className={`status-text ${post.status}`}>
                  {post.status.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {!isDecided && (
            <div className="action-buttons">
              <button className="approve-btn" onClick={onApprove}>
                Approve & Publish
              </button>
              <button className="reject-btn" onClick={onReject}>
                Reject Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommunityPostCard;