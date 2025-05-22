import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const UpdateBuildingsReset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage keys for building update timeline
    localStorage.removeItem("update_building_completedSteps");
    localStorage.removeItem("update_building_activeCard");
    // Clear legacy keys from previous implementations
    localStorage.removeItem("completedSteps");
    localStorage.removeItem("activeCard");
    // Navigate to /admin/buildings
    navigate("/admin/buildings", { replace: true });
  }, [navigate]);

  // Render nothing (invisible to users)
  return null;
};

export default UpdateBuildingsReset