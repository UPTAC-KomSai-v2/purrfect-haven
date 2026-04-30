import React from 'react';

function CommunityPostCard({ post, isExpanded, onToggle, onApprove, onReject }) {
  const isDecided = post.status !== 'pending';
  return (
    <div className={`admin-card status-${post.status}`}>
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>{post.pet_name} <span className="header-meta">by {post.poster.full_name}</span></h2>
          <p>{post.location} | Posted {post.date_posted}</p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>
      {isExpanded && (
        <div className="card-content">
          <div className="card-grid card-grid-two">
            <div className="info-section">
              <h3>POST CONTENT</h3>
              <p>{post.description}</p>
              <div className="post-photos" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                {post.photos.map((url, i) => <img key={i} src={url} alt="Pet" style={{ width: '100px', borderRadius: '8px' }} />)}
              </div>
            </div>
            <div className="info-section">
              <h3>POSTED BY</h3>
              <h4>Full Name</h4><p>{post.poster.full_name}</p>
              <h4>Email</h4><p>{post.poster.email}</p>
              <h4>Phone</h4><p>{post.poster.cell_num}</p>
              <h4>Address</h4><p>{post.poster.address}</p>
              <h4>Animal Type</h4><p>{post.species_name}</p>
            </div>
          </div>
          {!isDecided && (
            <div className="action-buttons" style={{ marginTop: '20px' }}>
              <button className="approve-btn" onClick={onApprove}>Approve & Publish</button>
              <button className="reject-btn" onClick={onReject}>Reject Post</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommunityPostCard;