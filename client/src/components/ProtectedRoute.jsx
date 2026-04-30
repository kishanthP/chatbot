import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While Firebase resolves the persisted session, show a full-screen spinner
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#121212",
        }}
      >
        <CircularProgress sx={{ color: "#d4956a" }} />
      </Box>
    );
  }

  // Not authenticated → send to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
