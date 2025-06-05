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

// API function to fetch charge codes for a company
export const fetchChargeCodes = async () => {
    const companyId = getUserCompanyId();
    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }

    try {
        const response = await axiosInstance.get(`/company/charge_code/company/${companyId}/`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        throw new Error("Failed to fetch charge codes: " + err.message);
    }
};

// API function to fetch charges for a company
export const fetchCharges = async () => {
    const companyId = getUserCompanyId();
    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }

    try {
        const response = await axiosInstance.get(`/company/charges/company/${companyId}/`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        throw new Error("Failed to fetch charges: " + err.message);
    }
};

// API function to create a new charge
export const createCharges = async (chargeData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }

    const payload = {
        name: chargeData.name,
        charge_code: parseInt(chargeData.chargeCodeId),
        tax_types: chargeData.taxTypes || [],
        company: companyId,
        ...(userId && { user: userId }),
    };

    try {
        const response = await axiosInstance.post(`/company/charges/create/`, payload);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Failed to create charges");
        }
        return response.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.detail ||
            err.response?.data?.name ||
            err.response?.data?.charge_code ||
            err.response?.data?.tax_types ||
            err.response?.data?.company ||
            err.message ||
            "Failed to create charges"
        );
    }
};

// API function to update a charge
export const updateCharges = async (chargeId, chargeData) => {
    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    if (!companyId) {
        throw new Error("Company ID is missing or invalid");
    }
    if (!chargeId) {
        throw new Error("Charge ID is missing");
    }

    const payload = {
        name: chargeData.name,
        charge_code: parseInt(chargeData.chargeCode),
        tax_types: chargeData.taxTypes || [],
        company: companyId,
        ...(userId && { user: userId }),
    };

    try {
        const response = await axiosInstance.put(`/company/charges/${chargeId}/`, payload);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Failed to update charges");
        }
        return response.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.detail ||
            err.response?.data?.name ||
            err.response?.data?.charge_code ||
            err.response?.data?.tax_types ||
            err.response?.data?.company ||
            err.response?.data?.message ||
            err.message ||
            "Failed to update charges"
        );
    }
};

// API function to delete a charge
export const deleteCharges = async (chargeId) => {
    if (!chargeId) {
        throw new Error("Charge ID is missing");
    }

    try {
        const response = await axiosInstance.delete(`/company/charges/${chargeId}/`);
        if (response.status !== 200 && response.status !== 204) {
            throw new Error("Failed to delete charge");
        }
        return response.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.detail || err.message || "Failed to delete charge"
        );
    }
};