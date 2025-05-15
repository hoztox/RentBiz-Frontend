import { useState } from 'react'
import "./tenantinfoform.css"
import PhoneInput from 'react-phone-input-2';
import { ChevronDown } from "lucide-react";

const TenantInfoForm = ({onNext}) => {
      // Form state
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
    
      const [mobno, setMobno] = useState("");
      const [altMobno, setAltMobno] = useState("");
      
      // Track focus state for each dropdown separately
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
    
      // Handle input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setFormState({
          ...formState,
          [name]: value,
        });
      };
    
      // Function to handle focus on select elements
      const handleSelectFocus = (fieldName) => {
        setFocusedField(fieldName);
      };
    
      // Function to handle blur on select elements
      const handleSelectBlur = () => {
        setFocusedField(null);
      };
    
      // Function to handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic would go here
        console.log("Form submitted:", formState);
    
        // Call the onNext prop to move to the next page
        if (onNext) onNext(formState);
      };
  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Name*</label>
          <input
            type="text"
            name="name"
            value={formState.name}
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
              <option value="dubai">Dubai</option>
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

        {/* mobile Number */}
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
            Alternative Mobile Number*
          </label>
          <PhoneInput
            country={"ae"}
            name="alternative_mobno"
            value={altMobno}
            onChange={handleAltChange}
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

        {/* Description */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder=""
            rows="2"
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>

        {/* Address */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Address*</label>
          <textarea
            type="text"
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            placeholder=""
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
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
              <option value="1">Type 1</option>
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
              <option value="1">ID 1</option>
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
        <div></div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor Name*</label>
          <input
            type="text"
            name="sponsor_name"
            value={formState.sponsor_name}
            onChange={handleInputChange}
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
              <option value="1">ID 1</option>
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

        {/* Status */}
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

        {/* Remarks */}
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formState.remarks}
            onChange={handleInputChange}
            placeholder=""
            className="w-full tenant-info-form-inputs focus:border-gray-300 duration-200"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="w-[150px] h-[38px] next-btn duration-300"
        >
          Next
        </button>
      </div>
    </form>
  )
}

export default TenantInfoForm
