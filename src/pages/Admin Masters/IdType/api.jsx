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

// Function to get relevant user ID based on role
const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user") {
        const userId = localStorage.getItem("user_id");
        if (userId) return userId;
    }
    return null;
};

// API function to create a new ID type
export const createIdType = async (title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }

    const response = await axiosInstance.post("/company/id_type/create/", {
        title,
        company: companyId,
        user: userId,
    });

    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create ID type");
    }

    return response.data;
};

// API function to fetch ID types for a company
export const fetchIdTypes = async () => {
    const companyId = getUserCompanyId();

    if (!companyId) {
        throw new Error("Company ID not found. Please log in again.");
    }

    const response = await axiosInstance.get(`/company/id_type/company/${companyId}/`);
    return Array.isArray(response.data) ? response.data : response.data.results || [];
};

// API function to update an ID type
export const updateIdType = async (idTypeId, title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }
    if (!idTypeId) {
        throw new Error("ID Type ID is missing");
    }

    const response = await axiosInstance.put(`/company/id_type/${idTypeId}/`, {
        title,
        company: companyId,
        user: userId,
    });

    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update ID type");
    }

    return response.data;
};

// API function to delete an ID type
export const deleteIdType = async (idTypeId) => {
    if (!idTypeId) {
        throw new Error("ID Type ID is missing");
    }

    const response = await axiosInstance.delete(`/company/id_type/${idTypeId}/`);
    return response.data;
};