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
const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user") {
        const userId = localStorage.getItem("user_id");
        if (userId) return userId;
    }
    return null;
};

// API function to fetch document types for a company
export const fetchDocumentTypes = async () => {
  const companyId = getUserCompanyId();
  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }

  try {
    const response = await axiosInstance.get(`/company/doc_type/company/${companyId}`);
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (err) {
    throw new Error("Failed to fetch document types: " + err.message);
  }
};

// API function to create a new document type
export const createDocumentType = async (docData) => {
  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }

  const payload = {
    title: docData.title,
    company: companyId,
    ...(userId && { user: userId }),
  };

  try {
    const response = await axiosInstance.post(`/company/doc_type/create/`, payload);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create document type");
    }
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail ||
      err.response?.data?.title ||
      err.response?.data?.company ||
      err.response?.data?.user ||
      err.message ||
      "Failed to create document type"
    );
  }
};

// API function to update a document type
export const updateDocumentType = async (docTypeId, docData) => {
  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }
  if (!docTypeId) {
    throw new Error("Document Type ID is missing");
  }

  const payload = {
    title: docData.title,
    company: companyId,
    ...(userId && { user: userId }),
  };

  try {
    const response = await axiosInstance.put(`/company/doc_type/${docTypeId}/`, payload);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to update document type");
    }
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail ||
      err.response?.data?.title ||
      err.response?.data?.company ||
      err.response?.data?.user ||
      err.response?.data?.message ||
      err.message ||
      "Failed to update document type"
    );
  }
};

// API function to delete a document type
export const deleteDocumentType = async (docTypeId) => {
  if (!docTypeId) {
    throw new Error("Document Type ID is missing");
  }

  try {
    const response = await axiosInstance.delete(`/company/doc_type/${docTypeId}/`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete document type");
    }
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || err.message || "Failed to delete document type"
    );
  }
};