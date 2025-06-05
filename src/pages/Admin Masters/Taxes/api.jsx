import axiosInstance from "../../../axiosInstance";

const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
        return localStorage.getItem("company_id");
    } else if (role === "user") {
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

// API function to fetch countries
export const fetchCountries = async () => {
  try {
    const response = await axiosInstance.get("/accounts/countries/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error("Failed to fetch countries: " + err.message);
  }
};

// API function to fetch states for a country
export const fetchStates = async (countryId) => {
  if (!countryId) {
    return [];
  }
  try {
    const response = await axiosInstance.get(`/accounts/countries/${countryId}/states/`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error("Failed to fetch states: " + err.message);
  }
};

// API function to create a new tax
export const createTax = async (taxData) => {
  const companyId = getUserCompanyId();
  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }

  const payload = {
    tax_type: taxData.taxType,
    tax_percentage: parseFloat(taxData.taxPercentage),
    country: parseInt(taxData.country),
    state: taxData.state ? parseInt(taxData.state) : null,
    applicable_from: taxData.applicableFrom,
    ...(taxData.applicableTo && { applicable_to: taxData.applicableTo }),
  };

  const response = await axiosInstance.post(`/company/taxes/${companyId}/`, payload);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to create tax");
  }
  return response.data;
};

// API function to fetch taxes for a company
export const fetchTaxes = async (viewMode, effectiveDate) => {
  const companyId = getUserCompanyId();
  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }

  const params = {};
  if (viewMode === "history") {
    params.history = true;
  } else if (viewMode === "effective_date" && effectiveDate) {
    params.effective_date = effectiveDate;
  } else {
    params.active_only = true;
  }

  const response = await axiosInstance.get(`/company/taxes/${companyId}/`, { params });
  return Array.isArray(response.data) ? response.data : [];
};

// API function to update a tax
export const updateTax = async (taxId, taxData) => {
  const companyId = getUserCompanyId();
  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }
  if (!taxId) {
    throw new Error("Tax ID is missing");
  }

  const payload = {
    tax_type: taxData.taxType,
    tax_percentage: parseFloat(taxData.taxPercentage),
    country: parseInt(taxData.country),
    state: taxData.state ? parseInt(taxData.state) : null,
    applicable_from: taxData.applicableFrom,
    ...(taxData.applicableTo && { applicable_to: taxData.applicableTo }),
  };

  const response = await axiosInstance.put(`/company/taxes/${companyId}/${taxId}/`, payload);
  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to update tax");
  }
  return response.data;
};

// API function to delete a tax
export const deleteTax = async (taxId) => {
  if (!taxId) {
    throw new Error("Tax ID is missing");
  }

  const response = await axiosInstance.delete(`/company/taxes/${taxId}/`);
  return response.data;
};