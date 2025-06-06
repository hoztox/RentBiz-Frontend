import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import DocumentsView from "./DocumentsView";
import "./reviewpage.css";

const ReviewPage = ({ formData, onBack, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countryName, setCountryName] = useState("N/A");
  const [stateName, setStateName] = useState("N/A");
  const [docTypes, setDocTypes] = useState([]);

  // Extract building and documents data from formData
  const building = formData?.building || {};
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
    : [];

  // Debug formData structure
  console.log("ReviewPage formData:", formData);
  console.log("Documents:", documents);

  // Fetch document types
  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        const companyId = localStorage.getItem("company_id");
        const response = await axios.get(`${BASE_URL}/company/doc_type/company/${companyId}`);
        setDocTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching document types:", error);
        setError("Failed to load document types.");
      }
    };
    fetchDocTypes();
  }, []);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accounts/countries/`);
        setCountries(response.data);
        // Find country name
        const country = response.data.find(c => c.id === parseInt(building.country));
        setCountryName(country ? country.name : "N/A");
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load country data.");
      }
    };
    fetchCountries();
  }, [building.country]);

  // Fetch states when country ID is available
  useEffect(() => {
    if (building.country) {
      const fetchStates = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/accounts/countries/${building.country}/states/`
          );
          setStates(response.data);
          // Find state name
          const state = response.data.find(s => s.id === parseInt(building.state));
          setStateName(state ? state.name : "N/A");
        } catch (error) {
          console.error("Error fetching states:", error);
          setStates([]);
          setStateName("N/A");
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setStateName("N/A");
    }
  }, [building.country, building.state]);

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    // Validate building required fields
    const requiredFields = [
      "building_no",
      "plot_no",
      "building_name",
      "building_address",
      "company",
      "status",
    ];
    const missingFields = requiredFields.filter((field) => !building[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    // Validate documents based on doc_type properties
    const invalidDocs = documents.filter((doc) => {
      if (!doc.doc_type) return true; // Document must have a doc_type
      const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
      if (!docType) return true; // Invalid doc_type

      // Check only the fields required by the doc_type
      return (
        (docType.number && !doc.number) ||
        (docType.issue_date && !doc.issued_date) ||
        (docType.expiry_date && !doc.expiry_date) ||
        (docType.upload_file && !doc.upload_file?.length)
      );
    });

    if (documents.length > 0 && invalidDocs.length > 0) {
      setError("Some documents are missing required fields based on their document type.");
      setLoading(false);
      return;
    }

    try {
      // Helper function to handle empty values
      const getValueOrEmpty = (value) => {
        return value === null || value === undefined ? '' : value;
      };

      // Create FormData for multipart/form-data
      const formDataWithFiles = new FormData();
      // Add building fields with proper null handling
      formDataWithFiles.append('company', building.company);
      formDataWithFiles.append('building_name', building.building_name);
      formDataWithFiles.append('building_no', building.building_no);
      formDataWithFiles.append('plot_no', building.plot_no);
      formDataWithFiles.append('description', getValueOrEmpty(building.description));
      formDataWithFiles.append('remarks', getValueOrEmpty(building.remarks));
      formDataWithFiles.append('latitude', getValueOrEmpty(building.latitude));
      formDataWithFiles.append('longitude', getValueOrEmpty(building.longitude));
      formDataWithFiles.append('status', building.status);
      formDataWithFiles.append('land_mark', getValueOrEmpty(building.land_mark));
      formDataWithFiles.append('building_address', building.building_address);
      formDataWithFiles.append('country', getValueOrEmpty(building.country));
      formDataWithFiles.append('state', getValueOrEmpty(building.state));

      // Add documents data, including only required fields
      documents.forEach((doc, index) => {
        const docType = docTypes.find((type) => type.id === parseInt(doc.doc_type));
        if (docType) {
          formDataWithFiles.append(`build_comp[${index}][doc_type]`, doc.doc_type);
          if (docType.number) {
            formDataWithFiles.append(`build_comp[${index}][number]`, getValueOrEmpty(doc.number));
          }
          if (docType.issue_date) {
            formDataWithFiles.append(`build_comp[${index}][issued_date]`, getValueOrEmpty(doc.issued_date));
          }
          if (docType.expiry_date) {
            formDataWithFiles.append(`build_comp[${index}][expiry_date]`, getValueOrEmpty(doc.expiry_date));
          }
          if (docType.upload_file && doc.upload_file && doc.upload_file[0]) {
            formDataWithFiles.append(`build_comp[${index}][upload_file]`, doc.upload_file[0]);
          }
        }
      });

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (const [key, value] of formDataWithFiles.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Send POST request
      const response = await axios.post(
        `${BASE_URL}/company/buildings/create/`,
        formDataWithFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Successfully created building:", response.data);
      onNext({ formData, response: response.data }); // Proceed to SubmissionConfirmation
    } catch (err) {
      console.error("Error creating building:", err);
      setError(
        `Failed to save building: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const backData = {
      ...formData,
      documents: { documents },
    };
    console.log("ReviewPage passing back:", backData);
    onBack(backData);
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>
      )}
      <div className="border rounded-md border-[#E9E9E9] p-5 mb-5">
        <h2 className="review-page-head">Building</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8 border-r border-[#E9E9E9] max-[480px]:border-r-0">
            <div>
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">{building.building_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">{building.building_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Country*</p>
              <p className="review-page-data">{countryName}</p>
            </div>
            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{building.description || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Latitude</p>
              <p className="review-page-data">{building.latitude || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">
                {building.status
                  ? building.status.charAt(0).toUpperCase() + building.status.slice(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-8 sm:ml-5 max-[480px]:mt-8">
            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{building.plot_no || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{building.building_address || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">State*</p>
              <p className="review-page-data">{stateName}</p>
            </div>
            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{building.remarks || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Longitude</p>
              <p className="review-page-data">{building.longitude || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Near By Landmark</p>
              <p className="review-page-data">{building.land_mark || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Documents Section */}
      <div className="py-5">
        <h2 className="review-page-head">Documents</h2>
        <DocumentsView documents={documents} />
      </div>
      <div className="flex justify-end gap-4 pt-5 mt-auto">
        <button
          type="button"
          className="text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white back-button duration-200"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="button"
          className="bg-[#2892CE] text-white hover:bg-[#1f709e] next-button duration-200"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;