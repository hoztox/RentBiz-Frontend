import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BuildingsReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('completedSteps');
    localStorage.removeItem('activeCard');
    // Navigate to /admin/buildings
    navigate("/admin/buildings", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};

export default BuildingsReset;