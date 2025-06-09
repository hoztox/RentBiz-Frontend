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
  
  console.log('ProtectedRoute - isLoading:', isLoading, 'isLoggedIn:', isLoggedIn);
  
  // Show loading while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute - Showing loading spinner');
    return <LoadingSpinner />;
  }
  
  // Only redirect if not loading and not logged in
  if (!isLoggedIn) {
    console.log('ProtectedRoute - User not logged in, redirecting to login');
    return <Navigate to="/" replace />;
  }
  
  console.log('ProtectedRoute - User is logged in, showing protected content');
  return children;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  console.log('PublicRoute - isLoading:', isLoading, 'isLoggedIn:', isLoggedIn);
  
  // Show loading while checking authentication
  if (isLoading) {
    console.log('PublicRoute - Showing loading spinner');
    return <LoadingSpinner />;
  }
  
  // Only redirect if not loading and logged in
  if (isLoggedIn) {
    console.log('PublicRoute - User is logged in, redirecting to dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  console.log('PublicRoute - User not logged in, showing public content');
  return children;
};