import react from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>;        // wait for auth check
  if (!user)   return <Navigate to="/login" replace />; // then redirect if no user
  
  return children;
};

export default ProtectedRoute;
