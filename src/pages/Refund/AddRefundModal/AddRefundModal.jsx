import React, { useState, useEffect } from "react";
import "./AddRefundModal.css";
import { ChevronDown, X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const AddRefundModal = () => {
  const { modalState, closeModal } = useModal();
  const [form, setForm] = useState({
    selectCompany: "",
    selectBuilding: "",
    selectUnit: "",
    selectTenancy: "",
    endDate: "",
    paymentDate: "",
    paymentMethod: "",
    referenceNumber: "",
    accountHolderName: "",
    accountNumber: "",
    chequeNumber: "",
    chequeDate: "",
    remarks: "",
    amountToRefund: "",
  });
  const [refundData, setRefundData] = useState({
    depositAmount: 0,
    excessAmount: 0,
    totalRefundable: 0,
    alreadyRefunded: 0,
    refundItems: [],
  });
  const [companies, setCompanies] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isSelectOpenCompany, setIsSelectOpenCompany] = useState(false);
  const [isSelectOpenBuilding, setIsSelectOpenBuilding] = useState(false);
  const [isSelectOpenUnit, setIsSelectOpenUnit] = useState(false);
  const [isSelectOpenTenancy, setIsSelectOpenTenancy] = useState(false);
  const [isSelectOpenPaymentMethod, setIsSelectOpenPaymentMethod] =
    useState(false);

  const getUserCompanyId = () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();
      if (role === "company") {
        return localStorage.getItem("company_id");
      } else if (role === "user" || role === "admin") {
        const userCompanyId = localStorage.getItem("company_id");
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      }
      return null;
    } catch (e) {
      console.error("Error getting user company ID:", e);
      return null;
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      setError("");
      const role = localStorage.getItem("role")?.toLowerCase();
      if (role === "company") {
        const companyId = getUserCompanyId();
        if (companyId) {
          setCompanies([{ id: companyId, name: "Current Company" }]);
          setForm((prev) => ({ ...prev, selectCompany: companyId }));
        }
      } else {
        const response = await axios.get(`${BASE_URL}/company/companies/`);
        if (response.data && Array.isArray(response.data)) {
          setCompanies(response.data);
        } else {
          setCompanies([]);
          setError("No companies found");
          toast.error("No companies found");
        }
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch companies");
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const companyId = form.selectCompany || getUserCompanyId();
      if (!companyId) {
        setError("No company selected");
        toast.error("No company selected");
        return;
      }
      setLoading(true);
      setError("");
      setError("");
      const response = await axios.get(
        `${BASE_URL}/company/buildings/occupied/${companyId}/`
      );
      if (response.data && Array.isArray(response.data)) {
        const sortedBuildings = response.data.sort((a, b) => a.id - b.id);
        setBuildings(sortedBuildings);
      } else {
        setBuildings([]);
        setError("No buildings found");
        toast.error("No buildings found");
      }
    } catch (err) {
      console.error("Error fetching buildings:", err);
      setError("Failed to fetch buildings");
      toast.error("Failed to fetch buildings");
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (buildingId) => {
    try {
      const companyId = form.selectCompany || getUserCompanyId();
      if (!companyId || !buildingId) {
        setError("Company or Building not selected");
        toast.error("Company or Building not selected");
        return;
      }
      setLoading(true);
      setError("");
      setError("");
      const response = await axios.get(
        `${BASE_URL}/company/units/${buildingId}/occupied-units/`
      );
      if (response.data && Array.isArray(response.data)) {
        const sortedUnits = response.data.sort((a, b) => a.id - b.id);
        setUnits(sortedUnits);
      } else {
        setUnits([]);
        setError("No units found");
        toast.error("No units found");
      }
    } catch (err) {
      console.error("Error fetching units:", err);
      setError("Failed to fetch units");
      toast.error("Failed to fetch units");
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenancies = async (unitId) => {
    try {
      const companyId = form.selectCompany || getUserCompanyId();
      if (!companyId || !unitId) {
        setError("Company or Unit not selected");
        toast.error("Company or Unit not selected");
        return;
      }
      setLoading(true);
      setError("");
      setError("");
      const response = await axios.get(
        `${BASE_URL}/company/tenancies/company/${companyId}/${unitId}/`
      );
      if (response.data && Array.isArray(response.data.results)) {
        const sortedTenancies = response.data.results.sort(
          (a, b) => a.id - b.id
        );
        setTenancies(sortedTenancies);
      } else {
        setTenancies([]);
        setError("No tenancies found");
        toast.error("No tenancies found");
      }
    } catch (err) {
      console.error("Error fetching tenancies:", err);
      setError("Failed to fetch tenancies");
      toast.error("Failed to fetch tenancies");
      setTenancies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExcessDeposits = async (tenancyId) => {
    try {
      setLoading(true);
      setError("");
      setError("");
      const response = await axios.get(
        `${BASE_URL}/finance/${tenancyId}/excess-deposits/`
      );
      const data = response.data;
      if (data.deposit_amount || data.excess_amount) {
        setRefundData({
          depositAmount: data.deposit_amount || 0,
          excessAmount: data.excess_amount || 0,
          totalRefundable: data.total_refundable || 0,
          alreadyRefunded: data.already_refunded || 0,
          refundItems: data.refund_items || [],
        });
      } else {
        setRefundData({
          depositAmount: 0,
          excessAmount: 0,
          totalRefundable: 0,
          alreadyRefunded: 0,
          refundItems: [],
        });
        setError("No refundable items found for this tenancy");
        toast.error("No refundable items found for this tenancy");
      }
    } catch (err) {
      console.error("Error fetching refundable items:", err);
      setError("Failed to load refundable items");
      toast.error("Failed to load refundable items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (form.selectCompany) {
      fetchBuildings();
      setForm((prev) => ({
        ...prev,
        selectBuilding: "",
        selectUnit: "",
        selectTenancy: "",
        amountToRefund: "",
      }));
      setUnits([]);
      setTenancies([]);
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
    }
  }, [form.selectCompany]);

  useEffect(() => {
    if (form.selectBuilding) {
      fetchUnits(form.selectBuilding);
      setForm((prev) => ({
        ...prev,
        selectUnit: "",
        selectTenancy: "",
        amountToRefund: "",
      }));
      setTenancies([]);
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
    }
  }, [form.selectBuilding]);

  useEffect(() => {
    if (form.selectUnit) {
      fetchTenancies(form.selectUnit);
      setForm((prev) => ({
        ...prev,
        selectTenancy: "",
        amountToRefund: "",
      }));
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
    }
  }, [form.selectUnit]);

  useEffect(() => {
    if (form.selectTenancy) {
      fetchExcessDeposits(form.selectTenancy);
    }
  }, [form.selectTenancy]);

  useEffect(() => {
    if (modalState.isOpen) {
      const companyId = getUserCompanyId();
      setForm({
        selectCompany: companyId || "",
        selectBuilding: "",
        selectUnit: "",
        selectTenancy: "",
        endDate: "",
        paymentDate: "",
        paymentMethod: "",
        referenceNumber: "",
        accountHolderName: "",
        accountNumber: "",
        chequeNumber: "",
        chequeDate: "",
        remarks: "",
        amountToRefund: "",
      });
      setRefundData({
        depositAmount: 0,
        excessAmount: 0,
        totalRefundable: 0,
        alreadyRefunded: 0,
        refundItems: [],
      });
      setError("");
      setError("");
      setBuildings([]);
      setUnits([]);
      setTenancies([]);
      if (companyId) {
        setForm((prev) => ({ ...prev, selectCompany: companyId }));
      }
    }
  }, [modalState.isOpen]);

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) {
      console.error(`Invalid date format: ${dateStr}, expected YYYY-MM-DD`);
      return "";
    }
    return dateStr;
  };

  const handleSave = async () => {
    const {
      selectTenancy,
      paymentDate,
      paymentMethod,
      amountToRefund,
      accountHolderName,
      accountNumber,
      referenceNumber,
      chequeNumber,
      chequeDate,
    } = form;
    const { totalRefundable, alreadyRefunded } = refundData;

    let requiredFields = [
      selectTenancy,
      paymentDate,
      paymentMethod,
      amountToRefund,
    ];
    if (paymentMethod === "bank_transfer" || paymentMethod === "cheque") {
      requiredFields.push(accountHolderName, accountNumber, referenceNumber);
    }
    if (paymentMethod === "cheque") {
      requiredFields.push(chequeNumber, chequeDate);
    }

    if (!requiredFields.every((field) => field)) {
      setError("Please fill all required fields.");
      toast.error("Please fill all required fields.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) {
      setError(
        "Invalid payment date format. Please select a valid date (YYYY-MM-DD)."
      );
      toast.error(
        "Invalid payment date format. Please select a valid date (YYYY-MM-DD)."
      );
      return;
    }
    if (paymentMethod === "cheque" && !/^\d{4}-\d{2}-\d{2}$/.test(chequeDate)) {
      setError(
        "Invalid cheque date format. Please select a valid date (YYYY-MM-DD)."
      );
      toast.error(
        "Invalid cheque date format. Please select a valid date (YYYY-MM-DD)."
      );
      return;
    }

    if (
      parseFloat(amountToRefund) <= 0 ||
      parseFloat(amountToRefund) > totalRefundable - alreadyRefunded
    ) {
      setError("Please enter a valid refund amount");
      toast.error("Please enter a valid refund amount");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setError("");
      const payload = {
        tenancy_id: parseInt(selectTenancy),
        amount_refunded: parseFloat(amountToRefund),
        collection_mode: paymentMethod,
        payment_date: formatDateForBackend(paymentDate),
        remarks: form.remarks || "",
        reference_number: referenceNumber || null,
        ...(paymentMethod === "bank_transfer" || paymentMethod === "cheque"
          ? {
              account_holder_name: accountHolderName,
              account_number: accountNumber,
            }
          : {}),
        ...(paymentMethod === "cheque"
          ? {
              cheque_number: chequeNumber,
              cheque_date: formatDateForBackend(chequeDate),
            }
          : {}),
      };

      const response = await axios.post(
        `${BASE_URL}/finance/create/refund/`,
        payload
      );
      console.log("Refund created:", response.data);
      toast.success("Refund created successfully!");
      toast.success("Refund created successfully!");
      closeModal();
    } catch (err) {
      console.error("Failed to create refund:", err);
      setError("Failed to create refund. Please try again.");
      toast.error("Failed to create refund. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!modalState.isOpen || modalState.type !== "create-refund") {
    return null;
  }

  const role = localStorage.getItem("role")?.toLowerCase();
  const showCompanyDropdown = role !== "company";

  return (
    <div className="add-refund-modal-wrapper">
      <Toaster />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 add-refund-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 add-refund-modal-container">
          {/* Header */}
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] add-refund-head">Create Refund</h2>
            <button
              onClick={closeModal}
              className="add-refund-close-btn hover:bg-gray-100 duration-200"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="px-6 py-2 bg-blue-100 text-blue-700 text-sm">
              Loading...
            </div>
          )}

          {/* Scrollable Content */}
          <div className="md:p-6 md:mt-[-15px]">
            <div className="grid gap-6 add-refund-modal-grid">
              {showCompanyDropdown && (
                <div className="space-y-2">
                  <label className="block add-refund-label">
                    Select Company*
                  </label>
                  <div className="relative">
                    <select
                      value={form.selectCompany}
                      onChange={(e) => {
                        updateForm("selectCompany", e.target.value);
                        if (e.target.value === "") {
                          e.target.classList.add("add-refund-selected");
                        } else {
                          e.target.classList.remove("add-refund-selected");
                        }
                      }}
                      onFocus={() => setIsSelectOpenCompany(true)}
                      onBlur={() => setIsSelectOpenCompany(false)}
                      className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-selection ${
                        form.selectCompany === "" ? "add-refund-selected" : ""
                      }`}
                      disabled={loading}
                    >
                      <option value="" disabled hidden>
                        Choose Company
                      </option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name || `Company ${company.id}`}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown
                        size={16}
                        className={`text-[#201D1E] transition-transform duration-300 ${
                          isSelectOpenCompany ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block add-refund-label">
                  Select Building*
                </label>
                <div className="relative">
                  <select
                    value={form.selectBuilding}
                    onChange={(e) => {
                      updateForm("selectBuilding", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("add-refund-selected");
                      } else {
                        e.target.classList.remove("add-refund-selected");
                      }
                    }}
                    onFocus={() => setIsSelectOpenBuilding(true)}
                    onBlur={() => setIsSelectOpenBuilding(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-selection ${
                      form.selectBuilding === "" ? "add-refund-selected" : ""
                    }`}
                    disabled={!form.selectCompany || loading}
                  >
                    <option value="" disabled hidden>
                      Choose Building
                    </option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.building_name || `Building ${building.id}`}
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
                <label className="block add-refund-label">Select Unit*</label>
                <div className="relative">
                  <select
                    value={form.selectUnit}
                    onChange={(e) => {
                      updateForm("selectUnit", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("add-refund-selected");
                      } else {
                        e.target.classList.remove("add-refund-selected");
                      }
                    }}
                    onFocus={() => setIsSelectOpenUnit(true)}
                    onBlur={() => setIsSelectOpenUnit(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-selection ${
                      form.selectUnit === "" ? "add-refund-selected" : ""
                    }`}
                    disabled={!form.selectBuilding || loading}
                  >
                    <option value="" disabled hidden>
                      Choose Unit
                    </option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unit_name || `Unit ${unit.id}`}
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
                <label className="block add-refund-label">
                  Select Tenancy*
                </label>
                <div className="relative">
                  <select
                    value={form.selectTenancy}
                    onChange={(e) => {
                      updateForm("selectTenancy", e.target.value);
                      if (e.target.value === "") {
                        e.target.classList.add("add-refund-selected");
                      } else {
                        e.target.classList.remove("add-refund-selected");
                      }
                    }}
                    onFocus={() => setIsSelectOpenTenancy(true)}
                    onBlur={() => setIsSelectOpenTenancy(false)}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-selection ${
                      form.selectTenancy === "" ? "add-refund-selected" : ""
                    }`}
                    disabled={!form.selectUnit || loading}
                  >
                    <option value="" disabled hidden>
                      Choose Tenancy
                    </option>
                    {tenancies.map((tenancy) => (
                      <option key={tenancy.id} value={tenancy.id}>
                        {tenancy.tenant_name || `Tenancy ${tenancy.id}`}
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

                {/* Refund Summary Section */}
                <div className="add-refund-modal-table-wrapper">
                  <div className="mt-[5px]">
                    <h3 className="mb-5 -mt-3 refund-section-title">Refund Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-1.5 add-refund-label">Deposit Amount</p>
                        <p className="text-[#1458A2] refund-amount-value">
                          ${refundData.depositAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1.5 add-refund-label">Excess Amount</p>
                        <p className="text-[#1458A2] refund-amount-value">
                          ${refundData.excessAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Amount Section */}
                <div className="add-refund-modal-table-wrapper">
                  <div className="mt-[5px]">
                    <h3 className="text-lg font-semibold mb-5 -mt-3 refund-section-title">Refund Amount</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="mb-1.5 add-refund-label">Total Refundable</p>
                        <p className="text-[#1458A2] refund-amount-value">
                          ${refundData.totalRefundable.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1.5 add-refund-label">Already Refunded</p>
                        <p className="text-[#1458A2] refund-amount-value">
                          ${refundData.alreadyRefunded.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block add-refund-label">
                    Amount to Refund*
                  </label>
                  <input
                    type="number"
                    value={form.amountToRefund}
                    onChange={(e) => updateForm("amountToRefund", e.target.value)}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block add-refund-label">
                    Amount to Refund*
                  </label>
                  <input
                    type="number"
                    value={form.amountToRefund}
                    onChange={(e) => updateForm("amountToRefund", e.target.value)}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block add-refund-label">Payment Date*</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.paymentDate}
                      onChange={(e) => updateForm("paymentDate", e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block add-refund-label">Payment Date*</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.paymentDate}
                      onChange={(e) => updateForm("paymentDate", e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block add-refund-label">
                    Payment Method*
                  </label>
                  <div className="relative">
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => {
                        updateForm("paymentMethod", e.target.value);
                        if (e.target.value === "") {
                          e.target.classList.add("add-refund-selected");
                        } else {
                          e.target.classList.remove("add-refund-selected");
                        }
                      }}
                      onFocus={() => setIsSelectOpenPaymentMethod(true)}
                      onBlur={() => setIsSelectOpenPaymentMethod(false)}
                      className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-selection ${
                        form.paymentMethod === "" ? "add-refund-selected" : ""
                      }`}
                      disabled={loading}
                    >
                      <option value="" disabled hidden>
                        Choose
                      </option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cheque">Cheque</option>
                      <option value="online_payment">Online Payment</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown
                        size={16}
                        className={`text-[#201D1E] transition-transform duration-300 ${
                          isSelectOpenPaymentMethod ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block add-refund-label">
                    Payment Method*
                  </label>
                  <div className="relative">
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => {
                        updateForm("paymentMethod", e.target.value);
                        if (e.target.value === "") {
                          e.target.classList.add("add-refund-selected");
                        } else {
                          e.target.classList.remove("add-refund-selected");
                        }
                      }}
                      onFocus={() => setIsSelectOpenPaymentMethod(true)}
                      onBlur={() => setIsSelectOpenPaymentMethod(false)}
                      className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-selection ${
                        form.paymentMethod === "" ? "add-refund-selected" : ""
                      }`}
                      disabled={loading}
                    >
                      <option value="" disabled hidden>
                        Choose
                      </option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cheque">Cheque</option>
                      <option value="online_payment">Online Payment</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown
                        size={16}
                        className={`text-[#201D1E] transition-transform duration-300 ${
                          isSelectOpenPaymentMethod ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-1">
                  <label className="block add-refund-label">Remarks</label>
                  <input
                    type="text"
                    value={form.remarks}
                    onChange={(e) => updateForm("remarks", e.target.value)}
                    placeholder="Enter Remarks"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 mb-1">
                  <label className="block add-refund-label">Remarks</label>
                  <input
                    type="text"
                    value={form.remarks}
                    onChange={(e) => updateForm("remarks", e.target.value)}
                    placeholder="Enter Remarks"
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                    disabled={loading}
                  />
                </div>

                {(form.paymentMethod === "bank_transfer" ||
                  form.paymentMethod === "cheque") && (
                  <>
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Account Holder Name*
                      </label>
                      <input
                        type="text"
                        value={form.accountHolderName}
                        onChange={(e) =>
                          updateForm("accountHolderName", e.target.value)
                        }
                        placeholder="Enter Account Holder Name"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>
                {(form.paymentMethod === "bank_transfer" ||
                  form.paymentMethod === "cheque") && (
                  <>
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Account Holder Name*
                      </label>
                      <input
                        type="text"
                        value={form.accountHolderName}
                        onChange={(e) =>
                          updateForm("accountHolderName", e.target.value)
                        }
                        placeholder="Enter Account Holder Name"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Account Number*
                      </label>
                      <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) =>
                          updateForm("accountNumber", e.target.value)
                        }
                        placeholder="Enter Account Number"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Account Number*
                      </label>
                      <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) =>
                          updateForm("accountNumber", e.target.value)
                        }
                        placeholder="Enter Account Number"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Reference Number*
                      </label>
                      <input
                        type="text"
                        value={form.referenceNumber}
                        onChange={(e) =>
                          updateForm("referenceNumber", e.target.value)
                        }
                        placeholder="Enter Reference Number"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Reference Number*
                      </label>
                      <input
                        type="text"
                        value={form.referenceNumber}
                        onChange={(e) =>
                          updateForm("referenceNumber", e.target.value)
                        }
                        placeholder="Enter Reference Number"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                {form.paymentMethod === "cheque" && (
                  <>
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Cheque Number*
                      </label>
                      <input
                        type="text"
                        value={form.chequeNumber}
                        onChange={(e) =>
                          updateForm("chequeNumber", e.target.value)
                        }
                        placeholder="Enter Cheque Number"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>
                {form.paymentMethod === "cheque" && (
                  <>
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Cheque Number*
                      </label>
                      <input
                        type="text"
                        value={form.chequeNumber}
                        onChange={(e) =>
                          updateForm("chequeNumber", e.target.value)
                        }
                        placeholder="Enter Cheque Number"
                        className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Cheque Date*
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={form.chequeDate}
                          onChange={(e) =>
                            updateForm("chequeDate", e.target.value)
                          }
                          className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Detailed Refund Items Table */}
                {refundData.refundItems.length > 0 && (
                  <div className="add-refund-modal-table-wrapper">
                    <div className="mt-[10px]">
                      <h3 className="mb-5 -mt-3 refund-section-title">Detailed Breakdown</h3>
                      <div className="overflow-x-auto border border-[#E9E9E9] rounded-md add-refund-modal-overflow-x-auto">
                        <div className="add-refund-modal-desktop-table">
                          <table className="w-full border-collapse add-refund-modal-table">
                            <thead>
                              <tr className="border-b border-[#E9E9E9] h-[57px]">
                                <th className="!pl-[10px] text-left refund-modal-thead uppercase w-[100px] last:border-r-0">Charge</th>
                                <th className="text-left refund-modal-thead uppercase w-[100px]">Date</th>
                                <th className="text-left refund-modal-thead uppercase w-[100px] ">Amount</th>
                                <th className="text-left refund-modal-thead uppercase w-[80px]">Tax</th>
                                <th className="text-left refund-modal-thead uppercase w-[80px]">Total</th>
                                <th className="text-left refund-modal-thead uppercase w-[80px]">Excess</th>
                                <th className="text-left refund-modal-thead uppercase w-[140px]">Total Refundable</th>
                                <th className="text-left refund-modal-thead uppercase w-[150px]">Invoice Collections</th>
                              </tr>
                            </thead>
                            <tbody>
                              {refundData.refundItems.map((item, index) => (
                                <tr key={`${item.type}-${item.id}`} className="border-b h-[57px] last:border-0 hover:bg-gray-100">
                                  <td className="!pl-[10px] text-left text-[#201D1E]">{item.charge_type}</td>
                                  <td className="text-left text-[#201D1E]">{item.due_date}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.original_amount).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.tax).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.total).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.excess_amount).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.total_refundable).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E] last:border-r-0">
                                    {Object.entries(item.collections_per_invoice).map(([invoice, amount]) => (
                                      <div key={invoice}>{`${invoice}: $${Number(amount).toFixed(2)}`}</div>
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="add-refund-modal-mobile-table">
                          {refundData.refundItems.map((item, index) => (
                            <div key={`${item.type}-${item.id}`} className="add-refund-modal-mobile-section">
                              <div className="add-refund-modal-mobile-header flex justify-start border-b border-[#E9E9E9] h-[50px]">
                                <div className="px-[10px] flex w-[51%] items-center add-refund-modal-mobile-thead uppercase">Charge</div>
                              </div>
                              <div className="flex justify-between border-b border-[#E9E9E9]">
                                <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">{item.charge_type}</div>
                              </div>

                              <div className="add-refund-modal-mobile-header flex justify-between border-b border-[#E9E9E9] h-[50px]">
                                <div className="px-[10px] w-[20%] flex items-center add-refund-modal-mobile-thead uppercase">Date</div>
                                <div className="px-[10px] flex items-center add-refund-modal-mobile-thead uppercase">Amount</div>
                                <div className="px-[10px] w-[15%] flex items-center add-refund-modal-mobile-thead uppercase">Tax</div>
                              </div>
                              <div className="flex justify-between border-b border-[#E9E9E9]">
                                <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">{item.due_date}</div>
                                <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">${Number(item.original_amount).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] w-[20%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.tax).toFixed(2)}</div>
                              </div>

                              <div className="add-refund-modal-mobile-header flex justify-between border-b border-[#E9E9E9] h-[50px]">
                                <div className="px-[10px] w-[16%] flex items-center add-refund-modal-mobile-thead uppercase">Total</div>
                                <div className="px-[10px] w-[22%] flex items-center add-refund-modal-mobile-thead uppercase">Excess</div>
                                <div className="px-[10px] w-[42%] flex items-center add-refund-modal-mobile-thead uppercase">Total Refundable</div>
                                <div className="px-[10px] w-[19%] flex items-center add-refund-modal-mobile-thead uppercase">Collections</div>
                              </div>
                              <div className="flex justify-between">
                                <div className="px-[10px] py-[5px] w-[18%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.total).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] w-[20%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.excess_amount).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] w-[42%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.total_refundable).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                                  {Object.entries(item.collections_per_invoice).map(([invoice, amount]) => (
                                    <div key={invoice}>{`${invoice}: $${Number(amount).toFixed(2)}`}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex mt-5 items-end justify-end mb-1">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className={`bg-[#2892CE] text-white add-refund-save-btn duration-200 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Processing..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
                    <div className="space-y-2">
                      <label className="block add-refund-label">
                        Cheque Date*
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={form.chequeDate}
                          onChange={(e) =>
                            updateForm("chequeDate", e.target.value)
                          }
                          className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-refund-input"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Detailed Refund Items Table */}
                {refundData.refundItems.length > 0 && (
                  <div className="add-refund-modal-table-wrapper">
                    <div className="mt-[10px]">
                      <h3 className="mb-5 -mt-3 refund-section-title">Detailed Breakdown</h3>
                      <div className="overflow-x-auto border border-[#E9E9E9] rounded-md add-refund-modal-overflow-x-auto">
                        <div className="add-refund-modal-desktop-table">
                          <table className="w-full border-collapse add-refund-modal-table">
                            <thead>
                              <tr className="border-b border-[#E9E9E9] h-[57px]">
                                <th className="!pl-[10px] text-left refund-modal-thead uppercase w-[100px] last:border-r-0">Charge</th>
                                <th className="text-left refund-modal-thead uppercase w-[100px]">Date</th>
                                <th className="text-left refund-modal-thead uppercase w-[100px] ">Amount</th>
                                <th className="text-left refund-modal-thead uppercase w-[80px]">Tax</th>
                                <th className="text-left refund-modal-thead uppercase w-[80px]">Total</th>
                                <th className="text-left refund-modal-thead uppercase w-[80px]">Excess</th>
                                <th className="text-left refund-modal-thead uppercase w-[140px]">Total Refundable</th>
                                <th className="text-left refund-modal-thead uppercase w-[150px]">Invoice Collections</th>
                              </tr>
                            </thead>
                            <tbody>
                              {refundData.refundItems.map((item, index) => (
                                <tr key={`${item.type}-${item.id}`} className="border-b h-[57px] last:border-0 hover:bg-gray-100">
                                  <td className="!pl-[10px] text-left text-[#201D1E]">{item.charge_type}</td>
                                  <td className="text-left text-[#201D1E]">{item.due_date}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.original_amount).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.tax).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.total).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.excess_amount).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E]">${Number(item.total_refundable).toFixed(2)}</td>
                                  <td className="text-left text-[#201D1E] last:border-r-0">
                                    {Object.entries(item.collections_per_invoice).map(([invoice, amount]) => (
                                      <div key={invoice}>{`${invoice}: $${Number(amount).toFixed(2)}`}</div>
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="add-refund-modal-mobile-table">
                          {refundData.refundItems.map((item, index) => (
                            <div key={`${item.type}-${item.id}`} className="add-refund-modal-mobile-section">
                              <div className="add-refund-modal-mobile-header flex justify-start border-b border-[#E9E9E9] h-[50px]">
                                <div className="px-[10px] flex w-[51%] items-center add-refund-modal-mobile-thead uppercase">Charge</div>
                              </div>
                              <div className="flex justify-between border-b border-[#E9E9E9]">
                                <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">{item.charge_type}</div>
                              </div>

                              <div className="add-refund-modal-mobile-header flex justify-between border-b border-[#E9E9E9] h-[50px]">
                                <div className="px-[10px] w-[20%] flex items-center add-refund-modal-mobile-thead uppercase">Date</div>
                                <div className="px-[10px] flex items-center add-refund-modal-mobile-thead uppercase">Amount</div>
                                <div className="px-[10px] w-[15%] flex items-center add-refund-modal-mobile-thead uppercase">Tax</div>
                              </div>
                              <div className="flex justify-between border-b border-[#E9E9E9]">
                                <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">{item.due_date}</div>
                                <div className="px-[10px] py-[10px] w-full text-[14px] font-normal text-[#201D1E]">${Number(item.original_amount).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] w-[20%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.tax).toFixed(2)}</div>
                              </div>

                              <div className="add-refund-modal-mobile-header flex justify-between border-b border-[#E9E9E9] h-[50px]">
                                <div className="px-[10px] w-[16%] flex items-center add-refund-modal-mobile-thead uppercase">Total</div>
                                <div className="px-[10px] w-[22%] flex items-center add-refund-modal-mobile-thead uppercase">Excess</div>
                                <div className="px-[10px] w-[42%] flex items-center add-refund-modal-mobile-thead uppercase">Total Refundable</div>
                                <div className="px-[10px] w-[19%] flex items-center add-refund-modal-mobile-thead uppercase">Collections</div>
                              </div>
                              <div className="flex justify-between">
                                <div className="px-[10px] py-[5px] w-[18%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.total).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] w-[20%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.excess_amount).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] w-[42%] flex items-center text-[14px] font-normal text-[#201D1E]">${Number(item.total_refundable).toFixed(2)}</div>
                                <div className="px-[10px] py-[5px] flex items-center text-[14px] font-normal text-[#201D1E]">
                                  {Object.entries(item.collections_per_invoice).map(([invoice, amount]) => (
                                    <div key={invoice}>{`${invoice}: $${Number(amount).toFixed(2)}`}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex mt-5 items-end justify-end mb-1">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className={`bg-[#2892CE] text-white add-refund-save-btn duration-200 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Processing..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddRefundModal;