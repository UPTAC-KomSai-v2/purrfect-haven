import { useState, useEffect, useMemo } from 'react';
import * as AdoptionsService from '../services/adoptionsService.js';
import * as StoriesService from '../services/storiesService.js';
import api from '../services/api.js'; 
import RescueReportCard from "./admin/RescueReportCard.jsx";
import CommunityPostCard from "./admin/CommunityPostCard.jsx";

import '../styles/admin.css';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('adoptions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  
  const [adoptions, setAdoptions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [rescues, setRescues] = useState([]);
  const [stories, setStories] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const loadInitialData = async () => {
      setLoading(true);
      
      // Load Adoptions independently
      try {
        const ads = await AdoptionsService.getAllAdoptions();
        setAdoptions(ads || []);
      } catch (e) { console.error("Adoptions failed to load:", e); }

      // Load Rescues independently
      try {
        const res = await api.get('/rescue');
        setRescues(res.data.reports || []);
      } catch (e) { console.error("Rescues failed to load:", e); }

      // Load Community Posts independently
      try {
        const commRes = await api.get('/community');
        // Check if data is coming through as .posts (from controller res.json)
        setPosts(commRes.data.posts || []);
      } catch (e) { console.error("Community posts failed to load:", e); }

      setLoading(false);
    };
    loadInitialData();
  }, []);

  const toggleCard = (key) => setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));

  // Filtered Lists
  const filteredAdoptions = useMemo(() => statusFilter === 'all' ? adoptions : adoptions.filter(a => a.status === statusFilter), [adoptions, statusFilter]);
  const filteredPosts = useMemo(() => statusFilter === 'all' ? posts : posts.filter(p => p.status === statusFilter), [posts, statusFilter]);
  const filteredRescues = useMemo(() => statusFilter === 'all' ? rescues : rescues.filter(r => r.status === statusFilter), [rescues, statusFilter]);

  // Badge Logic
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
          {activeTab === 'community' && filteredPosts.map(post => (
            <CommunityPostCard 
              key={post.post_id} post={post} isExpanded={!!expandedCards[`p-${post.post_id}`]} 
              onToggle={() => toggleCard(`p-${post.post_id}`)}
              onApprove={() => {}} 
              onReject={() => {}}  
            />
          ))}

          {activeTab === 'rescues' && filteredRescues.map(report => (
            <RescueReportCard 
              key={report.report_id} report={report} isExpanded={!!expandedCards[`r-${report.report_id}`]} 
              onToggle={() => toggleCard(`r-${report.report_id}`)} 
            />
          ))}
          
          {loading && <p>Loading data...</p>}
          {!loading && activeTab === 'community' && filteredPosts.length === 0 && <p>No community posts found.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;