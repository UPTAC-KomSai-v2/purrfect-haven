import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import '../styles/navbar.css';
import favicon from '../assets/favicon.png';


export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // proceed with logout even if request fails
    } finally {
      logout();
      navigate('/');
    }
  }

  // Handle protected links - redirect to login if not authenticated
  const handleProtectedLink = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    } else {
      navigate(path);
    }
  };

 
  // Fix logo styling in styles
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={favicon} alt="Purrfect Haven Logo" />
      </Link>

      <div className="navbar-links">
        <Link to="/pets">Find a pet</Link>
        <Link to="/report" onClick={(e) => handleProtectedLink(e, '/report')}>
          Report a rescue
        </Link>
        <Link to="/community" onClick={(e) => handleProtectedLink(e, '/community')}>
          Community posts
        </Link>
      </div>

      {/* Changing view */}
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="navbar-profile">
              {user && `${user.first_name} ${user.last_name}`}
            </Link>
            <button
              onClick={handleLogout}
              className="navbar-logout"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="navbar-signup">
              Sign up
            </Link>
          </>
        )}

        {/* Add view when authenticated */}
      </div>

    </nav>
  );
}