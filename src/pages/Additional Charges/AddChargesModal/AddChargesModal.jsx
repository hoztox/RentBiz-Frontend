import React, { useEffect, useState } from "react";
import "./AddChargesModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Additional Charges/close-icon.svg";
import plusicon from "../../../assets/Images/Additional Charges/input-plus-icon.svg";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { toast } from "react-hot-toast";

const AddChargesModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [tenancyContract, setTenancyContract] = useState("");
  const [inDate, setInDate] = useState("");
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
    if (modalState.isOpen && modalState.type === "create-additional-charges") {
      setTenancyContract("");
      setInDate("");
      setChargeCode("");
      setReason("");
      setAmountDue("");
      setTaxAmount("");
      setTotalAmount("");
      setDueDate("");
      setStatus("");
      setRemarks("");
      setError("");
      fetchOptions();
    }
  }, [modalState.isOpen, modalState.type]);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
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

  const fetchOptions = async () => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID not found. Please ensure you are logged in.");
      toast.error("Company ID not found. Please ensure you are logged in.");
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

      setTenancies(tenanciesResponse.data.data || tenanciesResponse.data || []);
      setChargeTypes(chargesResponse.data.data || chargesResponse.data || []);
    } catch (err) {
      setError("Failed to fetch options: " + err.message);
      toast.error("Failed to fetch options: " + err.message);
    }
  };

  useEffect(() => {
    const fetchTaxPreview = async () => {
      const companyId = getUserCompanyId();
      if (!companyId || !chargeCode || !amountDue || !dueDate || !inDate) {
        setTaxAmount("");
        setTotalAmount("");
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
            in_date: inDate,
            reason: reason || "Additional Charge",
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response.data.success) {
          setTaxAmount(response.data.additional_charge.tax || "0.00");
          setTotalAmount(response.data.additional_charge.total || "0.00");
          setError("");
        } else {
          setTaxAmount("");
          setTotalAmount("");
          setError(response.data.message || "Failed to fetch tax preview");
          toast.error(response.data.message || "Failed to fetch tax preview");
        }
      } catch (err) {
        setTaxAmount("");
        setTotalAmount("");
        setError("Error fetching tax preview: " + err.message);
        toast.error("Error fetching tax preview: " + err.message);
      }
    };

    fetchTaxPreview();
  }, [chargeCode, amountDue, dueDate, inDate, reason]);

  const handleSave = async () => {
    if (!tenancyContract || !chargeCode || !reason || !dueDate || !amountDue || !status || !inDate) {
      setError("Please fill all required fields (Tenancy Contract, Charge Code, Reason, In Date, Due Date, Amount Due, Status)");
      toast.error("Please fill all required fields");
      return;
    }

    const formData = {
      tenancy: tenancyContract,
      charge_type: chargeCode,
      reason,
      in_date: inDate,
      due_date: dueDate,
      amount: amountDue,
      tax: taxAmount || "0.00",
      status,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/company/additional-charges/create/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        toast.success("Additional charge created successfully");
        triggerRefresh();
        closeModal();
      } else {
        setError(response.data.message || "Failed to create additional charge");
        toast.error(response.data.message || "Failed to create additional charge");
      }
    } catch (err) {
      setError("Error creating additional charge: " + err.message);
      toast.error("Error creating additional charge: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!modalState.isOpen || modalState.type !== "create-additional-charges") {
    return null;
  }

  return (
    <div className="additional-charges-modal-overlay">
      <div className="add-charges-modal-container bg-white rounded-md w-[1006px] shadow-lg p-1">
        <div className="flex justify-between items-center md:p-6 mt-2">
          <h2 className="text-[#201D1E] add-charges-head">Create New Additional Charge</h2>
          <button
            onClick={closeModal}
            className="add-charges-close-btn hover:bg-gray-100 duration-200"
          >
            <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* {error && <div className="text-red-500 text-center mb-4">{error}</div>} */}

        <div className="md:p-6 mt-[-15px]">
          <div className="grid ac-grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block add-charges-label">Tenancy Contract*</label>
              <div className="relative">
                <select
                  value={tenancyContract}
                  onChange={(e) => {
                    setTenancyContract(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setIsSelectOpenTenancy(true)}
                  onBlur={() => setIsSelectOpenTenancy(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !tenancyContract ? "add-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled hidden>Choose</option>
                  {tenancies.map((tenancy) => (
                    <option key={tenancy.id} value={tenancy.id}>
                      {tenancy.tenancy_code} - {tenancy.tenant.tenant_name || "N/A"}
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
              <label className="block add-charges-label">In Date*</label>
              <input
                type="date"
                value={inDate}
                onChange={(e) => {
                  setInDate(e.target.value);
                  setError("");
                }}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Due Date*</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setError("");
                }}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Charge Code*</label>
              <div className="relative">
                <select
                  value={chargeCode}
                  onChange={(e) => {
                    setChargeCode(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setIsSelectOpenChargeCode(true)}
                  onBlur={() => setIsSelectOpenChargeCode(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !chargeCode ? "add-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled hidden>Choose</option>
                  {chargeTypes.map((charge) => (
                    <option key={charge.id} value={charge.id}>{charge.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      isSelectOpenChargeCode ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Reason*</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
                placeholder="Enter The Reason"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Amount Due*</label>
              <input
                type="number"
                value={amountDue}
                onChange={(e) => {
                  setAmountDue(e.target.value);
                  setError("");
                }}
                placeholder="Enter Amount Due"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Tax Amount</label>
              <div className="relative">
                <input
                  type="text"
                  value={taxAmount}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-200 bg-gray-100 add-charges-input"
                />
                <div className="absolute inset-y-0 right-1 flex items-center px-2">
                  <img src={plusicon} alt="plus-icon" className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Total Amount</label>
              <input
                type="text"
                value={totalAmount}
                readOnly
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-100 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Status*</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setIsSelectOpenStatus(true)}
                  onBlur={() => setIsSelectOpenStatus(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !status ? "add-charges-selected" : ""
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
              <label className="block add-charges-label">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter Remarks"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>
          </div>
          <div className="flex items-end justify-end mt-7 mb-1">
            <button
              type="button"
              onClick={handleSave}
              className={`bg-[#2892CE] text-white add-charges-save-btn duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChargesModal;