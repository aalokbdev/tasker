import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import Cookies from "js-cookie";

// Define the props for the PrivateRoute component
interface PrivateRouteProps {
  children: ReactNode; // ReactNode allows passing JSX elements as children
  role: string;        // Role required to access the route
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user } = useAuth(); // Assuming useAuth provides user information
  const token = Cookies.get("token");

  // Check if the token and user role match the required role
  if (token && user?.role === role) {
    return <>{children}</>; // Render the children if conditions are met
  }

  // Redirect to the login page if unauthorized
  return <Navigate to="/" />;
};

export default PrivateRoute;
