import React, { useState, useEffect, useRef } from "react";
import "./buildinginfo.css";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";

const BuildingInfoForm = ({ onNext, initialData }) => {
  // Form state initialized with initialData or default values
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

  // State for buildings list, loading, error, and pagination
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef(null);
  const lastOptionRef = useRef(null);

  // Get company ID from localStorage
  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      try {
        const userCompanyId = localStorage.getItem("company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  // Fetch buildings (initial load or subsequent pages)
  const fetchBuildings = async (url = null) => {
    setLoading(true);
    setIsFetchingMore(!!url); // Set isFetchingMore to true if fetching next page
    try {
      const companyId = getUserCompanyId();
      if (!companyId && !url) {
        throw new Error("Company ID not found.");
      }
      const apiUrl =
        url || `${BASE_URL}/company/buildings/company/${companyId}`;
      const response = await axios.get(apiUrl);
      const newBuildings = Array.isArray(response.data.results)
        ? response.data.results
        : [];
      setBuildings((prev) => (url ? [...prev, ...newBuildings] : newBuildings));
      setNextPageUrl(response.data.next);
      setError(null);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setError("Failed to load buildings. Please try again.");
      if (!url) setBuildings([]);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBuildings();
  }, []);

  // Fetch building details when buildingId changes
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
        const response = await axios.get(
          `${BASE_URL}/company/buildings/${formState.buildingId}`
        );
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

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!lastOptionRef.current || !nextPageUrl || isFetchingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageUrl) {
          fetchBuildings(nextPageUrl);
        }
      },
      { threshold: 0.1 }
    );

    if (lastOptionRef.current) {
      observerRef.current.observe(lastOptionRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [nextPageUrl, isFetchingMore, buildings]);

  // Handle input changes
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "buildingId",
      "building_name",
      "building_address",
      "building_no",
      "plot_no",
    ];
    const missingFields = requiredFields.filter((field) => !formState[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      return;
    }

    const tempData = {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Building Name */}
        <div className="col-span-1">
          <label className="block building-info-form-label">
            Building Name*
          </label>
          <div className="relative">
            <select
              name="buildingId"
              value={formState.buildingId}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              style={{ maxHeight: "200px", overflowY: "auto" }}
              required
              disabled={loading}
            >
              <option value="">Select Building</option>
              {buildings.map((building, index) => (
                <option
                  key={building.id}
                  value={building.id}
                  ref={index === buildings.length - 1 ? lastOptionRef : null}
                >
                  {building.building_name}
                </option>
              ))}
              {isFetchingMore && <option disabled>Loading more...</option>}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  isSelectFocused ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-1">
          <label className="block building-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Enter building description"
            className="w-full building-info-form-inputs focus:border-gray-300 resize-none duration-200 cursor-not-allowed"
            disabled={loading}
            readOnly
          />
        </div>

        {/* Address */}
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

        {/* Building No */}
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

        {/* Plot No. */}
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

        {/* Submit Button */}
        <div className="next-btn-container mt-[29px] col-span-1 text-right">
          <button
            type="submit"
            className="w-[150px] h-[38px] next-btn duration-300"
            disabled={loading || isFetchingMore}
          >
            {loading || isFetchingMore ? "Loading..." : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BuildingInfoForm;
