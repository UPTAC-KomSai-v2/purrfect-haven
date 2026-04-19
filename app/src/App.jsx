import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute   from './components/ProtectedRoute.jsx';
import Navbar           from './components/Navbar.jsx';
import LandingPage      from './pages/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>

          {/* Public routes */}
          <Route path="/"         element={<LandingPage />} />
          {/*
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/signup"   element={<SignupPage />} />
          <Route path="/pets"     element={<PetsPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/adopted"  element={<AdoptedPetsPage />} />
          */}

          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              {/*<ProfilePage />*/}
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              {/*<ProfilePage />*/}
            </ProtectedRoute>
          } />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;