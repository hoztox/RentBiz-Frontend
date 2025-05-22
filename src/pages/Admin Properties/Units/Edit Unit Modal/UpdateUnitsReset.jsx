import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdateUnitsReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage keys for update unit timeline
    localStorage.removeItem("updateUnit_completedSteps");
    localStorage.removeItem("updateUnit_activeCard");
    // Navigate to /admin/units
    navigate("/admin/units", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};

export default UpdateUnitsReset;
