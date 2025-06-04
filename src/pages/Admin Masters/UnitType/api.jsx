import axiosInstance from "../../../axiosInstance";

// Function to get company ID based on user role
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

// Function to get relevant user ID based on role
const getRelevantUserId = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  if (role === "user") {
    const userId = localStorage.getItem("user_id");
    if (userId) return userId;
  }
  return null;
};

// API function to create a new unit type
export const createUnitType = async (title) => {
  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }

  const response = await axiosInstance.post("/company/unit-types/create/", {
    title,
    company: companyId,
    user: userId,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to create unit type");
  }

  return response.data;
};

// API function to fetch unit types for a company
export const fetchUnitTypes = async () => {
  const companyId = getUserCompanyId();

  if (!companyId) {
    throw new Error("Company ID not found. Please log in again.");
  }

  const response = await axiosInstance.get(`/company/unit-types/company/${companyId}`);
  return Array.isArray(response.data) ? response.data : response.data.results || [];
};

// API function to update a unit type
export const updateUnitType = async (unitTypeId, title) => {
  const companyId = getUserCompanyId();
  const userId = getRelevantUserId();

  if (!companyId) {
    throw new Error("Company ID is missing or invalid");
  }
  if (!unitTypeId) {
    throw new Error("Unit Type ID is missing");
  }

  const response = await axiosInstance.put(`/company/unit-types/${unitTypeId}/`, {
    title,
    company: companyId,
    user: userId,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to update unit type");
  }

  return response.data;
};

// API function to delete a unit type
export const deleteUnitType = async (unitTypeId) => {
  if (!unitTypeId) {
    throw new Error("Unit Type ID is missing");
  }

  const response = await axiosInstance.delete(`/company/unit-types/${unitTypeId}/`);
  return response.data;
};