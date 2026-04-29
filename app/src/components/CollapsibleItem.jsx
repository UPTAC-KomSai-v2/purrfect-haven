import dropdownIcon from '../assets/icons/dropdown.svg';

function CollapsibleItem({
  photo,
  photoAlt,
  title,
  statusLabel,
  statusClass,
  meta,
  highlight,
  isExpanded,
  onToggle,
  children,
}) {
  return (
    <div className="dashboard-item-wrapper">
      <button className="dashboard-item" onClick={onToggle}>
        {photo != null && (
          <img src={photo} alt={photoAlt || ''} className="dashboard-item-photo" />
        )}
        <div className="dashboard-item-info">
          <div className="dashboard-item-top">
            <h3>{title}</h3>
            {statusLabel && (
              <span className={`status-badge ${statusClass || ''}`}>{statusLabel}</span>
            )}
          </div>
          {meta && <p className="dashboard-item-meta">{meta}</p>}
          {highlight && <p className="dashboard-item-highlight">{highlight}</p>}
        </div>
        <img
          src={dropdownIcon}
          alt="toggle"
          className={`dashboard-item-chevron ${isExpanded ? 'up' : ''}`}
        />
      </button>

      {isExpanded && children && (
        <div className="dashboard-item-details">{children}</div>
      )}
    </div>
  );
}

export default CollapsibleItem;