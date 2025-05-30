import React, { useState, useEffect } from "react";
import "./buildinginfoform.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";

const ResponsiveUpdateBuildingInfoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buildingId = location.state?.buildingId;

  const [formState, setFormState] = useState({
    building_no: "",
    plot_no: "",
    building_name: "",
    building_address: "",
    description: "",
    remarks: "",
    status: "active",
    latitude: "",
    longitude: "",
    land_mark: "",
    company: localStorage.getItem("company_id") || "",
    user: localStorage.getItem("user_id") || null,
  });
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize form with localStorage data if available
  useEffect(() => {
    const storedFormData = JSON.parse(localStorage.getItem("update_building_formData"));
    if (storedFormData?.building) {
      setFormState((prev) => ({
        ...prev,
        ...storedFormData.building,
      }));
    }
  }, []);

  // Fetch building data on mount and autofill form
  useEffect(() => {
    const fetchBuildingData = async () => {
      if (!buildingId) {
        console.log("No buildingId provided, skipping fetch");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/company/buildings/${buildingId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const buildingData = response.data;
        console.log("ResponsiveUpdateBuildingInfoForm: Fetched building data:", buildingData);

        // Update formState with fetched data
        const updatedFormState = {
          building_no: buildingData.building_no || "",
          plot_no: buildingData.plot_no || "",
          building_name: buildingData.building_name || "",
          building_address: buildingData.building_address || "",
          description: buildingData.description || "",
          remarks: buildingData.remarks || "",
          status: buildingData.status || "active",
          latitude: buildingData.latitude !== null ? buildingData.latitude.toString() : "",
          longitude: buildingData.longitude !== null ? buildingData.longitude.toString() : "",
          land_mark: buildingData.land_mark || "",
          company: buildingData.company || localStorage.getItem("company_id") || "",
          user: buildingData.user || localStorage.getItem("user_id") || null,
        };

        setFormState(updatedFormState);

        // Store fetched data in localStorage for persistence
        localStorage.setItem(
          "update_building_formData",
          JSON.stringify({
            building: updatedFormState,
            documents: {
              documents: Array.isArray(buildingData.build_comp)
                ? buildingData.build_comp.map((doc, index) => ({
                    id: index + 1,
                    doc_type: doc.doc_type || "",
                    number: doc.number || "",
                    issued_date: doc.issued_date || "",
                    expiry_date: doc.expiry_date || "",
                    upload_file: doc.upload_file ? [doc.upload_file] : [],
                  }))
                : [],
            },
          })
        );

        setLoading(false);
      } catch (err) {
        console.error("Error fetching building data:", err);
        setError("Failed to load building data.");
        setLoading(false);
      }
    };
    fetchBuildingData();
  }, [buildingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    if (name === "status") {
      setIsSelectFocused(false);
    }
  };

  const handleNumberStep = (name, step) => {
    const currentValue = parseFloat(formState[name]) || 0;
    setFormState({
      ...formState,
      [name]: (currentValue + step).toString(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "building_no",
      "plot_no",
      "building_name",
      "building_address",
      "status",
    ];
    const errors = requiredFields
      .filter((field) => !formState[field])
      .map((field) => `${field.replace("_", " ")} is required`);
    if (!buildingId) {
      errors.push("Building ID is required.");
    }
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    // Update formData in localStorage
    const existingFormData = JSON.parse(localStorage.getItem("update_building_formData")) || {
      building: {},
      documents: { documents: [] },
    };
    localStorage.setItem(
      "update_building_formData",
      JSON.stringify({
        ...existingFormData,
        building: formState,
      })
    );

    // Update completedSteps and activeCard
    const completedSteps = [1];
    console.log("Setting update_building_completedSteps:", completedSteps);
    console.log("Setting update_building_activeCard: 2");
    localStorage.setItem("update_building_completedSteps", JSON.stringify(completedSteps));
    localStorage.setItem("update_building_activeCard", "2");

    // Navigate to document form with formData
    navigate("/admin/update-building-upload-documents", {
      state: { buildingId, formData: { building: formState, documents: existingFormData.documents } },
    });
  };

  if (loading) {
    return <div className="p-4">Loading building data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 building-info-form-container"
    >
      <div className="grid grid-cols-1 gap-5">
        <div className="col-span-1">
          <label className="block building-info-form-label">Building No*</label>
          <input
            type="text"
            name="building_no"
            value={formState.building_no}
            onChange={handleInputChange}
            placeholder="1"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Plot No*</label>
          <input
            type="text"
            name="plot_no"
            value={formState.plot_no}
            onChange={handleInputChange}
            placeholder="1"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Building Name*</label>
          <input
            type="text"
            name="building_name"
            value={formState.building_name}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Address*</label>
          <textarea
            name="building_address"
            value={formState.building_address}
            onChange={handleInputChange}
            placeholder="Boulevard Downtown Dubai, PO Box 111969 Dubai, UAE"
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi orci ante, scelerisque"
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Remarks</label>
          <input
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Status*</label>
          <div className="relative">
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              className="w-full appearance-none building-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
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

        <div className="col-span-1">
          <label className="block building-info-form-label">Latitude</label>
          <div className="relative">
            <input
              type="number"
              name="latitude"
              value={formState.latitude}
              onChange={handleInputChange}
              placeholder="0.0000"
              step="0.0001"
              className="w-full building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
            />
            <div className="absolute right-0 top-[-8px] inset-y-0 flex flex-col justify-center pr-2">
              <button
                type="button"
                className="flex items-center justify-center h-4 text-[#201D1E]"
                onClick={() => handleNumberStep("latitude", 0.0001)}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center h-0 text-[#201D1E]"
                onClick={() => handleNumberStep("latitude", -0.0001)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Longitude</label>
          <div className="relative">
            <input
              type="number"
              name="longitude"
              value={formState.longitude}
              onChange={handleInputChange}
              placeholder="0.0000"
              step="0.0001"
              className="w-full building-info-form-inputs focus:border-gray-300 duration-200 pr-8"
            />
            <div className="absolute right-0 top-[-8px] inset-y-0 flex flex-col justify-center pr-2">
              <button
                type="button"
                className="flex items-center justify-center h-4 text-[#201D1E]"
                onClick={() => handleNumberStep("longitude", 0.0001)}
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center h-0 text-[#201D1E]"
                onClick={() => handleNumberStep("longitude", -0.0001)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block building-info-form-label">Near By Landmark</label>
          <input
            type="text"
            name="land_mark"
            value={formState.land_mark}
            onChange={handleInputChange}
            placeholder="Lorem ipsum dolor"
            className="w-full building-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
      </div>

      <div className="next-btn-container mt-6 text-right mb-[80px]">
        <button type="submit" className="next-btn duration-300">
          Next
        </button>
      </div>
    </form>
  );
};

export default ResponsiveUpdateBuildingInfoForm;