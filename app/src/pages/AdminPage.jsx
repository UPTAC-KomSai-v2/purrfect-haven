// admin page — para sa pagre-review ng adoption requests at community posts.

import { useState, useEffect } from 'react';
import {
  getAllAdoptions,
  updateAdoptionStatus,
} from '../services/adoptionsService.js';
import '../styles/admin.css';

// helper — i-convert ang relative file path papuntang full url
function getPhotoUrl(filePath) {
  if (!filePath) return 'https://placehold.co/400x400?text=No+Photo';
  return `http://localhost:3000/${filePath}`;
}

// helper — format date for display (e.g. "Mar 28, 2026")
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// placeholder muna ang community posts — wala pang backend dito
const SAMPLE_COMMUNITY_POSTS = [
  {
    post_id: 1,
    status: 'pending',
    pet_name: '3 Kittens',
    description:
      "Found 3 kittens behind SM Tacloban. They're about 4 weeks old and need a loving home. I can provide initial supplies.",
    species_name: 'Cat',
    location: 'Downtown Tacloban',
    poster: {
      full_name: 'Maria Santos',
      email: 'maria.santos@email.com',
      cell_num: '0917-555-0202',
      address: 'Downtown Tacloban',
    },
    date_posted: 'March 26, 2026',
    photos: [
      'https://placehold.co/200x200?text=Kitten+1',
      'https://placehold.co/200x200?text=Kitten+2',
    ],
  },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState('adoptions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});

  // adoptions galing sa backend
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // community posts — placeholder pa rin
  const [posts, setPosts] = useState(SAMPLE_COMMUNITY_POSTS);

  // decision modal — para mag-input ng note bago mag-approve/reject
  const [decisionModal, setDecisionModal] = useState(null);
  // shape: { adoptionId, action: 'approve' | 'reject', petName, note }

  // fetch ng adoptions kapag nag-mount
  useEffect(() => {
    loadAdoptions();
  }, []);

  async function loadAdoptions() {
    try {
      const data = await getAllAdoptions();
      setAdoptions(data);
    } catch (err) {
      console.error('Failed to load adoptions:', err);
      setError('Could not load adoption requests. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  // count ng pending para sa tab badge
  const pendingAdoptions = adoptions.filter((a) => a.status === 'pending').length;
  const pendingPosts = posts.filter((p) => p.status === 'pending').length;

  function toggleCard(cardKey) {
    setExpandedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  }

  function applyFilter(items) {
    if (statusFilter === 'all') return items;
    return items.filter((item) => item.status === statusFilter);
  }

  // bukas yung modal — hindi pa tumatawag sa api hanggang ma-confirm sa modal
  function openDecisionModal(adoptionId, action, petName) {
    setDecisionModal({ adoptionId, action, petName, note: '' });
  }

  function closeDecisionModal() {
    setDecisionModal(null);
  }

  // tatawagin pag pinindot na yung confirm button sa modal
  async function confirmDecision() {
    if (!decisionModal) return;

    const { adoptionId, action, note } = decisionModal;
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    try {
      await updateAdoptionStatus(adoptionId, newStatus, {
        decision_note: note,
      });

      // i-update ang local state para magbago agad ang ui
      setAdoptions((prev) =>
        prev.map((a) =>
          a.adoption_id === adoptionId
            ? {
                ...a,
                status: newStatus,
                decision_note: note,
                date_decided: new Date().toISOString(),
              }
            : a
        )
      );

      closeDecisionModal();
    } catch (err) {
      console.error('Failed to update status:', err);
      const msg = err.response?.data?.error || 'Failed to update. Please try again.';
      alert(msg);
    }
  }

  // community post handlers — placeholder lang muna
  function handleApprovePost(id) {
    setPosts((prev) =>
      prev.map((p) => (p.post_id === id ? { ...p, status: 'approved' } : p))
    );
  }

  function handleRejectPost(id) {
    setPosts((prev) =>
      prev.map((p) => (p.post_id === id ? { ...p, status: 'rejected' } : p))
    );
  }

  const filters = ['all', 'pending', 'approved', 'rejected'];
  const filteredAdoptions = applyFilter(adoptions);
  const filteredPosts = applyFilter(posts);

  return (
    <div className="admin-container">
      <div className="admin-content">
        <p className="admin-label">Admin</p>

        {/* tabs */}
        <div className="admin-tabs">
          <button
            className={activeTab === 'adoptions' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('adoptions')}
          >
            Adoption Requests
            {pendingAdoptions > 0 && <span className="tab-badge">{pendingAdoptions}</span>}
          </button>
          <button
            className={activeTab === 'community' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('community')}
          >
            Community Posts
            {pendingPosts > 0 && <span className="tab-badge">{pendingPosts}</span>}
          </button>
        </div>

        {/* filter pills */}
        <div className="admin-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={statusFilter === f ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setStatusFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* cards */}
        <div className="admin-cards">
          {activeTab === 'adoptions' ? (
            loading ? (
              <p className="empty-state">Loading adoption requests...</p>
            ) : error ? (
              <p className="empty-state">{error}</p>
            ) : filteredAdoptions.length === 0 ? (
              <p className="empty-state">Walang adoption requests sa filter na ito.</p>
            ) : (
              filteredAdoptions.map((req) => {
                const key = `a-${req.adoption_id}`;
                return (
                  <AdoptionRequestCard
                    key={key}
                    request={req}
                    isExpanded={!!expandedCards[key]}
                    onToggle={() => toggleCard(key)}
                    onApprove={() =>
                      openDecisionModal(req.adoption_id, 'approve', req.pet.name)
                    }
                    onReject={() =>
                      openDecisionModal(req.adoption_id, 'reject', req.pet.name)
                    }
                  />
                );
              })
            )
          ) : filteredPosts.length === 0 ? (
            <p className="empty-state">Walang community posts sa filter na ito.</p>
          ) : (
            filteredPosts.map((post) => {
              const key = `p-${post.post_id}`;
              return (
                <CommunityPostCard
                  key={key}
                  post={post}
                  isExpanded={!!expandedCards[key]}
                  onToggle={() => toggleCard(key)}
                  onApprove={() => handleApprovePost(post.post_id)}
                  onReject={() => handleRejectPost(post.post_id)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* decision modal — bukas lang kapag may pinindot na approve/reject */}
      {decisionModal && (
        <DecisionModal
          modal={decisionModal}
          onChangeNote={(note) =>
            setDecisionModal((prev) => ({ ...prev, note }))
          }
          onConfirm={confirmDecision}
          onCancel={closeDecisionModal}
        />
      )}
    </div>
  );
}

// helper component — adoption request card
function AdoptionRequestCard({ request, isExpanded, onToggle, onApprove, onReject }) {
  const isDecided = request.status !== 'pending';

  return (
    <div className={`admin-card status-${request.status}`}>
      <button className="card-header" onClick={onToggle}>
        <div className="card-header-text">
          <h2>{request.pet.name}</h2>
          <p>
            {request.pet.breed || request.pet.species_name}{' '}
            <span className="dot">⋅</span> Applied {formatDate(request.date_applied)}
          </p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="card-content">
          <div className="card-grid">
            <div className="info-section">
              <h3>APPLICANT INFORMATION</h3>
              <h4>Full Name</h4>
              <p>{request.applicant.full_name}</p>
              <h4>Email</h4>
              <p>{request.applicant.email}</p>
              <h4>Phone</h4>
              <p>{request.applicant.cell_num}</p>
              <h4>Address</h4>
              <p>{request.applicant_address}</p>
              <h4>Home Ownership</h4>
              <p>{request.owns_home ? 'Owns home' : 'Renting/leasing'}</p>

              <div className="checklist">
                <Check label="This would be my first pet" checked={request.is_first_pet} />
                <Check label="I have experience taking care of cat/dog" checked={request.has_experience} />
                <Check label="I have other pets at home" checked={request.has_other_pets} />
                <Check label="I have children at home" checked={request.has_children} />
              </div>
            </div>

            <div className="info-section">
              <h3>MOTIVATION</h3>
              <p>"{request.motivation}"</p>

              <h3 style={{ marginTop: '20px' }}>FINANCIAL CAPABILITY</h3>
              <p>"{request.financial_capability}"</p>
            </div>

            <img
              src={getPhotoUrl(request.pet.photo)}
              alt={request.pet.name}
              className="pet-photo"
            />
          </div>

          {!isDecided ? (
            <>
              <div className="action-buttons">
                <button className="approve-btn" onClick={onApprove}>
                  Approve Application
                </button>
                <button className="reject-btn" onClick={onReject}>
                  Reject Application
                </button>
              </div>
              <p className="action-note">This action will notify the applicant via email.</p>
            </>
          ) : (
            <div className="decision-display">
              <p className="status-note">
                Status: <strong>{request.status}</strong>
              </p>
              {request.decision_note && (
                <p className="decision-note-display">
                  <strong>Note:</strong> {request.decision_note}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// helper component — modal para mag-input ng decision note
function DecisionModal({ modal, onChangeNote, onConfirm, onCancel }) {
  const isApprove = modal.action === 'approve';
  const title = isApprove ? 'Approve Application' : 'Reject Application';
  const placeholder = isApprove
    ? 'Add a welcoming message for the applicant...'
    : 'Explain why the application is being rejected...';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="modal-subtext">
          For <strong>{modal.petName}</strong>'s application
        </p>

        <label className="modal-label">
          Decision Note (optional)
          <textarea
            value={modal.note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder={placeholder}
            rows={4}
          />
        </label>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={isApprove ? 'approve-btn' : 'reject-btn'}
            onClick={onConfirm}
          >
            Confirm {isApprove ? 'Approval' : 'Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
}

// helper component — community post card
function CommunityPostCard({ post, isExpanded, onToggle, onApprove, onReject }) {
  const isDecided = post.status !== 'pending';

  return (
    <div className={`admin-card status-${post.status}`}>
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>
            {post.pet_name} <span className="header-meta">by {post.poster.full_name}</span>
          </h2>
          <p>
            {post.location} | Posted {post.date_posted} | {post.photos.length} Photo
            {post.photos.length === 1 ? '' : 's'}
          </p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="card-content">
          <div className="card-grid card-grid-two">
            <div className="info-section">
              <h3>POST CONTENT</h3>
              <p>{post.description}</p>
              {post.photos.length > 0 && (
                <div className="post-photos">
                  {post.photos.map((url, i) => (
                    <img key={i} src={url} alt={`Photo ${i + 1}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="info-section">
              <h3>POSTED BY</h3>
              <h4>Full Name</h4>
              <p>{post.poster.full_name}</p>
              <h4>Email</h4>
              <p>{post.poster.email}</p>
              <h4>Phone</h4>
              <p>{post.poster.cell_num}</p>
              <h4>Address</h4>
              <p>{post.poster.address}</p>
              <h4>Animal Type</h4>
              <p>{post.species_name}</p>
            </div>
          </div>

          {!isDecided ? (
            <>
              <div className="action-buttons">
                <button className="approve-btn" onClick={onApprove}>
                  Approve & Publish
                </button>
                <button className="reject-btn" onClick={onReject}>
                  Reject Post
                </button>
              </div>
              <p className="action-note">Approved posts will appear on the Community page.</p>
            </>
          ) : (
            <p className="status-note">
              Status: <strong>{post.status}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// helper component — read-only checkbox row
function Check({ label, checked }) {
  return (
    <label className="check-item">
      <input type="checkbox" checked={checked} readOnly />
      <span>{label}</span>
    </label>
  );
}

export default AdminPage;