import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Loading component (you can customize this)
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  
  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Only redirect if not loading and not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  
  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Only redirect if not loading and logged in
  if (isLoggedIn) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};