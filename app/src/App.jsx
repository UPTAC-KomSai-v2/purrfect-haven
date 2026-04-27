import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/LandingPage.jsx';
import Login from './pages/LoginPage.jsx';
import Signup from './pages/SignupPage.jsx';
import AdoptionList from './pages/AdoptionListPage.jsx';
import PetDetail from './pages/PetDetailPage.jsx';
import ReportRescue from './pages/ReportRescue.jsx'; //delete when done testing
import CommunityPage from './pages/CommunityPage.jsx'; //delete when done testing
import AdoptionFormPage from './pages/AdoptionFormPage.jsx';
import AccountSettingsPage from './pages/AccountSettingsPage.jsx';
import AdminPage from './pages/AdminPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          {/* Public routes — anyone can view */}
          <Route path="/"          element={<Landing />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/signup"    element={<Signup />} />
          <Route path="/pets"      element={<AdoptionList />} />
          <Route path="/pets/:id"  element={<PetDetail />} />
          <Route path="/report" element={<ReportRescue />} /> {/*delete when done testing*/}
          <Route path="/community" element={<CommunityPage />} /> {/*delete when done testing*/}
          <Route path="/adopt/:id" element={<AdoptionFormPage />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
         
          {/* Protected routes — only for logged-in users */}
          {/* Add back protected routes after testing */}
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;