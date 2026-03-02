import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FarmerRequestPage from './pages/FarmerRequestPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import DirectoryPage from './pages/DirectoryPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLayout from './pages/AdminLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminFaqsPage from './pages/AdminFaqsPage';
import AdminMessagesPage from './pages/AdminMessagesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';

const App = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const showNavbar = !isAdminRoute;
  const showFooter = !isAdminRoute;
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="faqs" element={<AdminFaqsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {showFooter ? <Footer /> : null}
      <FloatingWhatsAppButton />
    </div>
  );
};

export default App;
