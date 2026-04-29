import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api.js'; 
import '../../styles/community.css'; 
import Button from '../../components/Button.jsx';

function CommunityPostDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        // Using the central api instance
        const response = await api.get(`/community/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post details.');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <section className="report-details-wrapper">
        <div className="report-details-container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="report-details-wrapper">
        <div className="report-details-container">
          <p className="error-message">{error || 'Post not found.'}</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </section>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="report-details-wrapper">
      <div className="report-details-header">
        <h1>Adoption Post Submitted</h1>
        <p>Your community adoption post has been received and is currently pending approval by our administrators.</p>
      </div>

      <div className="report-details-container">
        <div className="report-details-card">
          <h3 className="report-details-title">Post Details</h3>

          <div className="report-details-grid">
            <div className="report-detail-item">
              <label className="report-detail-label">Pet Name</label>
              <p className="report-detail-value">{post.pet_name || 'N/A'}</p>
            </div>

            <div className="report-detail-item">
              <label className="report-detail-label">Gender</label>
              <p className="report-detail-value">{post.sex || 'N/A'}</p>
            </div>

            <div className="report-detail-item">
              <label className="report-detail-label">Animal Type</label>
              <p className="report-detail-value">{post.species_name || 'N/A'}</p>
            </div>

            <div className="report-detail-item">
              <label className="report-detail-label">Breed</label>
              <p className="report-detail-value">{post.breed || 'N/A'}</p>
            </div>

            <div className="report-detail-item">
              <label className="report-detail-label">Age</label>
              <p className="report-detail-value">{post.age || 'N/A'}</p>
            </div>

            <div className="report-detail-item">
              <label className="report-detail-label">Color</label>
              <p className="report-detail-value">{post.color || 'N/A'}</p>
            </div>
          </div>

          <div className="report-detail-item full-width">
            <label className="report-detail-label">Location</label>
            <p className="report-detail-value">{post.location || 'N/A'}</p>
          </div>

          <div className="report-detail-item full-width">
            <label className="report-detail-label">Description & Personality</label>
            <p className="report-detail-value condition" style={{ whiteSpace: 'pre-wrap' }}>
              {post.description || 'No description provided.'}
            </p>
          </div>

          <div className="report-detail-timestamp">
            <p>Submitted on: {formatDate(post.date_posted)}</p>
          </div>

          <div className="report-detail-actions">
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button onClick={() => window.print()}>
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunityPostDetailsPage;