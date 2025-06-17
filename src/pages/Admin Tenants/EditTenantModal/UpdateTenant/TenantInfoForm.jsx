import { useState, useEffect } from 'react';
import "./tenantinfoform.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../utils/config";
import PropTypes from "prop-types";
import { countries } from "countries-list";

const TenantInfoForm = ({ onNext, onBack, initialData, tenantId }) => {
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
  const [countriesList, setCountriesList] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    tenant_name: "",
    phone: "",
    alternative_phone: "",
    email: "",
    id_validity_date: "",
    sponser_id_validity_date: "",
    license_no: "",
    address: "",
    id_number: "",
    sponser_name: "",
    sponser_id_number: "",
  });
  const [selectedCountry, setSelectedCountry] = useState({
    countryCode: "ae",
    dialCode: "971",
    name: "United Arab Emirates",
  });
  const [selectedAltCountry, setSelectedAltCountry] = useState({
    countryCode: "ae",
    dialCode: "971",
    name: "United Arab Emirates",
  });

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const storedCompanyId = localStorage.getItem("company_id");
    if (role === "company" || role === "user" || role === "admin") {
      return storedCompanyId;
    }
    return null;
  };

  // Convert countries object to array and sort alphabetically
  useEffect(() => {
    const countriesArray = Object.entries(countries).map(([code, country]) => ({
      code,
      name: country.name,
    }));
    const sortedCountries = countriesArray.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setCountriesList(sortedCountries);
  }, []);

  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) {
          throw new Error("Company ID not found.");
        }
        const response = await axios.get(
          `${BASE_URL}/company/id_type/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched ID Types:", response.data); // Debug log
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
        id_type: initialData.id_type || "",
        id_number: initialData.id_number || "",
        id_validity_date: initialData.id_validity_date || "",
        sponser_name: initialData.sponser_name || "",
        sponser_id_type: initialData.sponser_id_type || "",
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

  const validateTenantName = (name) => {
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!name || name.trim() === "") {
      return "Name is required and cannot be only spaces.";
    }
    if (!nameRegex.test(name)) {
      return "Name can only contain letters, spaces, hyphens, or apostrophes.";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|biz|info|io|co|us|ca|uk|au|de|fr|jp|cn|in)$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address with a recognized domain (e.g., user@domain.com)";
    }
    if (email.length > 254) {
      return "Email address is too long (max 254 characters)";
    }
    if (/\.\./.test(email)) {
      return "Email cannot contain consecutive dots";
    }
    return "";
  };

  const validatePhoneNumber = (phone, country) => {
    if (!phone || phone.trim() === "") {
      return "Phone number is required.";
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly) {
      return "Phone number must contain valid digits.";
    }

    const countryCodeDigits = country.dialCode;
    let phoneDigits = digitsOnly;
    if (digitsOnly.startsWith(countryCodeDigits)) {
      phoneDigits = digitsOnly.slice(countryCodeDigits.length);
    }

    if (country.countryCode === "in") {
      if (phoneDigits.length !== 10) {
        return "Indian phone numbers must be exactly 10 digits.";
      }
    } else {
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        return `Phone number must be between 7 and 15 digits for ${country.name}.`;
      }
    }
    return "";
  };

  const validateRequiredField = (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required and cannot be only spaces.`;
    }
    return "";
  };

  const validateLicenseNumber = (licenseNo, tenantType) => {
    if (tenantType === "Organization") {
      return validateRequiredField(licenseNo, "Trade License Number");
    } else if (tenantType === "Individual" && licenseNo && licenseNo.trim() === "") {
      return "Trade License Number cannot be only spaces if provided.";
    }
    return "";
  };

  const validateValidityDate = (date, fieldName) => {
    if (!date || date.trim() === "") {
      return `${fieldName} is required.`;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return `${fieldName} cannot be in the past. Please select a current or future date.`;
    }

    return "";
  };

  const handleChange = (value, country, field) => {
    const updatedFormState = { ...formState, [field]: value };
    if (field === "phone") {
      setMobno(value);
      setSelectedCountry({
        countryCode: country.countryCode || "ae",
        dialCode: country.dialCode || "971",
        name: country.name || "United Arab Emirates",
      });
    } else {
      setAltMobno(value);
      setSelectedAltCountry({
        countryCode: country.countryCode || "ae",
        dialCode: country.dialCode || "971",
        name: country.name || "United Arab Emirates",
      });
    }
    setFormState(updatedFormState);
  };

  const handlePhoneBlur = (field) => {
    if (field === "phone") {
      const errorMessage = validatePhoneNumber(mobno, selectedCountry);
      setValidationErrors({ ...validationErrors, phone: errorMessage });
    } else {
      const errorMessage = validatePhoneNumber(altMobno, selectedAltCountry);
      setValidationErrors({
        ...validationErrors,
        alternative_phone: errorMessage,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormState = { ...formState, [name]: value };
    setFormState(updatedFormState);

    const newValidationErrors = { ...validationErrors };

    if (name === "tenant_name") {
      newValidationErrors.tenant_name = validateTenantName(value);
    } else if (name === "email") {
      newValidationErrors.email = validateEmail(value);
    } else if (name === "id_validity_date") {
      newValidationErrors.id_validity_date = validateValidityDate(value, "ID Validity");
    } else if (name === "sponser_id_validity_date") {
      newValidationErrors.sponser_id_validity_date = validateValidityDate(
        value,
        "Sponsor ID Validity"
      );
    } else if (name === "address") {
      newValidationErrors.address = validateRequiredField(value, "Address");
    } else if (name === "id_number") {
      newValidationErrors.id_number = validateRequiredField(value, "ID Number");
    } else if (name === "sponser_name") {
      newValidationErrors.sponser_name = validateRequiredField(value, "Sponsor Name");
    } else if (name === "sponser_id_number") {
      newValidationErrors.sponser_id_number = validateRequiredField(
        value,
        "Sponsor ID Number"
      );
    } else if (name === "license_no") {
      newValidationErrors.license_no = validateLicenseNumber(value, updatedFormState.tenant_type);
    } else if (name === "tenant_type") {
      newValidationErrors.license_no = validateLicenseNumber(
        updatedFormState.license_no,
        value
      );
    }

    setValidationErrors(newValidationErrors);
    console.log("Validation Errors after input change:", newValidationErrors);
  };

  const handleSelectFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleSelectBlur = () => {
    setFocusedField(null);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateTenantName(formState.tenant_name);
    const phoneError = validatePhoneNumber(mobno, selectedCountry);
    const altPhoneError = altMobno
      ? validatePhoneNumber(altMobno, selectedAltCountry)
      : "";
    const emailError = validateEmail(formState.email);
    const idValidityError = validateValidityDate(
      formState.id_validity_date,
      "ID Validity"
    );
    const sponserIdValidityError = validateValidityDate(
      formState.sponser_id_validity_date,
      "Sponsor ID Validity"
    );
    const addressError = validateRequiredField(formState.address, "Address");
    const idNumberError = validateRequiredField(
      formState.id_number,
      "ID Number"
    );
    const sponserNameError = validateRequiredField(
      formState.sponser_name,
      "Sponsor Name"
    );
    const sponserIdNumberError = validateRequiredField(
      formState.sponser_id_number,
      "Sponsor ID Number"
    );
    const licenseNoError = validateLicenseNumber(
      formState.license_no,
      formState.tenant_type
    );

    const newValidationErrors = {
      tenant_name: nameError,
      phone: phoneError,
      alternative_phone: altPhoneError,
      email: emailError,
      id_validity_date: idValidityError,
      sponser_id_validity_date: sponserIdValidityError,
      address: addressError,
      id_number: idNumberError,
      sponser_name: sponserNameError,
      sponser_id_number: sponserIdNumberError,
      license_no: licenseNoError,
    };

    setValidationErrors(newValidationErrors);
    console.log("Validation Errors on submit:", newValidationErrors);

    if (
      nameError ||
      phoneError ||
      altPhoneError ||
      emailError ||
      idValidityError ||
      sponserIdValidityError ||
      addressError ||
      idNumberError ||
      sponserNameError ||
      sponserIdNumberError ||
      licenseNoError
    ) {
      return;
    }

    const tempData = {
      tenant_id: tenantId,
      ...formState,
      id_type: formState.id_type || null,
      sponser_id_type: formState.sponser_id_type || null,
      license_no: formState.license_no || null,
    };
    console.log("Temporarily saved tenant data:", tempData);
    onNext(tempData);
  };

  const handleBack = () => {
    const tempData = { ...formState };
    console.log("Passing tenant data back:", tempData);
    onBack?.(tempData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="col-span-1">
          <label className="block tenant-info-form-label">Name *</label>
          <input
            type="text"
            name="tenant_name"
            value={formState.tenant_name}
            onChange={handleInputChange}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.tenant_name ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.tenant_name && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.tenant_name}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Nationality *</label>
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
              <option value="">Choose Nationality</option>
              {countriesList.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${focusedField === "nationality" ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Mobile Number *</label>
          <PhoneInput
            country={"ae"}
            name="phone"
            value={mobno}
            onChange={(value, country) => handleChange(value, country, "phone")}
            onBlur={() => handlePhoneBlur("phone")}
            inputProps={{ required: true }}
            containerClass="phone-input-container"
            inputClass={`tenant-info-form-inputs phone-input ${
              validationErrors.phone ? "border-red-500" : ""
            }`}
            buttonClass="phone-input-button"
            dropdownClass="phone-input-dropdown"
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.phone}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Alternative Mobile Number</label>
          <PhoneInput
            country={"ae"}
            name="alternative_phone"
            value={altMobno}
            onChange={(value, country) => handleChange(value, country, "alternative_phone")}
            onBlur={() => handlePhoneBlur("alternative_phone")}
            containerClass="phone-input-container"
            inputClass={`tenant-info-form-inputs phone-input ${
              validationErrors.alternative_phone ? "border-red-500" : ""
            }`}
            buttonClass="phone-input-button"
            dropdownClass="phone-input-dropdown"
          />
          {validationErrors.alternative_phone && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.alternative_phone}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.email ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
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
          <label className="block tenant-info-form-label">Address *</label>
          <textarea
            name="address"
            value={formState.address}
            onChange={handleInputChange}
            className={`w-full tenant-info-form-inputs resize-none focus:border-gray-300 duration-200 ${
              validationErrors.address ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.address && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.address}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Tenant Type *</label>
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
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${focusedField === "tenant_type" ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">
            Trade License Number {formState.tenant_type === "Organization" ? "*" : ""}
          </label>
          <input
            type="text"
            name="license_no"
            value={formState.license_no}
            onChange={handleInputChange}
            onBlur={() => {
              const errorMessage = validateLicenseNumber(
                formState.license_no,
                formState.tenant_type
              );
              setValidationErrors({
                ...validationErrors,
                license_no: errorMessage,
              });
              console.log("License No Error on Blur:", errorMessage);
            }}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.license_no ? "border-red-500" : ""
            }`}
            required={formState.tenant_type === "Organization"}
          />
          {validationErrors.license_no && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.license_no}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Type *</label>
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
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${focusedField === "id_type" ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Number *</label>
          <input
            type="text"
            name="id_number"
            value={formState.id_number}
            onChange={handleInputChange}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.id_number ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.id_number && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.id_number}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">ID Validity *</label>
          <input
            type="date"
            name="id_validity_date"
            value={formState.id_validity_date}
            onChange={handleInputChange}
            min={getTodayDate()}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.id_validity_date ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.id_validity_date && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.id_validity_date}
            </p>
          )}
        </div>
        <div></div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor Name *</label>
          <input
            type="text"
            name="sponser_name"
            value={formState.sponser_name}
            onChange={handleInputChange}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.sponser_name ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.sponser_name && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.sponser_name}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor ID Type *</label>
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
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${focusedField === "sponser_id_type" ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor ID Number *</label>
          <input
            type="text"
            name="sponser_id_number"
            value={formState.sponser_id_number}
            onChange={handleInputChange}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.sponser_id_number ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.sponser_id_number && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.sponser_id_number}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Sponsor ID Validity *</label>
          <input
            type="date"
            name="sponser_id_validity_date"
            value={formState.sponser_id_validity_date}
            onChange={handleInputChange}
            min={getTodayDate()}
            className={`w-full tenant-info-form-inputs focus:border-gray-300 duration-200 ${
              validationErrors.sponser_id_validity_date ? "border-red-500" : ""
            }`}
            required
          />
          {validationErrors.sponser_id_validity_date && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.sponser_id_validity_date}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block tenant-info-form-label">Status *</label>
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
                className={`h-5 w-5 text-[#201D1E] transition-transform duration-300 ${focusedField === "status" ? "rotate-180" : ""}`}
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
        {onBack && (
          <button
            type="button"
            className="w-[150px] h-[38px] mr-4 text-[#201D1E] bg-white hover:bg-[#201D1E] hover:text-white duration-200"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        <button type="submit" className="w-[150px] h-[38px] next-btn duration-300">
          Next
        </button>
      </div>
    </form>
  );
};

TenantInfoForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  initialData: PropTypes.object,
  tenantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TenantInfoForm;