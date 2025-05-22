import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UnitsResets = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage keys for unit timeline
    localStorage.removeItem("unit_completedSteps");
    localStorage.removeItem("unit_activeCard");
    // Navigate to /admin/units
    navigate("/admin/units", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};
export default UnitsResets;
