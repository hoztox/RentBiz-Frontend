import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BuildingsReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage keys for building timeline
    localStorage.removeItem("building_completedSteps");
    localStorage.removeItem("building_activeCard");
    // Navigate to /admin/buildings
    navigate("/admin/buildings", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};

export default BuildingsReset;