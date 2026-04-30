import { useState, useEffect, useMemo } from 'react';
import * as AdoptionsService from '../services/adoptionsService.js';
import * as StoriesService from '../services/storiesService.js';
import api from '../services/api.js'; 
import RescueReportCard from "./admin/RescueReportCard.jsx";
import CommunityPostCard from "./admin/CommunityPostCard.jsx";

import '../styles/admin.css';

const SAMPLE_COMMUNITY_POSTS = [{
  post_id: 1,
  status: 'pending',
  pet_name: '3 Kittens',
  description: "Found 3 kittens behind SM Tacloban.",
  species_name: 'Cat',
  location: 'Downtown Tacloban',
  poster: { full_name: 'Maria Santos', email: 'maria.santos@email.com', cell_num: '0917-555-0202', address: 'Downtown Tacloban' },
  date_posted: 'March 26, 2026',
  photos: ['https://placehold.co/200x200?text=Kitten+1'],
}];

function AdminPage() {
  const [activeTab, setActiveTab] = useState('adoptions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  
  const [adoptions, setAdoptions] = useState([]);
  const [posts, setPosts] = useState(SAMPLE_COMMUNITY_POSTS);
  const [rescues, setRescues] = useState([]);
  const [stories, setStories] = useState([]);
  
  const [adoptionsLoading, setAdoptionsLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(false);

  useEffect(() => { 
    const loadInitialData = async () => {
      try {
        const [ads, res] = await Promise.all([
          AdoptionsService.getAllAdoptions(),
          api.get('/rescue')
        ]);
        setAdoptions(ads);
        setRescues(res.data.reports || []);
      } catch (err) { console.error(err); }
      finally { setAdoptionsLoading(false); }
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
              onApprove={() => setPosts(p => p.map(x => x.post_id === post.post_id ? {...x, status: 'approved'} : x))}
              onReject={() => setPosts(p => p.map(x => x.post_id === post.post_id ? {...x, status: 'rejected'} : x))}
            />
          ))}

          {activeTab === 'rescues' && filteredRescues.map(report => (
            <RescueReportCard 
              key={report.report_id} report={report} isExpanded={!!expandedCards[`r-${report.report_id}`]} 
              onToggle={() => toggleCard(`r-${report.report_id}`)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;