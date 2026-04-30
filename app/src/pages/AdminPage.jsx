// admin page — adoption requests, community posts, at stories.

import { useState, useEffect } from 'react';
import {
  getAllAdoptions,
  updateAdoptionStatus,
  listPostAdoptionUpdates,
  listWelfareChecks,
  requestWelfareCheck,
} from '../services/adoptionsService.js';
import {
  getAllStories,
  requestStoryFromAdopter,
  adminCreateStory,
  reviewStory,
  unpublishStory,
} from '../services/storiesService.js';
import PhotoUploader from '../components/PhotoUploader.jsx';
import '../styles/admin.css';

import { getPhotoUrl } from '../utils/photoUrl.js';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
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
    pending: 'Awaiting adopter', submitted: 'Pending review',
    published: 'Published', rejected: 'Rejected',
  };
  return labels[status] || status;
}

const SAMPLE_COMMUNITY_POSTS = [
  {
    post_id: 1,
    status: 'pending',
    pet_name: '3 Kittens',
    description: "Found 3 kittens behind SM Tacloban. They're about 4 weeks old and need a loving home.",
    species_name: 'Cat',
    location: 'Downtown Tacloban',
    poster: {
      full_name: 'Maria Santos', email: 'maria.santos@email.com',
      cell_num: '0917-555-0202', address: 'Downtown Tacloban',
    },
    date_posted: 'March 26, 2026',
    photos: ['https://placehold.co/200x200?text=Kitten+1', 'https://placehold.co/200x200?text=Kitten+2'],
  },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState('adoptions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});

  const [adoptions, setAdoptions] = useState([]);
  const [adoptionsLoading, setAdoptionsLoading] = useState(true);
  const [adoptionsError, setAdoptionsError] = useState('');

  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const [posts, setPosts] = useState(SAMPLE_COMMUNITY_POSTS);

  const [actionModal, setActionModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [adminStoryModal, setAdminStoryModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadAdoptions(); }, []);

  useEffect(() => {
    if (activeTab === 'stories' && stories.length === 0 && !storiesLoading) {
      loadStories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function loadAdoptions() {
    try {
      const data = await getAllAdoptions();
      setAdoptions(data);
    } catch (err) {
      console.error('Failed to load adoptions:', err);
      setAdoptionsError('Could not load adoption requests.');
    } finally {
      setAdoptionsLoading(false);
    }
  }

  async function loadStories() {
    setStoriesLoading(true);
    try {
      const data = await getAllStories();
      setStories(data);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setStoriesLoading(false);
    }
  }

  function showToast(message, kind = 'success') {
    setToast({ message, kind });
  }

  const pendingAdoptions = adoptions.filter((a) => a.status === 'pending').length;
  const pendingPosts = posts.filter((p) => p.status === 'pending').length;
  const submittedStories = stories.filter((s) => s.status === 'submitted').length;

  function toggleCard(cardKey) {
    setExpandedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }));
  }

  function applyFilter(items) {
    if (statusFilter === 'all') return items;
    return items.filter((item) => item.status === statusFilter);
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

  // ============ adoption status actions ============

  function openActionModal(adoptionId, action, petName) {
    setActionModal({ adoptionId, action, petName, note: '', appointment_date: '' });
  }

  function updateActionField(field, value) {
    setActionModal((prev) => ({ ...prev, [field]: value }));
  }

  async function confirmAction() {
    if (!actionModal) return;
    const { adoptionId, action, note, appointment_date } = actionModal;

    let newStatus;
    const extras = {};

    if (action === 'approve') { newStatus = 'approved'; extras.decision_note = note; }
    else if (action === 'reject') { newStatus = 'rejected'; extras.decision_note = note; }
    else if (action === 'schedule') { newStatus = 'appointment_scheduled'; extras.appointment_date = appointment_date; }
    else if (action === 'complete') { newStatus = 'completed'; }

    try {
      await updateAdoptionStatus(adoptionId, newStatus, extras);
      setAdoptions((prev) =>
        prev.map((a) =>
          a.adoption_id === adoptionId
            ? {
                ...a,
                status: newStatus,
                decision_note: extras.decision_note || a.decision_note,
                appointment_date: extras.appointment_date || a.appointment_date,
                date_decided: action === 'approve' || action === 'reject' ? new Date().toISOString() : a.date_decided,
                date_completed: action === 'complete' ? new Date().toISOString() : a.date_completed,
              }
            : a
        )
      );
      setActionModal(null);
    } catch (err) {
      console.error('Status update error:', err);
      showToast(err.response?.data?.error || 'Failed to update.', 'error');
    }
  }

  // ============ welfare check / story request ============

  function handleRequestWelfareCheck(adoptionId, petName) {
    setConfirmModal({
      title: 'Request Welfare Check',
      message: <>Send a welfare check request to the adopter of <strong>{petName}</strong>? They will be required to respond.</>,
      confirmLabel: 'Send Request',
      confirmClass: 'schedule-btn',
      onConfirm: async () => {
        try {
          await requestWelfareCheck(adoptionId);
          refreshAdoption(adoptionId);
          showToast('Welfare check requested. The adopter has been notified.');
        } catch (err) {
          showToast(err.response?.data?.error || 'Failed to request welfare check.', 'error');
        }
      },
    });
  }

  function handleRequestStory(adoptionId, petName) {
    setConfirmModal({
      title: 'Request Story',
      message: <>Invite the adopter of <strong>{petName}</strong> to share their adoption story? They'll see this request on their profile.</>,
      confirmLabel: 'Send Request',
      confirmClass: 'schedule-btn',
      onConfirm: async () => {
        try {
          await requestStoryFromAdopter(adoptionId);
          showToast('Story request sent. The adopter has been notified.');
          if (activeTab === 'stories') loadStories();
        } catch (err) {
          showToast(err.response?.data?.error || 'Failed to request story.', 'error');
        }
      },
    });
  }

  // ============ story review ============

  function openReviewModal(story) {
    setReviewModal({
      storyId: story.story_id,
      title: story.title,
      content: story.content,
      photos: story.photos || [],   // existing photos para makita ng admin
      petName: story.pet.name,
      adopterName: story.adopter_name,
      action: 'publish',
      adminNote: '',
    });
  }

  function updateReviewField(field, value) {
    setReviewModal((prev) => ({ ...prev, [field]: value }));
  }

  async function confirmReview() {
    if (!reviewModal) return;
    try {
      await reviewStory(reviewModal.storyId, reviewModal.action, reviewModal.adminNote);
      setStories((prev) =>
        prev.map((s) =>
          s.story_id === reviewModal.storyId
            ? {
                ...s,
                status: reviewModal.action === 'publish' ? 'published' : 'rejected',
                admin_note: reviewModal.adminNote,
                published_at: reviewModal.action === 'publish' ? new Date().toISOString() : null,
              }
            : s
        )
      );
      setReviewModal(null);
      showToast(reviewModal.action === 'publish' ? 'Story published.' : 'Story rejected.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update story.', 'error');
    }
  }

  function handleUnpublish(storyId) {
    setConfirmModal({
      title: 'Unpublish Story',
      message: 'This story will no longer appear on the homepage. You can republish it later if needed.',
      confirmLabel: 'Unpublish',
      confirmClass: 'reject-btn',
      onConfirm: async () => {
        try {
          await unpublishStory(storyId);
          setStories((prev) =>
            prev.map((s) => s.story_id === storyId ? { ...s, status: 'submitted' } : s)
          );
          showToast('Story unpublished.');
        } catch (err) {
          showToast('Failed to unpublish.', 'error');
        }
      },
    });
  }

  // ============ admin-authored story ============

  function openAdminStoryModal(adoption) {
    setAdminStoryModal({
      pet_id: adoption.pet.pet_id,
      adoption_id: adoption.adoption_id,
      pet_name: adoption.pet.name,
      adopter_name: adoption.applicant.full_name,
      title: '',
      content: '',
      photos: [],
    });
  }

  function updateAdminStoryField(field, value) {
    setAdminStoryModal((prev) => ({ ...prev, [field]: value }));
  }

  async function submitAdminStory() {
    if (!adminStoryModal || !adminStoryModal.title.trim() || !adminStoryModal.content.trim()) return;
    try {
      await adminCreateStory(
        {
          pet_id: adminStoryModal.pet_id,
          adoption_id: adminStoryModal.adoption_id,
          title: adminStoryModal.title,
          content: adminStoryModal.content,
        },
        adminStoryModal.photos
      );
      setAdminStoryModal(null);
      loadStories();
      showToast('Story published.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create story.', 'error');
    }
  }

  // ============ community placeholder ============

  function handleApprovePost(id) {
    setPosts((prev) => prev.map((p) => p.post_id === id ? { ...p, status: 'approved' } : p));
  }
  function handleRejectPost(id) {
    setPosts((prev) => prev.map((p) => p.post_id === id ? { ...p, status: 'rejected' } : p));
  }

  const filters = ['all', 'pending', 'approved', 'rejected'];
  const filteredAdoptions = applyFilter(adoptions);
  const filteredPosts = applyFilter(posts);

  return (
    <div className="admin-container">
      <div className="admin-content">
        <p className="admin-label">Admin</p>

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
          <button
            className={activeTab === 'stories' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('stories')}
          >
            Stories
            {submittedStories > 0 && <span className="tab-badge">{submittedStories}</span>}
          </button>
        </div>

        {activeTab !== 'stories' && (
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
        )}

        <div className="admin-cards">
          {activeTab === 'adoptions' && (
            adoptionsLoading ? <p className="empty-state">Loading adoption requests...</p>
            : adoptionsError ? <p className="empty-state">{adoptionsError}</p>
            : filteredAdoptions.length === 0 ? <p className="empty-state">No adoption requests in this filter.</p>
            : filteredAdoptions.map((req) => {
                const key = `a-${req.adoption_id}`;
                return (
                  <AdoptionRequestCard
                    key={key}
                    request={req}
                    isExpanded={!!expandedCards[key]}
                    onToggle={() => toggleCard(key)}
                    onApprove={() => openActionModal(req.adoption_id, 'approve', req.pet.name)}
                    onReject={() => openActionModal(req.adoption_id, 'reject', req.pet.name)}
                    onSchedule={() => openActionModal(req.adoption_id, 'schedule', req.pet.name)}
                    onComplete={() => openActionModal(req.adoption_id, 'complete', req.pet.name)}
                    onRequestWelfareCheck={() => handleRequestWelfareCheck(req.adoption_id, req.pet.name)}
                    onRequestStory={() => handleRequestStory(req.adoption_id, req.pet.name)}
                    onAdminAuthorStory={() => openAdminStoryModal(req)}
                  />
                );
              })
          )}

          {activeTab === 'community' && (
            filteredPosts.length === 0 ? <p className="empty-state">No community posts in this filter.</p>
            : filteredPosts.map((post) => {
                const key = `p-${post.post_id}`;
                return (
                  <CommunityPostCard
                    key={key} post={post}
                    isExpanded={!!expandedCards[key]}
                    onToggle={() => toggleCard(key)}
                    onApprove={() => handleApprovePost(post.post_id)}
                    onReject={() => handleRejectPost(post.post_id)}
                  />
                );
              })
          )}

          {activeTab === 'stories' && (
            <StoriesTab stories={stories} loading={storiesLoading} onReview={openReviewModal} onUnpublish={handleUnpublish} />
          )}
        </div>
      </div>

      {actionModal && <ActionModal modal={actionModal} onChangeField={updateActionField} onConfirm={confirmAction} onCancel={() => setActionModal(null)} />}
      {reviewModal && <ReviewStoryModal modal={reviewModal} onChangeField={updateReviewField} onConfirm={confirmReview} onCancel={() => setReviewModal(null)} />}
      {adminStoryModal && <AdminStoryModal modal={adminStoryModal} onChangeField={updateAdminStoryField} onConfirm={submitAdminStory} onCancel={() => setAdminStoryModal(null)} />}
      {confirmModal && <ConfirmModal modal={confirmModal} onCancel={() => setConfirmModal(null)} onConfirm={async () => { const handler = confirmModal.onConfirm; setConfirmModal(null); await handler(); }} />}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function AdoptionRequestCard({ request, isExpanded, onToggle, onApprove, onReject, onSchedule, onComplete, onRequestWelfareCheck, onRequestStory, onAdminAuthorStory }) {
  const status = request.status;
  return (
    <div className={`admin-card status-${status}`}>
      <button className="card-header" onClick={onToggle}>
        <div className="card-header-text">
          <h2>{request.pet.name}</h2>
          <p>{request.pet.breed || request.pet.species_name} <span className="dot">⋅</span> Applied {formatDate(request.date_applied)}</p>
        </div>
        <span className={`chevron ${isExpanded ? 'up' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="card-content">
          <div className="card-grid">
            <div className="info-section">
              <h3>APPLICANT INFORMATION</h3>
              <h4>Full Name</h4><p>{request.applicant.full_name}</p>
              <h4>Email</h4><p>{request.applicant.email}</p>
              <h4>Phone</h4><p>{request.applicant.cell_num}</p>
              <h4>Address</h4><p>{request.applicant_address}</p>
              <h4>Home Ownership</h4><p>{request.owns_home ? 'Owns home' : 'Renting/leasing'}</p>
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
            <img src={getPhotoUrl(request.pet.photo)} alt={request.pet.name} className="pet-photo" />
          </div>

          {status === 'appointment_scheduled' && request.appointment_date && (
            <p className="status-info-note"><strong>Appointment:</strong> {formatDate(request.appointment_date)}</p>
          )}

          {(status === 'approved' || status === 'rejected') && request.decision_note && (
            <div className="decision-display">
              <p className="decision-note-display"><strong>Decision Note:</strong> "{request.decision_note}"</p>
            </div>
          )}

          {status === 'completed' && (
            <CompletedAdoptionTimeline
              adoptionId={request.adoption_id}
              refreshKey={request._refreshKey || 0}
              petName={request.pet.name}
              onRequestWelfareCheck={onRequestWelfareCheck}
              onRequestStory={onRequestStory}
              onAdminAuthorStory={onAdminAuthorStory}
            />
          )}

          <ActionButtonsForStatus status={status} onApprove={onApprove} onReject={onReject} onSchedule={onSchedule} onComplete={onComplete} />
        </div>
      )}
    </div>
  );
}

function CompletedAdoptionTimeline({ adoptionId, refreshKey, petName, onRequestWelfareCheck, onRequestStory, onAdminAuthorStory }) {
  const [updates, setUpdates] = useState([]);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      try {
        const [u, c] = await Promise.all([
          listPostAdoptionUpdates(adoptionId),
          listWelfareChecks(adoptionId),
        ]);
        setUpdates(u);
        setChecks(c);
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [adoptionId, refreshKey]);

  const completedChecks = checks.filter((c) => c.status === 'completed');
  const pendingChecks = checks.filter((c) => c.status === 'pending');
  const hasPendingCheck = pendingChecks.length > 0;

  const timeline = [
    ...updates.map((u) => ({ type: 'update', date: u.date_posted, data: u })),
    ...completedChecks.map((c) => ({ type: 'check', date: c.responded_at, data: c })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="admin-timeline-section">
      <div className="timeline-header">
        <h3>WELFARE & UPDATES TIMELINE</h3>
        <div className="timeline-actions">
          <button
            className="schedule-btn small-btn"
            onClick={onRequestWelfareCheck}
            disabled={hasPendingCheck}
            title={hasPendingCheck ? "A pending check is already in the adopter's queue" : ''}
          >
            {hasPendingCheck ? 'Welfare Check Pending' : 'Request Welfare Check'}
          </button>
          <button className="schedule-btn small-btn" onClick={onRequestStory}>Request Story from Adopter</button>
          <button className="approve-btn small-btn" onClick={onAdminAuthorStory}>Write Story (Admin)</button>
        </div>
      </div>

      {loading ? <p className="empty-state">Loading timeline...</p> : (
        <>
          {hasPendingCheck && (
            <p className="pending-note">
              <strong>{pendingChecks.length}</strong> welfare check{pendingChecks.length === 1 ? '' : 's'} awaiting adopter response.
            </p>
          )}
          {timeline.length === 0 ? (
            <p className="empty-state">No activity yet — request the first welfare check for {petName}.</p>
          ) : (
            <div className="timeline">
              {timeline.map((entry) => (
                <TimelineEntry key={`${entry.type}-${entry.data.update_id || entry.data.check_id}`} entry={entry} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TimelineEntry({ entry }) {
  if (entry.type === 'update') {
    const u = entry.data;
    return (
      <div className="timeline-entry timeline-entry-update">
        <div className="timeline-entry-header">
          <span className="timeline-entry-author">Adopter shared</span>
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
        <span className="timeline-entry-author">Welfare check (response from adopter)</span>
        <span className="timeline-entry-date">{formatDate(c.responded_at)}</span>
      </div>
      <p className={`condition-label condition-${c.condition_status}`}>Condition: {getConditionLabel(c.condition_status)}</p>
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

function ActionButtonsForStatus({ status, onApprove, onReject, onSchedule, onComplete }) {
  if (status === 'pending') {
    return (
      <>
        <div className="action-buttons">
          <button className="schedule-btn" onClick={onSchedule}>Schedule Appointment</button>
          <button className="approve-btn" onClick={onApprove}>Approve</button>
          <button className="reject-btn" onClick={onReject}>Reject</button>
        </div>
        <p className="action-note">This action will notify the applicant via email.</p>
      </>
    );
  }
  if (status === 'appointment_scheduled') {
    return (
      <>
        <div className="action-buttons">
          <button className="approve-btn" onClick={onApprove}>Approve</button>
          <button className="reject-btn" onClick={onReject}>Reject</button>
        </div>
        <p className="action-note">Approve or reject after the appointment.</p>
      </>
    );
  }
  if (status === 'approved') {
    return (
      <>
        <div className="action-buttons"><button className="approve-btn" onClick={onComplete}>Mark as Completed</button></div>
        <p className="action-note">Mark as completed once the pet has been claimed.</p>
      </>
    );
  }
  return <p className="status-note">Status: <strong>{status}</strong></p>;
}

function StoriesTab({ stories, loading, onReview, onUnpublish }) {
  if (loading) return <p className="empty-state">Loading stories...</p>;
  if (stories.length === 0) {
    return <p className="empty-state">No stories yet. Request a story from a completed adoption or write your own.</p>;
  }

  const grouped = {
    submitted: stories.filter((s) => s.status === 'submitted'),
    pending: stories.filter((s) => s.status === 'pending'),
    published: stories.filter((s) => s.status === 'published'),
    rejected: stories.filter((s) => s.status === 'rejected'),
  };

  return (
    <>
      {grouped.submitted.length > 0 && <StorySection title={`Awaiting Review (${grouped.submitted.length})`} stories={grouped.submitted} onReview={onReview} />}
      {grouped.pending.length > 0 && <StorySection title={`Awaiting Adopter (${grouped.pending.length})`} stories={grouped.pending} />}
      {grouped.published.length > 0 && <StorySection title={`Published (${grouped.published.length})`} stories={grouped.published} onUnpublish={onUnpublish} />}
      {grouped.rejected.length > 0 && <StorySection title={`Rejected (${grouped.rejected.length})`} stories={grouped.rejected} />}
    </>
  );
}

function StorySection({ title, stories, onReview, onUnpublish }) {
  return (
    <div className="story-section">
      <h3 className="story-section-title">{title}</h3>
      {stories.map((story) => (
        <div key={story.story_id} className="admin-card story-card">
          <div className="story-card-content">
            <div className="story-card-meta">
              <h2>{story.title || `Story for ${story.pet.name}`}</h2>
              <p className="story-card-subtitle">
                About <strong>{story.pet.name}</strong>, adopted by <strong>{story.adopter_name}</strong>
                {story.was_requested && <span className="meta-tag">requested</span>}
              </p>
              <p className="story-card-date">
                {story.status === 'published' ? <>Published {formatDate(story.published_at)}</>
                  : story.status === 'pending' ? <>Requested {formatDate(story.submitted_at)}</>
                  : <>Submitted {formatDate(story.submitted_at)}</>}
              </p>
              {story.content && (
                <p className="story-card-excerpt">
                  {story.content.length > 200 ? `${story.content.slice(0, 200)}...` : story.content}
                </p>
              )}
              {story.photos && story.photos.length > 0 && (
                <div className="story-card-photos">
                  {story.photos.slice(0, 4).map((photo, i) => (
                    <img key={i} src={getPhotoUrl(photo)} alt={`Photo ${i + 1}`} />
                  ))}
                  {story.photos.length > 4 && (
                    <div className="story-photos-more">+{story.photos.length - 4}</div>
                  )}
                </div>
              )}
              {story.admin_note && (
                <p className="story-admin-note"><strong>Admin note:</strong> {story.admin_note}</p>
              )}
            </div>
            <div className="story-card-actions">
              <span className={`story-status story-status-${story.status}`}>{getStoryStatusLabel(story.status)}</span>
              {story.status === 'submitted' && <button className="approve-btn small-btn" onClick={() => onReview(story)}>Review</button>}
              {story.status === 'published' && <button className="reject-btn small-btn" onClick={() => onUnpublish(story.story_id)}>Unpublish</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ modal, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{modal.title}</h2>
        <p className="modal-confirm-text">{modal.message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className={modal.confirmClass || 'approve-btn'} onClick={onConfirm}>{modal.confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  return <div className={`toast toast-${toast.kind}`}>{toast.message}</div>;
}

function ActionModal({ modal, onChangeField, onConfirm, onCancel }) {
  const { action, petName } = modal;
  const config = {
    approve: { title: 'Approve Application', placeholder: 'Add a welcoming message...', confirmLabel: 'Confirm Approval', confirmClass: 'approve-btn', showNote: true, showDate: false },
    reject: { title: 'Reject Application', placeholder: 'Explain why this is being rejected...', confirmLabel: 'Confirm Rejection', confirmClass: 'reject-btn', showNote: true, showDate: false },
    schedule: { title: 'Schedule Appointment', placeholder: '', confirmLabel: 'Confirm Schedule', confirmClass: 'schedule-btn', showNote: false, showDate: true },
    complete: { title: 'Mark as Completed', placeholder: '', confirmLabel: 'Confirm Completion', confirmClass: 'approve-btn', showNote: false, showDate: false },
  }[action];

  const canConfirm = config.showDate ? !!modal.appointment_date : true;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{config.title}</h2>
        <p className="modal-subtext">For <strong>{petName}</strong>'s application</p>
        {config.showDate && (
          <label className="modal-label">
            Appointment Date & Time
            <input type="datetime-local" value={modal.appointment_date} onChange={(e) => onChangeField('appointment_date', e.target.value)} />
          </label>
        )}
        {config.showNote && (
          <label className="modal-label">
            Decision Note (optional)
            <textarea value={modal.note} onChange={(e) => onChangeField('note', e.target.value)} placeholder={config.placeholder} rows={4} />
          </label>
        )}
        {action === 'complete' && (
          <p className="modal-confirm-text">This will mark <strong>{petName}</strong> as adopted and remove them from the available pets list. Continue?</p>
        )}
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className={config.confirmClass} onClick={onConfirm} disabled={!canConfirm}>{config.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ReviewStoryModal — now displays photos from the submitted story
function ReviewStoryModal({ modal, onChangeField, onConfirm, onCancel }) {
  const isPublish = modal.action === 'publish';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
        <h2>Review Story</h2>
        <p className="modal-subtext">By <strong>{modal.adopterName}</strong> about <strong>{modal.petName}</strong></p>

        <div className="story-preview">
          <h3>{modal.title}</h3>
          <p>{modal.content}</p>

          {modal.photos && modal.photos.length > 0 && (
            <div className="story-preview-photos">
              {modal.photos.map((photo, i) => (
                <a key={i} href={getPhotoUrl(photo)} target="_blank" rel="noopener noreferrer">
                  <img src={getPhotoUrl(photo)} alt={`Photo ${i + 1}`} />
                </a>
              ))}
            </div>
          )}
        </div>

        <label className="modal-label">
          Action
          <div className="condition-options">
            <button
              type="button"
              className={`condition-pill ${modal.action === 'publish' ? 'selected' : ''}`}
              onClick={() => onChangeField('action', 'publish')}
              style={{
                borderColor: modal.action === 'publish' ? '#1A6A2E' : undefined,
                backgroundColor: modal.action === 'publish' ? '#D6F4DE' : undefined,
              }}
            >Publish</button>
            <button
              type="button"
              className={`condition-pill ${modal.action === 'reject' ? 'selected' : ''}`}
              onClick={() => onChangeField('action', 'reject')}
              style={{
                borderColor: modal.action === 'reject' ? '#A52828' : undefined,
                backgroundColor: modal.action === 'reject' ? '#FFD6D6' : undefined,
              }}
            >Reject</button>
          </div>
        </label>

        <label className="modal-label">
          {isPublish ? 'Optional note for adopter' : 'Reason for rejection'}
          <textarea value={modal.adminNote} onChange={(e) => onChangeField('adminNote', e.target.value)} placeholder={isPublish ? 'Optional message...' : 'Tell the adopter why...'} rows={3} />
        </label>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className={isPublish ? 'approve-btn' : 'reject-btn'} onClick={onConfirm}>
            {isPublish ? 'Publish Story' : 'Reject Story'}
          </button>
        </div>
      </div>
    </div>
  );
}

// AdminStoryModal — kasama na ang photo uploader
function AdminStoryModal({ modal, onChangeField, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
        <h2>Write Story (Admin-Authored)</h2>
        <p className="modal-subtext">About <strong>{modal.pet_name}</strong>, adopted by <strong>{modal.adopter_name}</strong></p>

        <label className="modal-label">
          Story Title
          <input type="text" value={modal.title} onChange={(e) => onChangeField('title', e.target.value)} placeholder="e.g. From street kitten to family member" />
        </label>

        <label className="modal-label">
          Story Content
          <textarea value={modal.content} onChange={(e) => onChangeField('content', e.target.value)} placeholder="Tell the adoption story..." rows={8} />
        </label>

        <PhotoUploader
          files={modal.photos}
          onChange={(files) => onChangeField('photos', files)}
          maxFiles={8}
          label="Photos (Optional)"
        />

        <p className="modal-confirm-text">This story will be auto-published and may appear as the Featured Story on the homepage.</p>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="approve-btn" onClick={onConfirm} disabled={!modal.title.trim() || !modal.content.trim()}>Publish Story</button>
        </div>
      </div>
    </div>
  );
}

function CommunityPostCard({ post, isExpanded, onToggle, onApprove, onReject }) {
  const isDecided = post.status !== 'pending';
  return (
    <div className={`admin-card status-${post.status}`}>
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>{post.pet_name} <span className="header-meta">by {post.poster.full_name}</span></h2>
          <p>{post.location} | Posted {post.date_posted} | {post.photos.length} Photo{post.photos.length === 1 ? '' : 's'}</p>
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
                <div className="post-photos">{post.photos.map((url, i) => <img key={i} src={url} alt={`Photo ${i + 1}`} />)}</div>
              )}
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
          {!isDecided ? (
            <>
              <div className="action-buttons">
                <button className="approve-btn" onClick={onApprove}>Approve & Publish</button>
                <button className="reject-btn" onClick={onReject}>Reject Post</button>
              </div>
              <p className="action-note">Approved posts will appear on the Community page.</p>
            </>
          ) : <p className="status-note">Status: <strong>{post.status}</strong></p>}
        </div>
      )}
    </div>
  );
}

function Check({ label, checked }) {
  return (
    <label className="check-item">
      <input type="checkbox" checked={checked} readOnly />
      <span>{label}</span>
    </label>
  );
}

export default AdminPage;