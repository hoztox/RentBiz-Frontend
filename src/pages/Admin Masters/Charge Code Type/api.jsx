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

export const createChargeCode = async (title) => {

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }

    const response = await axiosInstance.post("/company/charge_code/create/", {
        title,
        company: companyId,
        user: userId,
    });

    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create charge code");
    }

    return response.data;
};

// API function to fetch charge codes for a company
export const fetchChargeCodes = async () => {
    const companyId = getUserCompanyId();

    if (!companyId) {
        throw new Error("Company ID not found. Please log in again.");
    }

    const response = await axiosInstance.get(`/company/charge_code/company/${companyId}/`);
    return Array.isArray(response.data) ? response.data : response.data.results || [];
};

// API function to update a charge code
export const updateChargeCode = async (chargeCodeId, title) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }
    if (!chargeCodeId) {
        throw new Error("Charge Code ID is missing");
    }

    const response = await axiosInstance.put(`/company/charge_code/${chargeCodeId}/`, {
        title,
        company: companyId,
        user: userId,
    });

    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update charge code");
    }

    return response.data;
};

// API function to delete a charge code
export const deleteChargeCode = async (chargeCodeId) => {
    if (!chargeCodeId) {
        throw new Error("Charge Code ID is missing");
    }

    const response = await axiosInstance.delete(`/company/charge_code/${chargeCodeId}/`);
    return response.data;
};