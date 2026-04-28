import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// guard component — pinaglalagyan ng admin-only routes.
// kung hindi admin, ire-redirect sa home (or login kung wala pa nakaloin).
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // hintayin muna na matapos yung session check
  if (loading) {
    return (
      <div style={{
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'center',
        height:         '100vh',
        fontSize:       '14px',
        color:          'var(--color-text-secondary)',
      }}>
        Loading...
      </div>
    );
  }

  // hindi naka-login — balik sa login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // naka-login pero hindi admin — balik sa home
  if (user.is_admin !== 1) {
    return <Navigate to="/" replace />;
  }

  // i-render yung admin page
  return children;
}