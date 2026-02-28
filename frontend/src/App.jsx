import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FarmerRequestPage from './pages/FarmerRequestPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import DirectoryPage from './pages/DirectoryPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';

const App = () => {
  const { pathname } = useLocation();
  const showNavbar = pathname !== '/admin';
  const needsOffset = showNavbar && pathname !== '/';

  return (
    <div>
      {showNavbar && <Navbar />}

      <main className="main-container" style={{ marginTop: needsOffset ? '96px' : 0 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/request-worker" element={<FarmerRequestPage />} />
          <Route path="/worker-profile" element={<WorkerProfilePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
