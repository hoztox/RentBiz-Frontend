import React, { useEffect, useState } from "react";
import "./UpdateChargesModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Additional Charges/close-icon.svg";
import plusicon from "../../../assets/Images/Additional Charges/input-plus-icon.svg";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const UpdateAdditionalCharges = () => {
  const { modalState, closeModal } = useModal();
  const [tenancyContract, setTenancyContract] = useState("");
  const [id, setId] = useState("");
  const [date, setDate] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [reason, setReason] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tenancies, setTenancies] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [isSelectOpenTenancy, setIsSelectOpenTenancy] = useState(false);
  const [isSelectOpenChargeCode, setIsSelectOpenChargeCode] = useState(false);
  const [isSelectOpenStatus, setIsSelectOpenStatus] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-additional-charges" && modalState.data) {
      console.log("Modal State:", modalState); // Debug: Log modal state
      setId(modalState.data.id || "");
      setTenancyContract(modalState.data.tenancy?.id || "");
      setDate(modalState.data.created_at ? new Date(modalState.data.created_at).toISOString().split("T")[0] : "");
      setChargeCode(modalState.data.charge_type?.id || "");
      setReason(modalState.data.reason || "");
      setAmountDue(modalState.data.amount ? parseFloat(modalState.data.amount).toFixed(2) : "");
      setTaxAmount(modalState.data.tax ? parseFloat(modalState.data.tax).toFixed(2) : "");
      setTotalAmount(modalState.data.total ? parseFloat(modalState.data.total).toFixed(2) : "");
      setDueDate(modalState.data.due_date || "");
      setStatus(modalState.data.status || "");
      setRemarks(modalState.data.remarks || "");
      setError("");
      fetchOptions();
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    console.log("Role:", role); // Debug: Log role
    if (role === "company") {
      const companyId = localStorage.getItem("company_id");
      console.log("Company ID (company role):", companyId); // Debug: Log company ID
      return companyId;
    } else if (role === "user" || role === "admin") {
      try {
        const userCompanyId = localStorage.getItem("company_id");
        const parsedId = userCompanyId ? JSON.parse(userCompanyId) : null;
        console.log("Company ID (user/admin role):", parsedId); // Debug: Log parsed company ID
        return parsedId;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  const fetchOptions = async () => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID not found. Please ensure you are logged in.");
      console.log("Error: No company ID found"); // Debug: Log missing company ID
      return;
    }

    try {
      const [tenanciesResponse, chargesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/company/tenancies/occupied/${companyId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`${BASE_URL}/company/charges/company/${companyId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      console.log("Tenancies Response:", tenanciesResponse.data); // Debug: Log tenancies response
      console.log("Charges Response:", chargesResponse.data); // Debug: Log charges response

      setTenancies(tenanciesResponse.data.data || tenanciesResponse.data || []);
      setChargeTypes(chargesResponse.data.data || chargesResponse.data || []);

      console.log("Tenancies State:", tenanciesResponse.data.data || tenanciesResponse.data); // Debug: Log tenancies state
      console.log("Charge Types State:", chargesResponse.data.data || chargesResponse.data); // Debug: Log charge types state
    } catch (err) {
      setError("Failed to fetch options: " + err.message);
      console.error("Fetch Options Error:", err); // Debug: Log fetch error
    }
  };

  useEffect(() => {
    const fetchTaxPreview = async () => {
      const companyId = getUserCompanyId();
      if (!companyId || !chargeCode || !amountDue || !dueDate) {
        setTaxAmount("");
        setTotalAmount("");
        console.log("Tax Preview Skipped: Missing required fields", { companyId, chargeCode, amountDue, dueDate }); // Debug: Log skip reason
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/company/tenancies/preview-additional-charge-tax/`,
          {
            company: companyId,
            charge_type: chargeCode,
            amount: amountDue,
            due_date: dueDate,
            reason: reason || "Additional Charge",
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        console.log("Tax Preview Response:", response.data); // Debug: Log tax preview response

        if (response.data.success) {
          setTaxAmount(response.data.additional_charge.tax || "0.00");
          setTotalAmount(response.data.additional_charge.total || "0.00");
          setError("");
        } else {
          setTaxAmount("");
          setTotalAmount("");
          setError(response.data.message || "Failed to fetch tax preview");
        }
      } catch (err) {
        setTaxAmount("");
        setTotalAmount("");
        setError("Error fetching tax preview: " + err.message);
        console.error("Tax Preview Error:", err); // Debug: Log tax preview error
      }
    };

    fetchTaxPreview();
  }, [chargeCode, amountDue, dueDate, reason]);

  const handleUpdate = async () => {
    if (!tenancyContract || !chargeCode || !reason || !dueDate || !amountDue || !status) {
      setError("Please fill all required fields (Tenancy Contract, Charge Code, Reason, Due Date, Amount Due, Status)");
      console.log("Validation Failed: Missing fields", { tenancyContract, chargeCode, reason, dueDate, amountDue, status }); // Debug: Log validation failure
      return;
    }

    const formData = {
      tenancy: tenancyContract,
      charge_type: chargeCode,
      reason,
      due_date: dueDate,
      amount: amountDue,
      tax: taxAmount || "0.00",
      status,
      remarks,
    };

    console.log("Form Data for Update:", formData); // Debug: Log form data before update

    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}/company/additional-charges/${id}/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Update Response:", response.data); // Debug: Log update response

      if (response.data.success) {
        closeModal();
      } else {
        setError(response.data.message || "Failed to update additional charge");
      }
    } catch (err) {
      setError("Error updating additional charge: " + err.message);
      console.error("Update Error:", err); // Debug: Log update error
    } finally {
      setLoading(false);
    }
  };

  if (!modalState.isOpen || modalState.type !== "update-additional-charges" || !modalState.data) {
    return null;
  }

  return (
    <div className="additional-charges-modal-overlay">
      <div className="update-charges-modal-container bg-white rounded-md w-[1006px] shadow-lg p-1">
        <div className="flex justify-between items-center md:p-6 mt-2">
          <h2 className="text-[#201D1E] update-charges-head">Update Additional Charge</h2>
          <button
            onClick={closeModal}
            className="update-charges-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="md:p-6 mt-[-15px]">
          <div className="grid uc-grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block update-charges-label">Tenancy Contract*</label>
              <div className="relative">
                <select
                  value={tenancyContract}
                  onChange={(e) => {
                    setTenancyContract(e.target.value);
                    setError("");
                    console.log("Selected Tenancy:", e.target.value); // Debug: Log tenancy selection
                  }}
                  onFocus={() => setIsSelectOpenTenancy(true)}
                  onBlur={() => setIsSelectOpenTenancy(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    !tenancyContract ? "update-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled hidden>Choose</option>
                  {tenancies.map((tenancy) => (
                    <option key={tenancy.id} value={tenancy.id}>
                      {tenancy.tenancy_code} - {tenancy.tenant?.tenant_name || "N/A"}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      isSelectOpenTenancy ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Date*</label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError("");
                  console.log("Selected Date:", e.target.value); // Debug: Log date selection
                }}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Due Date*</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setError("");
                  console.log("Selected Due Date:", e.target.value); // Debug: Log due date selection
                }}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">ID</label>
              <input
                type="text"
                value={id}
                readOnly
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-100 update-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Charge Code*</label>
              <div className="relative">
                <select
                  value={chargeCode}
                  onChange={(e) => {
                    setChargeCode(e.target.value);
                    setError("");
                    console.log("Selected Charge Code:", e.target.value); // Debug: Log charge code selection
                  }}
                  onFocus={() => setIsSelectOpenChargeCode(true)}
                  onBlur={() => setIsSelectOpenChargeCode(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    !chargeCode ? "update-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled hidden>Choose</option>
                  {chargeTypes.map((charge) => (
                    <option key={charge.id} value={charge.id}>{charge.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <img src={plusicon} alt="plus-icon" className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Reason*</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                  console.log("Reason:", e.target.value); // Debug: Log reason input
                }}
                placeholder="Enter The Reason"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Amount Due*</label>
              <input
                type="number"
                value={amountDue}
                onChange={(e) => {
                  setAmountDue(e.target.value);
                  setError("");
                  console.log("Amount Due:", e.target.value); // Debug: Log amount due input
                }}
                placeholder="Enter Amount Due"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Tax Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={taxAmount}
                  onChange={(e) => {
                    setTaxAmount(e.target.value);
                    setError("");
                    console.log("Tax Amount:", e.target.value); // Debug: Log tax amount input
                  }}
                  placeholder="Enter Tax Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={plusicon} alt="plus-icon" className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Total Amount</label>
              <input
                type="text"
                value={totalAmount}
                readOnly
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-100 update-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Status*</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setError("");
                    console.log("Selected Status:", e.target.value); // Debug: Log status selection
                  }}
                  onFocus={() => setIsSelectOpenStatus(true)}
                  onBlur={() => setIsSelectOpenStatus(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    !status ? "update-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled hidden>Choose</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      isSelectOpenStatus ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-1">
              <label className="block update-charges-label">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  console.log("Remarks:", e.target.value); // Debug: Log remarks input
                }}
                placeholder="Enter Remarks"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>

            <div className="flex items-end justify-end mb-1">
              <button
                type="button"
                onClick={handleUpdate}
                className={`bg-[#2892CE] text-white update-charges-save-btn duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdditionalCharges;