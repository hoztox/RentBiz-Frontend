import axiosInstance from "../../axiosInstance";

// Common utility functions
export const getUserCompanyId = () => {
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

export const getRelevantUserId = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  if (role === "user") {
    const userId = localStorage.getItem("user_id");
    if (userId) return userId;
  }
  return null;
};

const handleApiError = (error, defaultMessage) => {
  throw new Error(
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.message ||
    defaultMessage
  );
};

// Unit Types API
export const unitTypesApi = {
  create: async (title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");

    try {
      const response = await axiosInstance.post("/company/unit-types/create/", {
        title,
        company: companyId,
        user: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create unit type");
    }
  },

 fetch: async ({ search = "", status = "", page = 1, page_size = 10 }) => {
  const companyId = getUserCompanyId();
  if (!companyId) throw new Error("Company ID not found. Please log in again.");

  try {
    const response = await axiosInstance.get(
      `/company/unit-types/company/${companyId}/`,
      {
        params: {
          search,
          status,
          page,
          page_size,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch unit types");
    return { results: [], count: 0 };
  }
},

  update: async (unitTypeId, title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");
    if (!unitTypeId) throw new Error("Unit Type ID is missing");

    try {
      const response = await axiosInstance.put(`/company/unit-types/${unitTypeId}/`, {
        title,
        company: companyId,
        user: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update unit type");
    }
  },

  delete: async (unitTypeId) => {
    if (!unitTypeId) throw new Error("Unit Type ID is missing");

    try {
      const response = await axiosInstance.delete(`/company/unit-types/${unitTypeId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete unit type");
    }
  },
};

// ID Types API
export const idTypesApi = {
  create: async (title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");

    try {
      const response = await axiosInstance.post("/company/id_type/create/", {
        title,
        company: companyId,
        user: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create ID type");
    }
  },

  fetch: async () => {
    const companyId = getUserCompanyId();
    if (!companyId) throw new Error("Company ID not found. Please log in again.");

    try {
      const response = await axiosInstance.get(`/company/id_type/company/${companyId}/`);
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      handleApiError(error, "Failed to fetch ID types");
    }
  },

  update: async (idTypeId, title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");
    if (!idTypeId) throw new Error("ID Type ID is missing");

    try {
      const response = await axiosInstance.put(`/company/id_type/${idTypeId}/`, {
        title,
        company: companyId,
        user: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update ID type");
    }
  },

  delete: async (idTypeId) => {
    if (!idTypeId) throw new Error("ID Type ID is missing");

    try {
      const response = await axiosInstance.delete(`/company/id_type/${idTypeId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete ID type");
    }
  },
};

// Charge Codes API
export const chargeCodesApi = {
  create: async (title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");

    try {
      const response = await axiosInstance.post("/company/charge_code/create/", {
        title,
        company: companyId,
        user: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create charge code");
    }
  },

  fetch: async () => {
    const companyId = getUserCompanyId();
    if (!companyId) throw new Error("Company ID is missing or invalid");

    try {
      const response = await axiosInstance.get(`/company/charge_code/company/${companyId}/`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, "Failed to fetch charge codes");
    }
  },

  update: async (chargeCodeId, title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");
    if (!chargeCodeId) throw new Error("Charge Code ID is missing");

    try {
      const response = await axiosInstance.put(`/company/charge_code/${chargeCodeId}/`, {
        title,
        company: companyId,
        user: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update charge code");
    }
  },

  delete: async (chargeCodeId) => {
    if (!chargeCodeId) throw new Error("Charge Code ID is missing");

    try {
      const response = await axiosInstance.delete(`/company/charge_code/${chargeCodeId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete charge code");
    }
  },
};

// Location API (Countries & States)
export const locationApi = {
  fetchCountries: async () => {
    try {
      const response = await axiosInstance.get("/accounts/countries/");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, "Failed to fetch countries");
    }
  },

  fetchStates: async (countryId) => {
    if (!countryId) return [];

    try {
      const response = await axiosInstance.get(`/accounts/countries/${countryId}/states/`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, "Failed to fetch states");
    }
  },
};

// Taxes API
export const taxesApi = {
  create: async (taxData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();
    if (!companyId) throw new Error("Company ID is missing or invalid");

    const payload = {
      company: companyId,
      user: userId,
      tax_type: taxData.taxType,
      tax_percentage: parseFloat(taxData.taxPercentage),
      country: parseInt(taxData.country),
      state: taxData.state ? parseInt(taxData.state) : null,
      applicable_from: taxData.applicableFrom,
      ...(taxData.applicableTo && { applicable_to: taxData.applicableTo }),
    };

    try {
      const response = await axiosInstance.post(`/company/taxes/${companyId}/`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create tax");
    }
  },

  fetch: async (viewMode, effectiveDate) => {
    const companyId = getUserCompanyId();
    if (!companyId) throw new Error("Company ID is missing or invalid");

    const params = {};
    if (viewMode === "history") {
      params.history = true;
    } else if (viewMode === "effective_date" && effectiveDate) {
      params.effective_date = effectiveDate;
    } else {
      params.active_only = true;
    }

    try {
      const response = await axiosInstance.get(`/company/taxes/${companyId}/`, { params });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, "Failed to fetch taxes");
    }
  },

  update: async (taxId, taxData) => {
    const companyId = getUserCompanyId();
    if (!companyId) throw new Error("Company ID is missing or invalid");
    if (!taxId) throw new Error("Tax ID is missing");

    const payload = {
      tax_type: taxData.taxType,
      tax_percentage: parseFloat(taxData.taxPercentage),
      country: parseInt(taxData.country),
      state: taxData.state ? parseInt(taxData.state) : null,
      applicable_from: taxData.applicableFrom,
      ...(taxData.applicableTo && { applicable_to: taxData.applicableTo }),
    };

    try {
      const response = await axiosInstance.put(`/company/taxes/${companyId}/${taxId}/`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update tax");
    }
  },

  delete: async (taxId) => {
    if (!taxId) throw new Error("Tax ID is missing");

    try {
      const response = await axiosInstance.delete(`/company/taxes/${taxId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete tax");
    }
  },
};

// Charges API
export const chargesApi = {
  fetch: async () => {
    const companyId = getUserCompanyId();
    if (!companyId) throw new Error("Company ID is missing or invalid");

    try {
      const response = await axiosInstance.get(`/company/charges/company/${companyId}/`);
      console.log('Fetched Chargeessss', response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      handleApiError(error, "Failed to fetch charges");
    }
  },

  create: async (chargeData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");

    const payload = {
      name: chargeData.name,
      charge_code: parseInt(chargeData.chargeCodeId),
      taxes: chargeData.taxTypes || [], // Changed from tax_types to taxes
      company: companyId,
      ...(userId && { user: userId }),
    };

    console.log('FormData');


    try {
      const response = await axiosInstance.post(`/company/charges/create/`, payload);
      console.log("Document Type Created:", response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create charges");
    }
  },

  update: async (chargeId, chargeData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");
    if (!chargeId) throw new Error("Charge ID is missing");

    const payload = {
      name: chargeData.name,
      charge_code: parseInt(chargeData.chargeCode),
      taxes: chargeData.taxTypes || [], // Changed from tax_types to taxes
      company: companyId,
      ...(userId && { user: userId }),
    };

    try {
      const response = await axiosInstance.put(`/company/charges/${chargeId}/`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update charges");
    }
  },

  delete: async (chargeId) => {
    if (!chargeId) throw new Error("Charge ID is missing");

    try {
      const response = await axiosInstance.delete(`/company/charges/${chargeId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete charge");
    }
  },
};

// Document Types API
export const documentTypesApi = {
  fetch: async () => {
    const companyId = getUserCompanyId();
    if (!companyId) throw new Error("Company ID is missing or invalid");

    try {
      const response = await axiosInstance.get(`/company/doc_type/company/${companyId}`);
      console.log('Documentsssss', response.data);

      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      handleApiError(error, "Failed to fetch document types");
    }
  },

  create: async (docData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");

    const payload = {
      title: docData.title,
      number: docData.number || false, // Include number field
      issue_date: docData.issue_date || false, // Include issue_date field
      expiry_date: docData.expiry_date || false, // Include expiry_date field
      upload_file: docData.upload_file || false, // Include upload_file field
      company: companyId,
      ...(userId && { user: userId }),
    };

    try {
      const response = await axiosInstance.post(`/company/doc_type/create/`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to create document type");
    }
  },

  update: async (docTypeId, docData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) throw new Error("Company ID is missing or invalid");
    if (!docTypeId) throw new Error("Document Type ID is missing");

    const payload = {
      title: docData.title,
      number: docData.number || false,  
      issue_date: docData.issue_date || false,  
      expiry_date: docData.expiry_date || false,  
      upload_file: docData.upload_file || false,
      company: companyId,
      ...(userId && { user: userId }),
    };

    try {
      const response = await axiosInstance.put(`/company/doc_type/${docTypeId}/`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update document type");
    }
  },

  delete: async (docTypeId) => {
    if (!docTypeId) throw new Error("Document Type ID is missing");

    try {
      const response = await axiosInstance.delete(`/company/doc_type/${docTypeId}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to delete document type");
    }
  },
};