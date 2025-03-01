
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminIndex = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default AdminIndex;
