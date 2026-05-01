import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/LandingPage.jsx';
import Login from './pages/auth/LoginPage.jsx';
import Signup from './pages/auth/SignupPage.jsx';
import AdoptionList from './pages/pets/AdoptionListPage.jsx';
import PetDetail from './pages/pets/PetDetailPage.jsx';
import RequestRescue from './pages/rescue/RequestRescue.jsx'; //delete when done testing
import RequestDetailsPage from './pages/rescue/RequestDetailsPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx'; //delete when done testing
import AdoptionFormPage from './pages/pets/AdoptionFormPage.jsx';
import AccountSettingsPage from './pages/profile/AccountSettingsPage.jsx';
import AdminPage from './pages/AdminPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx';
import AdminRoute from './components/AdminRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          {/* Public routes — anyone can view */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pets" element={<AdoptionList />} />
          <Route path="/pets/:id"  element={<PetDetail />} />
          <Route path="/rescue" element={<RequestRescue />} /> {/*delete when done testing*/}
          <Route path="/rescue/:reportId" element={<RequestDetailsPage />} />
          <Route path="/community" element={<CommunityPage />} /> {/*delete when done testing*/}
          {/*<Route path="/community/:postId" element={<CommunityDetailsPage />} /> delete when done testing*/}
          <Route path="/adopt/:id" element={<AdoptionFormPage />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } 
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<AccountSettingsPage />} />
         
          {/* Protected routes — only for logged-in users */}
          {/* Add back protected routes after testing */}
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;