import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAuth();
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" />;
  return children;
};

export default ProtectedRoute;
