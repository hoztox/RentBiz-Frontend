import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TenantsReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage keys for tenant timeline
    localStorage.removeItem("tenant_completedSteps");
    localStorage.removeItem("tenant_activeCard");
    // Navigate to /admin/tenants
    navigate("/admin/tenants", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};

export default TenantsReset;
