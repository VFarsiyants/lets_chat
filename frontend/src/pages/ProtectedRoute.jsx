import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/login");
    },
    [isAuthenticated, navigate]
  );

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
