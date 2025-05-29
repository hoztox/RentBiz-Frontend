import { useState, useEffect } from 'react';
import "./tenantinfoform.css";
import PhoneInput from 'react-phone-input-2';
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";
import PropTypes from "prop-types";

const TenantInfoForm = ({ onNext, initialData, tenantId }) => {
  const [formState, setFormState] = useState({
    tenant_name: "",
    nationality: "",
    phone: "",
    alternative_phone: "",
    email: "",
    description: "",
    address: "",
    tenant_type: "",
    license_no: "",
    id_type: "",
    id_number: "",
    id_validity_date: "",
    sponser_name: "",
    sponser_id_type: "",
    sponser_id_number: "",
    sponser_id_validity_date: "",
    status: "Active",
    remarks: "",
    company: localStorage.getItem("company_id") || "",
    user: localStorage.getItem("user_id") || null,
  });
  const [mobno, setMobno] = useState("");
  const [altMobno, setAltMobno] = useState("");
  const [idTypes, setIdTypes] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const companyId = localStorage.getItem("company_id");
        const response = await axios.get(
          `${BASE_URL}/company/id_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIdTypes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching ID types:", error);
        setError("Failed to load ID types.");
      }
    };
    fetchIdTypes();
  }, []);

  useEffect(() => {
  if (initialData) {
    console.log("Initial Data:", initialData); 
    setFormState({
      tenant_name: initialData.tenant_name || "",
      nationality: initialData.nationality || "",
      phone: initialData.phone || "",
      alternative_phone: initialData.alternative_phone || "",
      email: initialData.email || "",
      description: initialData.description || "",
      address: initialData.address || "",
      tenant_type: initialData.tenant_type || "",
      license_no: initialData.license_no || "",
      // CHANGED: Use the ID number, not the title string
      id_type: initialData.id_type?.id || "",
      id_number: initialData.id_number || "",
      id_validity_date: initialData.id_validity_date || "",
      sponser_name: initialData.sponser_name || "",
      // CHANGED: Use the ID number, not the title string  
      sponser_id_type: initialData.sponser_id_type?.id || "",
      sponser_id_number: initialData.sponser_id_number || "",
      sponser_id_validity_date: initialData.sponser_id_validity_date || "",
      status: initialData.status || "Active",
      remarks: initialData.remarks || "",
      company: initialData.company || localStorage.getItem("company_id") || "",
      user: initialData.user || localStorage.getItem("user_id") || null,
    });
    setMobno(initialData.phone || "");
    setAltMobno(initialData.alternative_phone || "");
  }
}, [initialData]);

  const handleChange = (value, field) => {
    if (field === "phone") {
      setMobno(value);
      setFormState({ ...formState, phone: value });
    } else if (field === "alternative_phone") {
      setAltMobno(value);
      setFormState({ ...formState, alternative_phone: value });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSelectFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleSelectBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const requiredFields = [
      "tenant_name",
      "nationality",
      "phone",
      "alternative_phone",
      "email",
      "address",
      "tenant_type",
      "license_no",
      "id_type",
      "id_number",
      "id_validity_date",
      "sponser_name",
      "sponser_id_type",
      "sponser_id_number",
      "sponser_id_validity_date",
      "status",
    ];
    requiredFields.forEach((field) => {
      if (!formState[field]) {
        errors[field] = `${field.replace("_", " ")} is required`;
      }
    });
    if (!tenantId) {
      errors.tenantId = "Tenant ID is required.";
    }
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(", "));
      return;
    }
    const tempData = {
      tenant_id: tenantId,
      ...formState,
      id_type: parseInt(formState.id_type) || null,
      sponser_id_type: parseInt(formState.sponser_id_type) || null,
    };
    onNext(tempData);
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Name*</label>
          <input
            type="text"
            name="tenant_name"
            value={formState.tenant_name}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Nationality*</label>
          <div className="relative">
            <select
              name="nationality"
              value={formState.nationality}
              onChange={handleInputChange}
              onFocus={() => handleSelectFocus("nationality")}
              onBlur={handleSelectBlur}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Choose</option>
              <option value="UAE">UAE</option>
              <option value="India">India</option>
              {/* Add more nationalities as needed */}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  focusedField === "nationality" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Mobile Number*</label>
          <PhoneInput
            country={"ae"}
            name="phone"
            value={mobno}
            onChange={(value) => handleChange(value, "phone")}
            inputProps={{ required: true }}
            containerClass="phone-input-container"
            inputClass="tenant-info-form-inputs phone-input"
            buttonClass="phone-input-button"
            dropdownClass="phone-input-dropdown"
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Alternative Mobile Number*</label>
          <PhoneInput
            country={"ae"}
            name="alternative_phone"
            value={altMobno}
            onChange={(value) => handleChange(value, "alternative_phone")}
            inputProps={{ required: true }}
            containerClass="phone-input-container"
            inputClass="tenant-info-form-inputs phone-input"
            buttonClass="phone-input-button"
            dropdownClass="phone-input-dropdown"
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Email*</label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div></div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            rows="2"
            className="w-full tenant-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Address*</label>
          <textarea
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs resize-none focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Tenant Type*</label>
          <div className="relative">
            <select
              name="tenant_type"
              value={formState.tenant_type}
              onChange={handleInputChange}
              onFocus={() => handleSelectFocus("tenant_type")}
              onBlur={handleSelectBlur}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Choose</option>
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  focusedField === "tenant_type" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Trade License Number*</label>
          <input
            type="text"
            name="license_no"
            value={formState.license_no}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Type*</label>
          <div className="relative">
            <select
              name="id_type"
              value={formState.id_type}
              onChange={handleInputChange}
              onFocus={() => handleSelectFocus("id_type")}
              onBlur={handleSelectBlur}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Choose</option>
              {idTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  focusedField === "id_type" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Number*</label>
          <input
            type="text"
            name="id_number"
            value={formState.id_number}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Validity*</label>
          <input
            type="date"
            name="id_validity_date"
            value={formState.id_validity_date}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div></div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor Name*</label>
          <input
            type="text"
            name="sponser_name"
            value={formState.sponser_name}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor ID Type*</label>
          <div className="relative">
            <select
              name="sponser_id_type"
              value={formState.sponser_id_type}
              onChange={handleInputChange}
              onFocus={() => handleSelectFocus("sponser_id_type")}
              onBlur={handleSelectBlur}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Choose</option>
              {idTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  focusedField === "sponser_id_type" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor ID Number*</label>
          <input
            type="text"
            name="sponser_id_number"
            value={formState.sponser_id_number}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor ID Validity*</label>
          <input
            type="date"
            name="sponser_id_validity_date"
            value={formState.sponser_id_validity_date}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Status*</label>
          <div className="relative">
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              onFocus={() => handleSelectFocus("status")}
              onBlur={handleSelectBlur}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  focusedField === "status" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
      </div>
      <div className="next-btn-container mt-6 text-right">
        <button
          type="submit"
          className="w-[150px] h-[38px] next-btn duration-300"
        >
          Next
        </button>
      </div>
    </form>
  );
};

TenantInfoForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  tenantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TenantInfoForm;