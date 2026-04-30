import { useState, useEffect, useMemo } from 'react';
import * as AdoptionsService from '../services/adoptionsService.js';
import * as StoriesService from '../services/storiesService.js';
import api from '../services/api.js'; 
import '../styles/admin.css';

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

const getPhotoUrl = (path) => path?.startsWith('http') ? path : (path ? `http://localhost:3000/${path}` : 'https://placehold.co/400x400?text=No+Photo');
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

function AdminPage() {
  const [activeTab, setActiveTab] = useState('adoptions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  const [adoptions, setAdoptions] = useState([]);
  const [adoptionsLoading, setAdoptionsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [posts, setPosts] = useState(SAMPLE_COMMUNITY_POSTS);
  const [rescues, setRescues] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadAdoptions(); loadRescues(); }, []);
  useEffect(() => { if (activeTab === 'stories' && !stories.length && !storiesLoading) loadStories(); }, [activeTab]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const loadAdoptions = async () => {
    try { setAdoptions(await AdoptionsService.getAllAdoptions()); } 
    catch (err) { console.error(err); } finally { setAdoptionsLoading(false); }
  };

  const loadRescues = async () => {
    try {
      const response = await api.get('/rescue'); 
      setRescues(response.data.reports || []);
    } catch (err) { console.error(err); }
  };

  const loadStories = async () => {
    setStoriesLoading(true);
    try { setStories(await StoriesService.getAllStories()); } 
    catch (err) { console.error(err); } finally { setStoriesLoading(false); }
  };

  const toggleCard = (key) => setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredAdoptions = useMemo(() => statusFilter === 'all' ? adoptions : adoptions.filter(a => a.status === statusFilter), [adoptions, statusFilter]);
  const filteredPosts = useMemo(() => statusFilter === 'all' ? posts : posts.filter(p => p.status === statusFilter), [posts, statusFilter]);
  const filteredRescues = useMemo(() => statusFilter === 'all' ? rescues : rescues.filter(r => r.status === statusFilter), [rescues, statusFilter]);

  const pendingAdoptions = adoptions.filter(a => a.status === 'pending').length;
  const pendingPosts = posts.filter(p => p.status === 'pending').length;
  const pendingRescues = rescues.filter(r => r.status === 'pending').length;
  const submittedStories = stories.filter(s => s.status === 'submitted').length;

  return (
    <div className="admin-container">
      <div className="admin-content">
        <p className="admin-label">Admin</p>

        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'adoptions' ? 'active' : ''}`} onClick={() => setActiveTab('adoptions')}>
            Adoption Requests {pendingAdoptions > 0 && <span className="tab-badge">{pendingAdoptions}</span>}
          </button>
          <button className={`admin-tab ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}>
            Community Posts {pendingPosts > 0 && <span className="tab-badge">{pendingPosts}</span>}
          </button>
          <button className={`admin-tab ${activeTab === 'rescues' ? 'active' : ''}`} onClick={() => setActiveTab('rescues')}>
            Rescue Reports {pendingRescues > 0 && <span className="tab-badge">{pendingRescues}</span>}
          </button>
          <button className={`admin-tab ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>
            Stories {submittedStories > 0 && <span className="tab-badge">{submittedStories}</span>}
          </button>
        </div>

        {activeTab !== 'stories' && (
          <div className="admin-filters">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button key={f} className={`filter-pill ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="admin-cards">
          {activeTab === 'adoptions' && (
            adoptionsLoading ? <p className="empty-state">Loading adoption requests...</p>
            : filteredAdoptions.length === 0 ? <p className="empty-state">No adoption requests in this filter.</p>
            : filteredAdoptions.map(req => <AdoptionRequestCard key={req.adoption_id} request={req} isExpanded={!!expandedCards[`a-${req.adoption_id}`]} onToggle={() => toggleCard(`a-${req.adoption_id}`)} />)
          )}

          {activeTab === 'community' && (
            filteredPosts.length === 0 ? <p className="empty-state">No community posts in this filter.</p>
            : filteredPosts.map(post => <CommunityPostCard key={post.post_id} post={post} isExpanded={!!expandedCards[`p-${post.post_id}`]} onToggle={() => toggleCard(`p-${post.post_id}`)} onApprove={() => setPosts(p => p.map(x => x.post_id === post.post_id ? {...x, status: 'approved'} : x))} onReject={() => setPosts(p => p.map(x => x.post_id === post.post_id ? {...x, status: 'rejected'} : x))} />)
          )}

          {activeTab === 'rescues' && (
            filteredRescues.length === 0 ? <p className="empty-state">No rescue reports in this filter.</p>
            : filteredRescues.map(report => <RescueReportCard key={report.report_id} report={report} isExpanded={!!expandedCards[`r-${report.report_id}`]} onToggle={() => toggleCard(`r-${report.report_id}`)} />)
          )}

          {activeTab === 'stories' && <StoriesTab stories={stories} loading={storiesLoading} />}
        </div>
      </div>
      {toast && <div className={`toast toast-${toast.kind}`}>{toast.message}</div>}
    </div>
  );
}

function RescueReportCard({ report, isExpanded, onToggle }) {
  const details = parseRescueDescription(report.description);
  return (
    <div className={`admin-card status-${report.status}`}>
      <button className="card-header card-header-gradient" onClick={onToggle}>
        <div className="card-header-text">
          <h2>Rescue Spotting at {report.location}</h2>
          <p>Reported by {report.reporter_name} <span className="dot">⋅</span> {formatDate(report.date_reported)}</p>
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
              <h4>Date Spotted</h4><p>{details.date || 'N/A'}</p>
              <h4>Time Spotted</h4><p>{details.time || 'N/A'}</p>
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

function AdoptionRequestCard({ request, isExpanded, onToggle }) { return <div className="admin-card">... Adoption UI Logic ...</div>; }
function StoriesTab({ stories, loading }) { return <div className="empty-state">... Stories UI Logic ...</div>; }

export default AdminPage;