// profile dashboard — adoptions, welfare checks, stories, photo uploads.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getMyAdoptions,
  listPostAdoptionUpdates,
  listWelfareChecks,
  createPostAdoptionUpdate,
  respondToWelfareCheck,
  getMyPendingWelfareChecks,
} from '../services/adoptionsService.js';
import {
  getMyStories,
  submitStoryContent,
  initiateOwnStory,
} from '../services/storiesService.js';
import PhotoUploader from '../components/PhotoUploader.jsx';
import '../styles/profile.css';

function getPhotoUrl(filePath) {
  if (!filePath) return 'https://placehold.co/120x120?text=No+Photo';
  return `http://localhost:3000/${filePath}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

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

function getConditionLabel(condition) {
  const labels = {
    excellent: 'Excellent', good: 'Good',
    concerning: 'Concerning', critical: 'Critical',
  };
  return labels[condition] || condition;
}

function getStoryStatusLabel(status) {
  const labels = {
    pending:   'Awaiting your story',
    submitted: 'Under admin review',
    published: 'Published',
    rejected:  'Not published',
  };
  return labels[status] || status;
}

function ProfilePage() {
  const { user } = useAuth();

  const [adoptions, setAdoptions] = useState([]);
  const [pendingChecks, setPendingChecks] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  const [welfareModal, setWelfareModal]       = useState(null);
  const [storyModal, setStoryModal]           = useState(null);
  const [updateModal, setUpdateModal]         = useState(null);
  const [shareStoryModal, setShareStoryModal] = useState(null);

  // bagong state — kapag may laman, ipapakita yung view modal ng story
  const [viewStoryModal, setViewStoryModal] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [a, p, s] = await Promise.allSettled([
      getMyAdoptions(),
      getMyPendingWelfareChecks(),
      getMyStories(),
    ]);

    if (a.status === 'fulfilled') setAdoptions(a.value);
    else console.error('Adoptions load failed:', a.reason);

    if (p.status === 'fulfilled') setPendingChecks(p.value);
    else console.error('Pending checks load failed:', p.reason);

    if (s.status === 'fulfilled') setStories(s.value);
    else console.error('Stories load failed:', s.reason);

    if (a.status === 'rejected') {
      setError('Could not load your adoption requests.');
    }

    setLoading(false);
  }

  function toggleExpand(adoptionId) {
    setExpanded((prev) => ({ ...prev, [adoptionId]: !prev[adoptionId] }));
  }

  function refreshAdoption(adoptionId) {
    setAdoptions((prev) =>
      prev.map((a) =>
        a.adoption_id === adoptionId
          ? { ...a, _refreshKey: (a._refreshKey || 0) + 1 }
          : a
      )
    );
  }

  // ============ welfare check response ============

  function openWelfareModal(check) {
    setWelfareModal({
      checkId:    check.check_id,
      petName:    check.pet_name,
      adoptionId: check.adoption_id,
      condition:  'good',
      notes:      '',
      photos:     [],
    });
  }

  function updateWelfareField(field, value) {
    setWelfareModal((prev) => ({ ...prev, [field]: value }));
  }

  async function submitWelfareResponse() {
    if (!welfareModal || !welfareModal.notes.trim()) return;
    try {
      await respondToWelfareCheck(
        welfareModal.checkId,
        welfareModal.condition,
        welfareModal.notes,
        welfareModal.photos
      );
      setPendingChecks((prev) =>
        prev.filter((c) => c.check_id !== welfareModal.checkId)
      );
      refreshAdoption(welfareModal.adoptionId);
      setWelfareModal(null);
    } catch (err) {
      console.error('Welfare response error:', err);
      alert(err.response?.data?.error || 'Failed to submit response.');
    }
  }

  // ============ story request response ============

  function openStoryModal(story) {
    setStoryModal({
      storyId: story.story_id,
      petName: story.pet.name,
      title:   '',
      content: '',
      photos:  [],
    });
  }

  function updateStoryField(field, value) {
    setStoryModal((prev) => ({ ...prev, [field]: value }));
  }

  async function submitStoryResponse() {
    if (!storyModal || !storyModal.title.trim() || !storyModal.content.trim()) return;
    try {
      await submitStoryContent(
        storyModal.storyId,
        storyModal.title,
        storyModal.content,
        storyModal.photos
      );
      setStories((prev) =>
        prev.map((s) =>
          s.story_id === storyModal.storyId
            ? {
                ...s,
                status: 'submitted',
                title: storyModal.title,
                content: storyModal.content,
                submitted_at: new Date().toISOString(),
              }
            : s
        )
      );
      setStoryModal(null);
    } catch (err) {
      console.error('Story submit error:', err);
      alert(err.response?.data?.error || 'Failed to submit story.');
    }
  }

  // ============ adopter-initiated story ============

  function openShareStoryModal(adoption) {
    setShareStoryModal({
      adoptionId: adoption.adoption_id,
      petName:    adoption.pet.name,
      title:      '',
      content:    '',
      photos:     [],
    });
  }

  function updateShareStoryField(field, value) {
    setShareStoryModal((prev) => ({ ...prev, [field]: value }));
  }

  async function submitOwnStory() {
    if (!shareStoryModal || !shareStoryModal.title.trim() || !shareStoryModal.content.trim()) return;
    try {
      const result = await initiateOwnStory(
        shareStoryModal.adoptionId,
        shareStoryModal.title,
        shareStoryModal.content,
        shareStoryModal.photos
      );
      const newStory = {
        story_id:     result.story_id,
        title:        shareStoryModal.title,
        content:      shareStoryModal.content,
        status:       'submitted',
        was_requested: false,
        submitted_at: new Date().toISOString(),
        adoption_id:  shareStoryModal.adoptionId,
        pet:          { pet_id: null, name: shareStoryModal.petName },
        photos:       [],
      };
      setStories((prev) => [newStory, ...prev]);
      setShareStoryModal(null);
    } catch (err) {
      console.error('Share story error:', err);
      alert(err.response?.data?.error || 'Failed to submit story.');
    }
  }

  // ============ post-adoption update ============

  function openUpdateModal(adoption) {
    setUpdateModal({
      adoptionId: adoption.adoption_id,
      petName:    adoption.pet.name,
      text:       '',
    });
  }

  async function submitUpdate() {
    if (!updateModal || !updateModal.text.trim()) return;
    try {
      await createPostAdoptionUpdate(updateModal.adoptionId, updateModal.text);
      refreshAdoption(updateModal.adoptionId);
      setUpdateModal(null);
    } catch (err) {
      console.error('Update share error:', err);
      alert(err.response?.data?.error || 'Failed to share update.');
    }
  }

  // ============ view story (read-only) ============

  function openViewStoryModal(story) {
    // hindi natin papaakiks yung pending stories — wala pang content
    if (story.status === 'pending') {
      // i-redirect sa write modal instead
      openStoryModal(story);
      return;
    }
    setViewStoryModal(story);
  }

  if (!user) return null;

  const pendingStoryRequests = stories.filter((s) => s.status === 'pending');

  return (
    <div className="profile-container">
      <section className="profile-header">
        <div>
          <h1>Hello, {user.first_name}!</h1>
          <p>Welcome back to your dashboard.</p>
        </div>
        <Link to="/settings" className="profile-settings-link">
          Account Settings
        </Link>
      </section>

      {(pendingChecks.length > 0 || pendingStoryRequests.length > 0) && (
        <section className="action-required-section">
          <h2>Action Required</h2>

          {pendingChecks.map((check) => (
            <div key={`wc-${check.check_id}`} className="action-banner action-banner-urgent">
              <div className="action-banner-content">
                <h3>Welfare Check Required</h3>
                <p>
                  Please complete a welfare check for{' '}
                  <strong>{check.pet_name}</strong>. As per our adoption terms, this is mandatory.
                </p>
                <p className="action-banner-meta">
                  Requested {formatDate(check.requested_at)}
                </p>
              </div>
              <button className="action-banner-btn" onClick={() => openWelfareModal(check)}>
                Complete Welfare Check
              </button>
            </div>
          ))}

          {pendingStoryRequests.map((story) => (
            <div key={`sr-${story.story_id}`} className="action-banner action-banner-info">
              <div className="action-banner-content">
                <h3>Story Request</h3>
                <p>
                  Our team has invited you to share your adoption story for{' '}
                  <strong>{story.pet.name}</strong>.
                </p>
                <p className="action-banner-meta">
                  Requested {formatDate(story.submitted_at)}
                </p>
              </div>
              <button className="action-banner-btn" onClick={() => openStoryModal(story)}>
                Write Story
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="profile-dashboard">
        <div className="dashboard-card dashboard-card-wide">
          <h2>My Adoption Requests</h2>

          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : adoptions.length === 0 ? (
            <p className="empty-state">
              No adoption requests yet.{' '}
              <Link to="/pets" className="inline-link">Browse pets</Link> to get started.
            </p>
          ) : (
            <div className="application-list">
              {adoptions.map((app) => (
                <ApplicationItem
                  key={app.adoption_id}
                  application={app}
                  isExpanded={!!expanded[app.adoption_id]}
                  onToggle={() => toggleExpand(app.adoption_id)}
                  onShareUpdate={() => openUpdateModal(app)}
                  onShareStory={() => openShareStoryModal(app)}
                  storiesForThisAdoption={stories.filter(
                    (s) => s.adoption_id === app.adoption_id
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2>My Stories</h2>
          {stories.length === 0 ? (
            <p className="empty-state">No stories submitted yet.</p>
          ) : (
            <div className="story-list">
              {stories.map((s) => (
                <button
                  key={s.story_id}
                  className="story-list-item"
                  onClick={() => openViewStoryModal(s)}
                >
                  <h4>{s.title || `Story for ${s.pet.name}`}</h4>
                  <p className="story-list-status">
                    <span className={`status-badge story-status-${s.status}`}>
                      {getStoryStatusLabel(s.status)}
                    </span>
                  </p>
                  {s.photos && s.photos.length > 0 && (
                    <p className="story-list-photo-count">
                      {s.photos.length} photo{s.photos.length === 1 ? '' : 's'}
                    </p>
                  )}
                  {s.status === 'rejected' && s.admin_note && (
                    <p className="story-list-note">
                      <strong>Admin note:</strong> {s.admin_note}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2>My Rescue Reports</h2>
          <p className="empty-state">No rescue reports yet.</p>
        </div>
      </section>

      {welfareModal && (
        <WelfareResponseModal
          modal={welfareModal}
          onChangeField={updateWelfareField}
          onConfirm={submitWelfareResponse}
          onCancel={() => setWelfareModal(null)}
        />
      )}

      {storyModal && (
        <StoryWriteModal
          modal={storyModal}
          onChangeField={updateStoryField}
          onConfirm={submitStoryResponse}
          onCancel={() => setStoryModal(null)}
          isResponse={true}
        />
      )}

      {shareStoryModal && (
        <StoryWriteModal
          modal={shareStoryModal}
          onChangeField={updateShareStoryField}
          onConfirm={submitOwnStory}
          onCancel={() => setShareStoryModal(null)}
          isResponse={false}
        />
      )}

      {updateModal && (
        <div className="modal-overlay" onClick={() => setUpdateModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Share an Update</h2>
            <p className="modal-subtext">
              How is <strong>{updateModal.petName}</strong> doing?
            </p>
            <label className="modal-label">
              Your Update
              <textarea
                value={updateModal.text}
                onChange={(e) =>
                  setUpdateModal((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder="Share milestones, fun moments, or anything you'd like the foster home to know..."
                rows={5}
              />
            </label>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setUpdateModal(null)}>
                Cancel
              </button>
              <button
                className="approve-btn"
                onClick={submitUpdate}
                disabled={!updateModal.text.trim()}
              >
                Share Update
              </button>
            </div>
          </div>
        </div>
      )}

      {viewStoryModal && (
        <ViewStoryModal
          story={viewStoryModal}
          onClose={() => setViewStoryModal(null)}
        />
      )}
    </div>
  );
}

// =====================================================
// ApplicationItem
// =====================================================
function ApplicationItem({
  application, isExpanded, onToggle,
  onShareUpdate, onShareStory,
  storiesForThisAdoption,
}) {
  const {
    pet, status, date_applied,
    appointment_date, decision_note,
    motivation, financial_capability,
    applicant_address, owns_home,
    is_first_pet, has_experience, has_other_pets, has_children,
    _refreshKey,
  } = application;

  const [updates, setUpdates] = useState([]);
  const [checks, setChecks] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  useEffect(() => {
    if (!isExpanded || status !== 'completed') return;

    async function fetchTimeline() {
      setTimelineLoading(true);
      try {
        const [u, c] = await Promise.all([
          listPostAdoptionUpdates(application.adoption_id),
          listWelfareChecks(application.adoption_id),
        ]);
        setUpdates(u);
        setChecks(c);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setTimelineLoading(false);
      }
    }
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, status, _refreshKey]);

  const completedChecks = checks.filter((c) => c.status === 'completed');

  const timeline = [
    ...updates.map((u) => ({ type: 'update', date: u.date_posted, data: u })),
    ...completedChecks.map((c) => ({ type: 'check', date: c.responded_at, data: c })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const hasExistingStory = storiesForThisAdoption.length > 0;

  return (
    <div className="application-item-wrapper">
      <button className="application-item" onClick={onToggle}>
        <img src={getPhotoUrl(pet.photo)} alt={pet.name} className="application-photo" />
        <div className="application-info">
          <div className="application-top">
            <h3>{pet.name}</h3>
            <span className={`status-badge status-${status}`}>{getStatusLabel(status)}</span>
          </div>
          <p className="application-meta">
            {pet.breed || pet.species_name} · Applied {formatDate(date_applied)}
          </p>
          {status === 'appointment_scheduled' && appointment_date && (
            <p className="application-highlight">
              Appointment: <strong>{formatDateTime(appointment_date)}</strong>
            </p>
          )}
        </div>
        <span className={`application-chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="application-details">
          {(status === 'approved' || status === 'rejected') && decision_note && (
            <div className="detail-section">
              <h4>Decision Note from Foster Home</h4>
              <p className="detail-quote">"{decision_note}"</p>
            </div>
          )}

          {status === 'completed' && (
            <div className="detail-section">
              <div className="timeline-header">
                <h4>Welfare & Updates Timeline</h4>
                <div className="timeline-actions">
                  <button
                    className="share-update-btn"
                    onClick={(e) => { e.stopPropagation(); onShareUpdate(); }}
                  >
                    Share Update
                  </button>
                  {!hasExistingStory && (
                    <button
                      className="share-story-btn"
                      onClick={(e) => { e.stopPropagation(); onShareStory(); }}
                    >
                      Share Story
                    </button>
                  )}
                </div>
              </div>

              {timelineLoading ? (
                <p className="empty-state">Loading timeline...</p>
              ) : timeline.length === 0 ? (
                <p className="empty-state">
                  No activity yet — share your first update for {pet.name}.
                </p>
              ) : (
                <div className="timeline">
                  {timeline.map((entry) => (
                    <TimelineEntry
                      key={`${entry.type}-${entry.data.update_id || entry.data.check_id}`}
                      entry={entry}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

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
              <li>{is_first_pet ? 'Yes' : 'No'} — First pet</li>
              <li>{has_experience ? 'Yes' : 'No'} — Has pet care experience</li>
              <li>{has_other_pets ? 'Yes' : 'No'} — Has other pets at home</li>
              <li>{has_children ? 'Yes' : 'No'} — Has children at home</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// TimelineEntry
// =====================================================
function TimelineEntry({ entry }) {
  if (entry.type === 'update') {
    const u = entry.data;
    return (
      <div className="timeline-entry timeline-entry-update">
        <div className="timeline-entry-header">
          <span className="timeline-entry-author">You shared</span>
          <span className="timeline-entry-date">{formatDate(u.date_posted)}</span>
        </div>
        <p>{u.update_text}</p>
      </div>
    );
  }

  const c = entry.data;
  return (
    <div className="timeline-entry timeline-entry-check">
      <div className="timeline-entry-header">
        <span className="timeline-entry-author">Welfare check (you reported)</span>
        <span className="timeline-entry-date">{formatDate(c.responded_at)}</span>
      </div>
      <p className={`condition-label condition-${c.condition_status}`}>
        Condition: {getConditionLabel(c.condition_status)}
      </p>
      <p>{c.notes}</p>

      {c.photos && c.photos.length > 0 && (
        <div className="timeline-photos">
          {c.photos.map((photo, i) => (
            <a key={i} href={getPhotoUrl(photo)} target="_blank" rel="noopener noreferrer">
              <img src={getPhotoUrl(photo)} alt={`Photo ${i + 1}`} />
            </a>
          ))}
        </div>
      )}

      <p className="timeline-entry-meta">Requested by {c.admin_name}</p>
    </div>
  );
}

// =====================================================
// ViewStoryModal — read-only display ng story
// =====================================================
function ViewStoryModal({ story, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
        <h2>{story.title || `Story for ${story.pet.name}`}</h2>
        <p className="modal-subtext">
          About <strong>{story.pet.name}</strong>
          <span className={`status-badge story-status-${story.status}`} style={{ marginLeft: '10px' }}>
            {getStoryStatusLabel(story.status)}
          </span>
        </p>

        {/* main story content */}
        <div className="view-story-content">
          {story.content ? (
            <p>{story.content}</p>
          ) : (
            <p className="empty-state">No content yet.</p>
          )}
        </div>

        {/* photo gallery */}
        {story.photos && story.photos.length > 0 && (
          <div className="view-story-photos">
            {story.photos.map((photo, i) => (
              <a key={i} href={getPhotoUrl(photo)} target="_blank" rel="noopener noreferrer">
                <img src={getPhotoUrl(photo)} alt={`Photo ${i + 1}`} />
              </a>
            ))}
          </div>
        )}

        {/* timeline / metadata */}
        <div className="view-story-meta">
          {story.status === 'submitted' && (
            <p>Submitted on {formatDate(story.submitted_at)}. Awaiting admin review.</p>
          )}
          {story.status === 'published' && (
            <p>Published on {formatDate(story.published_at)}.</p>
          )}
          {story.status === 'rejected' && story.admin_note && (
            <div className="view-story-rejection">
              <h4>Admin Note</h4>
              <p>{story.admin_note}</p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// WelfareResponseModal
// =====================================================
function WelfareResponseModal({ modal, onChangeField, onConfirm, onCancel }) {
  const conditions = ['excellent', 'good', 'concerning', 'critical'];

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
        <h2>Welfare Check</h2>
        <p className="modal-subtext">
          Tell us how <strong>{modal.petName}</strong> is doing.
        </p>

        <label className="modal-label">
          Pet's Current Condition
          <div className="condition-options">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                className={`condition-pill condition-${c} ${
                  modal.condition === c ? 'selected' : ''
                }`}
                onClick={() => onChangeField('condition', c)}
              >
                {getConditionLabel(c)}
              </button>
            ))}
          </div>
        </label>

        <label className="modal-label">
          Notes
          <textarea
            value={modal.notes}
            onChange={(e) => onChangeField('notes', e.target.value)}
            placeholder="How is your pet adjusting? Any health concerns? Daily routines, milestones, anything you want to share..."
            rows={5}
          />
        </label>

        <PhotoUploader
          files={modal.photos}
          onChange={(files) => onChangeField('photos', files)}
          maxFiles={5}
          label="Photos (Optional)"
        />

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="approve-btn"
            onClick={onConfirm}
            disabled={!modal.notes.trim()}
          >
            Submit Welfare Check
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// StoryWriteModal
// =====================================================
function StoryWriteModal({ modal, onChangeField, onConfirm, onCancel, isResponse }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
        <h2>{isResponse ? 'Write Your Story' : 'Share Your Story'}</h2>
        <p className="modal-subtext">
          About <strong>{modal.petName}</strong>
        </p>

        <label className="modal-label">
          Story Title
          <input
            type="text"
            value={modal.title}
            onChange={(e) => onChangeField('title', e.target.value)}
            placeholder='e.g. "Henhen changed our lives"'
          />
        </label>

        <label className="modal-label">
          Your Story
          <textarea
            value={modal.content}
            onChange={(e) => onChangeField('content', e.target.value)}
            placeholder="Tell us about your adoption journey — how you met your pet, the early days, how life is now..."
            rows={8}
          />
        </label>

        <PhotoUploader
          files={modal.photos}
          onChange={(files) => onChangeField('photos', files)}
          maxFiles={8}
          label="Photos (Optional)"
        />

        <p className="modal-confirm-text">
          Your story will be reviewed by our team before being published. Once
          approved, it may appear as the Featured Story on our homepage.
        </p>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="approve-btn"
            onClick={onConfirm}
            disabled={!modal.title.trim() || !modal.content.trim()}
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;