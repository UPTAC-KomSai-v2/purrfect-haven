import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/LandingPage.jsx';
import Login from './pages/LoginPage.jsx';
import Signup from './pages/SignupPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>

          {/* Public routes */}
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/signup"   element={<Signup />} />
          {/*
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