import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditTenantsReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage keys for edit tenant timeline
    localStorage.removeItem("edit_tenant_completedSteps");
    localStorage.removeItem("edit_tenant_activeCard");
    // Navigate to /admin/tenants
    navigate("/admin/tenants", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};

export default EditTenantsReset;
