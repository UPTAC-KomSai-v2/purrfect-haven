import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/LandingPage.jsx';
import Login from './pages/LoginPage.jsx';
import Signup from './pages/SignupPage.jsx';
import AdoptionList from './pages/AdoptionListPage.jsx';
import PetDetail from './pages/PetDetailPage.jsx';

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

          {/* Protected routes — only for logged-in users */}
          <Route path="/profile" element={
            <ProtectedRoute>
              {/* <ProfilePage /> */}
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              {/* <RescueReportPage /> */}
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;