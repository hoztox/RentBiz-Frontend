import React, { useState, useEffect } from "react";
import "./buildinginfoform.css";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import PropTypes from "prop-types"; // Added PropTypes import
import { BASE_URL } from "../../../../../utils/config";

const BuildingInfoForm = ({ onNext, initialData, unitId }) => {
  const [formState, setFormState] = useState(
    initialData || {
      buildingId: "",
      building_name: "",
      description: "",
      building_address: "",
      building_no: "",
      plot_no: "",
    }
  );
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");
    return role === "company" || role === "user" || role === "admin" ? storedCompanyId : null;
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      try {
        const companyId = getUserCompanyId();
        if (!companyId) throw new Error("Company ID not found.");
        const response = await axios.get(`${BASE_URL}/company/buildings/company/${companyId}`);
        setBuildings(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        setError("Failed to load buildings. Please try again.");
        setBuildings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      if (!formState.buildingId) {
        setFormState((prev) => ({
          ...prev,
          building_name: "",
          description: "",
          building_address: "",
          building_no: "",
          plot_no: "",
        }));
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/company/buildings/${formState.buildingId}`);
        const building = response.data;
        setFormState((prev) => ({
          ...prev,
          building_name: building.building_name || "",
          description: building.description || "",
          building_address: building.building_address || "",
          building_no: building.building_no || "",
          plot_no: building.plot_no || "",
        }));
        setError(null);
      } catch (error) {
        console.error("Error fetching building details:", error);
        setError("Failed to load building details.");
        setFormState((prev) => ({
          ...prev,
          building_name: "",
          description: "",
          building_address: "",
          building_no: "",
          plot_no: "",
        }));
      } finally {
        setLoading(false);
      }
    };
    fetchBuildingDetails();
  }, [formState.buildingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "buildingId") {
      setIsSelectFocused(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["buildingId", "building_name", "description", "building_address", "building_no", "plot_no"];
    const missingFields = requiredFields.filter((field) => !formState[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      return;
    }
    if (!unitId) {
      setError("Unit ID is required.");
      return;
    }

    const tempData = {
      unitId, // Include unitId in tempData
      buildingId: formState.buildingId,
      building_name: formState.building_name,
      description: formState.description,
      building_address: formState.building_address,
      building_no: formState.building_no,
      plot_no: formState.plot_no,
    };
    console.log("Temporarily saved building data:", tempData);
    onNext(tempData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-1">
          <label className="block building-info-form-label">Building Name*</label>
          <div className="relative">
            <select
              name="buildingId"
              value={formState.buildingId}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
              disabled={loading}
            >
              <option value="">Select Building</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.building_name}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${isSelectFocused ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block building-info-form-label">Description*</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Enter building description"
            className="w-full building-info-form-inputs focus:border-gray-300 resize-none duration-200 cursor-not-allowed"
            required
            disabled={loading}
            readOnly
          />
        </div>
        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            name="building_address"
            value={formState.building_address}
            onChange={handleInputChange}
            placeholder="Enter building address"
            className="w-full building-info-form-inputs focus:border-gray-300 resize-none duration-200 cursor-not-allowed"
            required
            disabled={loading}
            readOnly
          />
        </div>
        <div className="col-span-1">
          <label className="block building-info-form-label">Building No*</label>
          <input
            type="text"
            name="building_no"
            value={formState.building_no}
            onChange={handleInputChange}
            placeholder="Enter building number"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200 cursor-not-allowed"
            required
            disabled={loading}
            readOnly
          />
        </div>
        <div className="col-span-1">
          <label className="block building-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plot_no"
            value={formState.plot_no}
            onChange={handleInputChange}
            placeholder="Enter plot number"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200 cursor-not-allowed"
            required
            disabled={loading}
            readOnly
          />
        </div>
        <div className="next-btn-container mt-[29px] col-span-1 text-right">
          <button
            type="submit"
            className="w-[150px] h-[38px] next-btn duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

// Added PropTypes for consistency with the second form
BuildingInfoForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
};

export default BuildingInfoForm;