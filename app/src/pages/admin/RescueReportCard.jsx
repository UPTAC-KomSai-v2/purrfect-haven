import React from 'react';

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const parseRescueDescription = (desc) => {
  if (!desc) return {};
  const details = {};
  const lines = desc.split('\n');
  lines.forEach(line => {
    if (line.includes('**Reporter:**')) details.reporter = line.replace('**Reporter:**', '').trim();
    if (line.includes('**Contact:**')) details.contact = line.replace('**Contact:**', '').trim();
    if (line.includes('**Animal Type:**')) details.animalType = line.replace('**Animal Type:**', '').trim();
    if (line.includes('**Estimated Count:**')) details.count = line.replace('**Estimated Count:**', '').trim();
    if (line.includes('**Date Spotted:**')) details.date = line.replace('**Date Spotted:**', '').trim();
    if (line.includes('**Time Spotted:**')) details.time = line.replace('**Time Spotted:**', '').trim();
  });
  const conditionMatch = desc.split('**Condition & Description:**');
  details.condition = conditionMatch.length > 1 ? conditionMatch[1].trim() : '';
  return details;
};

function RescueReportCard({ report, isExpanded, onToggle }) {
  const details = parseRescueDescription(report.description);
  return (
    <div className={`admin-card status-${report.status}`}>
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>Rescue Spotting at {report.location}</h2>
          <p className="header-meta">Reported by {report.reporter_name} <span className="dot">⋅</span> {formatDate(report.date_reported)}</p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>
      {isExpanded && (
        <div className="card-content">
          <div className="card-grid card-grid-two">
            <div className="info-section">
              <h3>REPORT CONTENT</h3>
              <h4>Reporter</h4><p>{details.reporter || 'N/A'}</p>
              <h4>Contact</h4><p>{details.contact || 'N/A'}</p>
              <h4>Animal Type</h4><p style={{ textTransform: 'capitalize' }}>{details.animalType || 'N/A'}</p>
              <h4>Estimated Count</h4><p>{details.count || 'N/A'}</p>
              <h4 style={{ marginTop: '15px' }}>Condition & Description</h4><p>{details.condition || 'N/A'}</p>
            </div>
            <div className="info-section">
              <h3>POSTED BY</h3>
              <h4>Full Name</h4><p>{report.reporter_name}</p>
              <h4>Location Reported</h4><p>{report.location}</p>
              <h4>Current Status</h4><p style={{ textTransform: 'uppercase' }}>{report.status}</p>
            </div>
          </div>
          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <button className="approve-btn">Approve & Dispatch</button>
            <button className="reject-btn">Reject Report</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RescueReportCard;