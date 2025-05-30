import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../../utils/config";
import DocumentsView from "./DocumentsView";
import "./review.css";

const UnitReview = ({ formData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buildings, setBuildings] = useState([]);

  const building = formData?.building || {};
  const unit = formData?.unit || {};
  const documents = Array.isArray(formData?.documents?.documents)
    ? formData.documents.documents
    : [];

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");

    console.log("Role:", role);
    console.log("Raw company_id from localStorage:", storedCompanyId);

    if (role === "company") {
      return storedCompanyId;
    } else if (role === "user" || role === "admin") {
      return storedCompanyId;
    }

    return null;
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const companyId = getUserCompanyId();
        const response = await axios.get(
          `${BASE_URL}/company/buildings/company/${companyId}`
        );
        setBuildings(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    fetchBuildings();
  }, []);

  const getBuildingName = (buildingId) => {
    if (!buildingId) return "N/A";
    const building = buildings.find((b) => b.id === parseInt(buildingId));
    return building ? building.building_name : "N/A";
  };

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    const requiredFields = [
      "unit_name",
      "unit_type",
      "address",
      "premise_no",
      "unit_status",
    ];
    const missingFields = requiredFields.filter((field) => !unit[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }
    if (documents.length > 0) {
      const invalidDocs = documents.filter(
        (doc) =>
          !doc.doc_type ||
          !doc.number ||
          !doc.issued_date ||
          !doc.expiry_date ||
          !doc.upload_file?.length
      );
      if (invalidDocs.length > 0) {
        setError(
          "All documents must have doc_type, number, dates, and at least one file."
        );
        setLoading(false);
        return;
      }
    }
    try {
      const formDataWithFiles = new FormData();
      formDataWithFiles.append("company", parseInt(getUserCompanyId()));
      formDataWithFiles.append("building", parseInt(building.buildingId) || "");
      formDataWithFiles.append("address", unit.address || "");
      formDataWithFiles.append("unit_name", unit.unit_name || "");
      formDataWithFiles.append("unit_type", parseInt(unit.unit_type) || "");
      formDataWithFiles.append("description", unit.description || "");
      formDataWithFiles.append("remarks", unit.remarks || "");
      formDataWithFiles.append(
        "no_of_bedrooms",
        parseInt(unit.no_of_bedrooms) || 0
      );
      formDataWithFiles.append(
        "no_of_bathrooms",
        parseInt(unit.no_of_bathrooms) || 0
      );
      formDataWithFiles.append("premise_no", unit.premise_no || "");
      formDataWithFiles.append("unit_status", unit.unit_status || "");
      const unitCompData = documents.map((doc, index) => ({
        doc_type: parseInt(doc.doc_type),
        number: doc.number || "",
        issued_date: doc.issued_date || "",
        expiry_date: doc.expiry_date || "",
        file_index: index,
      }));
      formDataWithFiles.append("unit_comp_json", JSON.stringify(unitCompData));
      documents.forEach((doc, index) => {
        if (doc.upload_file && doc.upload_file[0]) {
          formDataWithFiles.append(
            `document_file_${index}`,
            doc.upload_file[0]
          );
        }
      });
      console.log("FormData contents:");
      for (const [key, value] of formDataWithFiles.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await axios.post(
        `${BASE_URL}/company/units/create/`,
        formDataWithFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Successfully created unit:", response.data);
      onNext({ formData, response: response.data });
    } catch (err) {
      console.error("Error creating unit:", err);
      setError(
        `Failed to save unit: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const backData = {
      building,
      unit,
      documents: { documents },
    };
    console.log("UnitReview passing back:", backData);
    onBack(backData);
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <p className="text-red-500 mb-4 p-2 bg-red-100 rounded">{error}</p>
      )}
      <div className="border rounded-md border-[#E9E9E9] p-5">
        <h2 className="review-page-head">Building</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Building Name*</p>
              <p className="review-page-data">
                {building.building_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Description*</p>
              <p className="review-page-data">
                {building.description || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Building No*</p>
              <p className="review-page-data">
                {building.building_no || "N/A"}
              </p>
            </div>
          </div>
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">
                {building.building_address || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Plot No*</p>
              <p className="review-page-data">{building.plot_no || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-md border-[#E9E9E9] p-5 mt-[25px]">
        <h2 className="review-page-head">Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-8 border-r border-[#E9E9E9]">
            <div>
              <p className="review-page-label">Unit Name*</p>
              <p className="review-page-data">{unit.unit_name || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Unit Type*</p>
              <p className="review-page-data">{unit.unit_type || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Bedrooms</p>
              <p className="review-page-data">{unit.no_of_bedrooms || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Description</p>
              <p className="review-page-data">{unit.description || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Premise Number*</p>
              <p className="review-page-data">{unit.premise_no || "N/A"}</p>
            </div>
          </div>
          <div className="space-y-8 ml-5">
            <div>
              <p className="review-page-label">Address*</p>
              <p className="review-page-data">{unit.address || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Bathrooms</p>
              <p className="review-page-data">
                {unit.no_of_bathrooms || "N/A"}
              </p>
            </div>
            <div>
              <p className="review-page-label">Remarks</p>
              <p className="review-page-data">{unit.remarks || "N/A"}</p>
            </div>
            <div>
              <p className="review-page-label">Status*</p>
              <p className="review-page-data">
                {unit.unit_status
                  ? unit.unit_status.charAt(0).toUpperCase() +
                    unit.unit_status.slice(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5">
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

export default UnitReview;
