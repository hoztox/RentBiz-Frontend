import { useState } from "react";
import './tenantinfoform.css'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResUpdateTenantInfoForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    nationality: "",
    mobno: "",
    alternative_mobno: "",
    email: "",
    description: "",
    address: "",
    tenant_type: "",
    license_no: "",
    id_type: "",
    id_no: "",
    id_validity: "",
    sponsor_name: "",
    sponsor_id_type: "",
    sponsor_id_no: "",
    sponsor_id_validity: "",
    status: "Active",
    remarks: "",
  });

  const navigate = useNavigate();

  const [mobno, setMobno] = useState("");
  const [altMobno, setAltMobno] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (value) => {
    setMobno(value);
    setFormState({
      ...formState,
      mobno: value,
    });
  };

  const handleAltChange = (value) => {
    setAltMobno(value);
    setFormState({
      ...formState,
      alternative_mobno: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSelectFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleSelectBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    // Save completion state and active card in localStorage with unique keys
    localStorage.setItem("edit_tenant_completedSteps", JSON.stringify([1])); // Mark "Edit Tenant Details" (id: 1) as completed
    localStorage.setItem("edit_tenant_activeCard", "2"); // Set "Update Documents" (id: 2) as active
    navigate("/admin/edit-tenant-timeline");
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 tenant-info-form-container">
      <div className="grid grid-cols-1 gap-5">
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Name*</label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="John Doe"
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
              <option value="USA">USA</option>
              {/* Add more options as needed */}
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
            name="mobno"
            value={mobno}
            onChange={handleChange}
            inputProps={{
              required: true,
            }}
            containerClass="phone-input-container"
            inputClass="tenant-info-form-inputs phone-input"
            buttonClass="phone-input-button"
            dropdownClass="phone-input-dropdown"
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Alternative Mobile Number
          </label>
          <PhoneInput
            country={"ae"}
            name="alternative_mobno"
            value={altMobno}
            onChange={handleAltChange}
            inputProps={{
              required: false,
            }}
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
            placeholder="example@domain.com"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Tenant description"
            rows="4"
            className="w-full tenant-info-form-inputs resize-none focus:border-gray-300 duration-200"
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Address*</label>
          <textarea
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            placeholder="Boulevard Downtown Dubai, UAE"
            rows="4"
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
              <option value="Company">Company</option>
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
          <label className="block tenant-info-form-label">
            Trade License Number*
          </label>
          <input
            type="text"
            name="license_no"
            value={formState.license_no}
            onChange={handleInputChange}
            placeholder="123456789"
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
              <option value="Passport">Passport</option>
              <option value="National ID">National ID</option>
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
            name="id_no"
            value={formState.id_no}
            onChange={handleInputChange}
            placeholder="123456789"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Validity*</label>
          <input
            type="date"
            name="id_validity"
            value={formState.id_validity}
            onChange={handleInputChange}
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor Name*</label>
          <input
            type="text"
            name="sponsor_name"
            value={formState.sponsor_name}
            onChange={handleInputChange}
            placeholder="Sponsor Name"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Sponsor ID Type*
          </label>
          <div className="relative">
            <select
              name="sponsor_id_type"
              value={formState.sponsor_id_type}
              onChange={handleInputChange}
              onFocus={() => handleSelectFocus("sponsor_id_type")}
              onBlur={handleSelectBlur}
              className="w-full appearance-none tenant-info-form-inputs focus:border-gray-300 duration-200 cursor-pointer"
              required
            >
              <option value="">Choose</option>
              <option value="Passport">Passport</option>
              <option value="National ID">National ID</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${
                  focusedField === "sponsor_id_type" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Sponsor ID Number*
          </label>
          <input
            type="text"
            name="sponsor_id_no"
            value={formState.sponsor_id_no}
            onChange={handleInputChange}
            placeholder="123456789"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Sponsor ID Validity*
          </label>
          <input
            type="date"
            name="sponsor_id_validity"
            value={formState.sponsor_id_validity}
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
            placeholder="Additional remarks"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
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

export default ResUpdateTenantInfoForm;
