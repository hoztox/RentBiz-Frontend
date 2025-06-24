import React, { useEffect, useState } from "react";
import "./UpdateChargesModal.css";
import { ChevronDown, X } from "lucide-react";
import plusicon from "../../../assets/Images/Additional Charges/input-plus-icon.svg";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { toast } from "react-hot-toast";

const UpdateAdditionalCharges = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [building, setBuilding] = useState("");
  const [unit, setUnit] = useState("");
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
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [isSelectOpenBuilding, setIsSelectOpenBuilding] = useState(false);
  const [isSelectOpenUnit, setIsSelectOpenUnit] = useState(false);
  const [isSelectOpenTenancy, setIsSelectOpenTenancy] = useState(false);
  const [isSelectOpenChargeCode, setIsSelectOpenChargeCode] = useState(false);
  const [isSelectOpenStatus, setIsSelectOpenStatus] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-additional-charges" && modalState.data) {
      console.log("Modal State:", modalState);
      setBuilding(modalState.data.tenancy_detail?.unit?.building?.id || "");
      setUnit(modalState.data.tenancy_detail?.unit?.id || "");
      setTenancyContract(String(modalState.data.tenancy || ""));
      setInDate(modalState.data.in_date ? new Date(modalState.data.in_date).toISOString().split("T")[0] : "");
      setChargeCode(modalState.data.charge_type?.id || "");
      setReason(modalState.data.reason || "");
      setAmountDue(modalState.data.amount ? parseFloat(modalState.data.amount).toFixed(2) : "");
      setTaxAmount(modalState.data.tax ? parseFloat(modalState.data.tax).toFixed(2) : "");
      setTotalAmount(modalState.data.total ? parseFloat(modalState.data.total).toFixed(2) : "");
      setDueDate(modalState.data.due_date ? new Date(modalState.data.due_date).toISOString().split("T")[0] : "");
      setStatus(modalState.data.status || "");
      setRemarks(modalState.data.remarks || "");
      setError("");
      fetchOptions();
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    console.log("Role:", role);
    if (role === "company") {
      const companyId = localStorage.getItem("company_id");
      console.log("Company ID (company role):", companyId);
      return companyId;
    } else if (role === "user" || role === "admin") {
      try {
        const userCompanyId = localStorage.getItem("company_id");
        const parsedId = userCompanyId ? JSON.parse(userCompanyId) : null;
        console.log("Company ID (user/admin role):", parsedId);
        return parsedId;
      } catch (e) {
        console.error("Error parsing user company ID:", e);
        return null;
      }
    }
    return null;
  };

  const fetchBuildings = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("No company ID found");
        toast.error("No company ID found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/buildings/occupied/${companyId}/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedBuildings = response.data.sort((a, b) => a.id - b.id);
        setBuildings(sortedBuildings);
      } else {
        setBuildings([]);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setError("Failed to fetch buildings");
      toast.error("Failed to fetch buildings");
      setBuildings([]);
    }
  };

  const fetchUnits = async (buildingId) => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId || !buildingId) {
        setError("Company ID or Building ID not found");
        toast.error("Company ID or Building ID not found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/units/${buildingId}/occupied-units/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedUnits = response.data.sort((a, b) => a.id - b.id);
        setUnits(sortedUnits);
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setError("Failed to fetch units");
      toast.error("Failed to fetch units");
      setUnits([]);
    }
  };

  const fetchTenancies = async (unitId) => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId || !unitId) {
        setError("Company ID or Unit ID not found");
        toast.error("Company ID or Unit ID not found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/tenancies/company/${companyId}/${unitId}/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data && Array.isArray(response.data.results)) {
        const sortedTenancies = response.data.results.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
      } else {
        setTenancies([]);
      }
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      setError("Failed to fetch tenancies");
      toast.error("Failed to fetch tenancies");
      setTenancies([]);
    }
  };

  const fetchOptions = async () => {
    const companyId = getUserCompanyId();
    if (!companyId) {
      setError("Company ID not found. Please ensure you are logged in.");
      toast.error("Company ID not found. Please ensure you are logged in.")
      return;
    }

    try {
      // Fetch buildings and charge types
      await Promise.all([
        fetchBuildings(),
        axios.get(`${BASE_URL}/company/charges/company/${companyId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then(response => {
          console.log("Charges Response:", response.data);
          setChargeTypes(response.data.data || response.data || []);
        })
      ]);

      // If building and unit are already set from modal data, fetch the corresponding units and tenancies
      if (building) {
        await fetchUnits(building);
        if (unit) {
          await fetchTenancies(unit);
        }
      }
    } catch (err) {
      setError("Failed to fetch options: " + err.message);
      toast.error("Fetch Options Error:", err.message);
    }
  };

  useEffect(() => {
    const fetchTaxPreview = async () => {
      const companyId = getUserCompanyId();
      if (!companyId || !chargeCode || !amountDue || !dueDate || !inDate) {
        setTaxAmount("");
        setTotalAmount("");
        console.log("Tax Preview Skipped: Missing required fields", { companyId, chargeCode, amountDue, dueDate, inDate });
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

        console.log("Tax Preview Response:", response.data);

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
        toast.error("Tax Preview Error:" + err.message);
      }
    };

    fetchTaxPreview();
  }, [chargeCode, amountDue, dueDate, inDate, reason]);

  const handleBuildingChange = (buildingId) => {
    setBuilding(buildingId);
    setUnit("");
    setTenancyContract("");
    setUnits([]);
    setTenancies([]);
    if (buildingId) {
      fetchUnits(buildingId);
    }
    setError("");
  };

  const handleUnitChange = (unitId) => {
    setUnit(unitId);
    setTenancyContract("");
    setTenancies([]);
    if (unitId) {
      fetchTenancies(unitId);
    }
    setError("");
  };

  const handleUpdate = async () => {
    if (!tenancyContract || !chargeCode || !reason || !dueDate || !amountDue || !status || !inDate) {
      setError("Please fill all required fields (Tenancy Contract, Charge Code, Reason, In Date, Due Date, Amount Due, Status)");
      toast.error("Please fill all required fields (Tenancy Contract, Charge Code, Reason, In Date, Due Date, Amount Due, Status)");
      console.log("Validation Failed: Missing fields", { tenancyContract, chargeCode, reason, inDate, dueDate, amountDue, status });
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
      remarks,
    };

    console.log("Form Data for Update:", formData);

    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}/company/additional-charges/${modalState.data.id}/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Update Response:", response.data);

      if (response.data.success) {
        toast.success("Additional charge updated successfully")
        triggerRefresh();
        closeModal();
      } else {
        setError(response.data.message || "Failed to update additional charge");
        toast.error(response.data.message || "Failed to update additional charge");
      }
    } catch (err) {
      setError("Error updating additional charge: " + err.message);
      toast.error("Error Updating additional charge:", err.message);
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
            <X size={20} />
          </button>
        </div>

        <div className="md:p-6 mt-[-15px]">
          <div className="grid uc-grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block update-charges-label">Select Building*</label>
              <div className="relative">
                <select
                  value={building}
                  disabled={true}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  onFocus={() => setIsSelectOpenBuilding(true)}
                  onBlur={() => setIsSelectOpenBuilding(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    !building ? "update-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled>Choose Building</option>
                  {buildings.map((buildingItem) => (
                    <option key={buildingItem.id} value={buildingItem.id}>
                      {buildingItem.building_name} ({buildingItem.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      isSelectOpenBuilding ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Select Unit*</label>
              <div className="relative">
                <select
                  value={unit}
                  disabled={true}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  onFocus={() => setIsSelectOpenUnit(true)}
                  onBlur={() => setIsSelectOpenUnit(false)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-selection ${
                    !unit ? "update-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled>Choose Unit</option>
                  {units.map((unitItem) => (
                    <option key={unitItem.id} value={unitItem.id}>
                      {unitItem.unit_name} ({unitItem.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      isSelectOpenUnit ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block update-charges-label">Tenancy Contract*</label>
              <div className="relative">
                <select
                  value={tenancyContract}
                  disabled={true}
                  onChange={(e) => {
                    setTenancyContract(e.target.value);
                    setError("");
                    console.log("Selected Tenancy:", e.target.value);
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
              <label className="block update-charges-label">In Date*</label>
              <input
                type="date"
                value={inDate}
                onChange={(e) => {
                  setInDate(e.target.value);
                  setError("");
                  console.log("Selected In Date:", e.target.value);
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
                  console.log("Selected Due Date:", e.target.value);
                }}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
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
                    console.log("Selected Charge Code:", e.target.value);
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
              <label className="block update-charges-label">Reason*</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                  console.log("Reason:", e.target.value);
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
                  console.log("Amount Due:", e.target.value);
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
                    console.log("Tax Amount:", e.target.value);
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
                    console.log("Selected Status:", e.target.value);
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
                  console.log("Remarks:", e.target.value);
                }}
                placeholder="Enter Remarks"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 update-charges-input"
              />
            </div>
          </div>
          <div className="flex items-end justify-end mt-7 mb-1">
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
  );
};

export default UpdateAdditionalCharges;