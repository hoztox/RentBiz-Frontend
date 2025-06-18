import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateTenancyModal.css";
import { X, Trash2, Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";

const CreateTenancyModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const navigate = useNavigate();
  const [selectOpenStates, setSelectOpenStates] = useState({});
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  const [taxModalData, setTaxModalData] = useState({
    isOpen: false,
    chargeId: null,
    taxDetails: [],
  });
  const [loading, setLoading] = useState(true); // New: Loading state
  const [error, setError] = useState(null); // New: Error state

  // API data states
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [paymentSchedule, setPaymentSchedule] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    tenant: "",
    building: "",
    unit: "",
    rental_months: "",
    start_date: "",
    end_date: "",
    no_payments: "",
    first_rent_due_on: "",
    rent_per_frequency: "",
    deposit: "",
    commission: "",
    remarks: "",
    total_receivable: "0.00",
  });

  const [additionalCharges, setAdditionalCharges] = useState([
    {
      id: "01",
      charge_type: "",
      reason: "",
      due_date: "",
      amount: "",
      tax: "0.00",
      total: "0.00",
      tax_details: [],
    },
  ]);

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

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }
    return null;
  };

  // Fetch tenants, buildings, and charge types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = getUserCompanyId();
        if (!companyId) throw new Error("Company ID not found");

        setLoading(true);
        setError(null);

        const [tenantsRes, buildingsRes, chargeTypesRes] = await Promise.all([
          axios.get(`${BASE_URL}/company/tenant/company/${companyId}/`),
          axios.get(`${BASE_URL}/company/buildings/vacant/${companyId}/`),
          axios.get(`${BASE_URL}/company/charges/company/${companyId}/`),
        ]);

        // Ensure tenants is an array
        setTenants(Array.isArray(tenantsRes.data) ? tenantsRes.data : tenantsRes.data.results || []);
        setBuildings(Array.isArray(buildingsRes.data) ? buildingsRes.data : buildingsRes.data.results || []);
        setChargeTypes(Array.isArray(chargeTypesRes.data) ? chargeTypesRes.data : chargeTypesRes.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setTenants([]);
        setBuildings([]);
        setChargeTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch units when building changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (formData.building) {
        try {
          setLoading(true);
          const response = await axios.get(
            `${BASE_URL}/company/units/${formData.building}/vacant-units/`
          );
          setUnits(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (error) {
          console.error("Error fetching units:", error);
          setUnits([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUnits([]);
      }
    };
    fetchUnits();
  }, [formData.building]);

  // Update end_date, first_rent_due_on, and total_receivable
  useEffect(() => {
    if (formData.start_date && formData.rental_months) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + parseInt(formData.rental_months));
      endDate.setDate(endDate.getDate() - 1);
      setFormData((prev) => ({
        ...prev,
        end_date: endDate.toISOString().split("T")[0],
        first_rent_due_on: prev.first_rent_due_on || formData.start_date,
      }));
    }

    if (formData.start_date && !formData.first_rent_due_on) {
      setFormData((prev) => ({
        ...prev,
        first_rent_due_on: formData.start_date,
      }));
    }

    if (formData.rental_months && formData.rent_per_frequency) {
      const total = (
        parseInt(formData.rental_months) * parseFloat(formData.rent_per_frequency || 0)
      ).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        total_receivable: total,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        total_receivable: "0.00",
      }));
    }
  }, [formData.start_date, formData.rental_months, formData.rent_per_frequency]);

  // Reset payment schedule when relevant form fields change
  useEffect(() => {
    setShowPaymentSchedule(false);
    setPaymentSchedule([]);
  }, [
    formData.rental_months,
    formData.no_payments,
    formData.first_rent_due_on,
    formData.rent_per_frequency,
    formData.deposit,
    formData.commission,
    formData.start_date,
  ]);

  // Fetch payment schedule preview when showPaymentSchedule is true
  useEffect(() => {
    const fetchPaymentSchedulePreview = async () => {
      const companyId = getUserCompanyId();
      if (
        showPaymentSchedule &&
        companyId &&
        formData.rental_months &&
        formData.no_payments &&
        formData.first_rent_due_on &&
        formData.start_date &&
        (formData.rent_per_frequency || formData.deposit || formData.commission)
      ) {
        try {
          const previewPayload = {
            company: companyId,
            rental_months: parseInt(formData.rental_months),
            no_payments: parseInt(formData.no_payments),
            first_rent_due_on: formData.first_rent_due_on,
            rent_per_frequency: parseFloat(formData.rent_per_frequency || 0),
            deposit: parseFloat(formData.deposit || 0),
            commission: parseFloat(formData.commission || 0),
            start_date: formData.start_date,
          };

          const response = await axios.post(
            `${BASE_URL}/company/tenancies/preview-payment-schedule/`,
            previewPayload
          );
          setPaymentSchedule(response.data.payment_schedules || []);
        } catch (error) {
          console.error("Error fetching payment schedule preview:", error);
          setPaymentSchedule([]);
        }
      }
    };

    fetchPaymentSchedulePreview();
  }, [showPaymentSchedule]);

  // Fetch tax preview for additional charges when charge_type, amount, or due_date changes
  useEffect(() => {
    const fetchTaxPreview = async (charge) => {
      const companyId = getUserCompanyId();
      if (
        companyId &&
        charge.charge_type &&
        charge.amount &&
        charge.due_date &&
        charge.reason
      ) {
        try {
          const previewPayload = {
            company: companyId,
            charge_type: parseInt(charge.charge_type),
            amount: parseFloat(charge.amount),
            due_date: charge.due_date,
            reason: charge.reason,
          };

          const response = await axios.post(
            `${BASE_URL}/company/tenancies/preview-additional-charge-tax/`,
            previewPayload
          );
          const { additional_charge } = response.data;

          setAdditionalCharges((prev) =>
            prev.map((c) =>
              c.id === charge.id
                ? {
                    ...c,
                    tax: additional_charge.tax.toFixed(2),
                    total: additional_charge.total.toFixed(2),
                    tax_details: additional_charge.tax_details,
                  }
                : c
            )
          );
        } catch (error) {
          console.error("Error fetching tax preview for additional charge:", error);
          setAdditionalCharges((prev) =>
            prev.map((c) =>
              c.id === charge.id
                ? { ...c, tax: "0.00", total: c.amount || "0.00", tax_details: [] }
                : c
            )
          );
        }
      } else {
        setAdditionalCharges((prev) =>
          prev.map((c) =>
            c.id === charge.id
              ? { ...c, tax: "0.00", total: c.amount || "0.00", tax_details: [] }
              : c
          )
        );
      }
    };

    additionalCharges.forEach((charge) => {
      fetchTaxPreview(charge);
    });
  }, [
    JSON.stringify(
      additionalCharges.map(({ charge_type, amount, due_date, reason }) => ({
        charge_type,
        amount,
        due_date,
        reason,
      }))
    ),
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "building" ? { unit: "" } : {}),
    }));
  };

  const handleAdditionalChargeChange = (id, field, value) => {
    setAdditionalCharges((prev) =>
      prev.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const showTaxDetails = (chargeId, isAdditionalCharge = true) => {
    const charges = isAdditionalCharge ? additionalCharges : paymentSchedule;
    const charge = charges.find((c) => c.id === chargeId);
    if (charge && charge.tax_details) {
      setTaxModalData({
        isOpen: true,
        chargeId,
        taxDetails: charge.tax_details,
      });
    } else {
      setTaxModalData({
        isOpen: true,
        chargeId,
        taxDetails: [],
      });
    }
  };

  const addRow = () => {
    const newId = (additionalCharges.length + 1).toString().padStart(2, "0");
    setAdditionalCharges([
      ...additionalCharges,
      {
        id: newId,
        charge_type: "",
        reason: "",
        due_date: "",
        amount: "",
        tax: "0.00",
        total: "0.00",
        tax_details: [],
      },
    ]);
  };

  const removeRow = (id) => {
    setAdditionalCharges(additionalCharges.filter((charge) => charge.id !== id));
  };

  const toggleSelectOpen = (field) => {
    setSelectOpenStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const togglePaymentSchedule = () => {
    setShowPaymentSchedule(!showPaymentSchedule);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "tenant",
      "building",
      "unit",
      "rental_months",
      "start_date",
      "end_date",
      "no_payments",
      "first_rent_due_on",
      "remarks",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the ${field.replace("_", " ")} field`);
        return;
      }
    }
    for (const charge of additionalCharges) {
      if (
        !charge.charge_type ||
        !charge.reason ||
        !charge.due_date ||
        !charge.amount
      ) {
        alert("Please fill all fields in Additional Charges");
        return;
      }
    }

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    const payload = {
      company: companyId,
      user: userId,
      tenant: parseInt(formData.tenant),
      building: parseInt(formData.building),
      unit: parseInt(formData.unit),
      rental_months: parseInt(formData.rental_months),
      start_date: formData.start_date,
      end_date: formData.end_date,
      no_payments: parseInt(formData.no_payments),
      first_rent_due_on: formData.first_rent_due_on,
      rent_per_frequency: parseFloat(formData.rent_per_frequency || 0).toFixed(2),
      deposit: parseFloat(formData.deposit || 0).toFixed(2),
      commission: parseFloat(formData.commission || 0).toFixed(2),
      remarks: formData.remarks,
      total_receivable: parseFloat(formData.total_receivable || 0).toFixed(2),
      additional_charges: additionalCharges.map((charge) => ({
        charge_type: parseInt(charge.charge_type),
        reason: charge.reason,
        due_date: charge.due_date,
        amount: parseFloat(charge.amount).toFixed(2),
        tax: parseFloat(charge.tax).toFixed(2),
        total: parseFloat(charge.total).toFixed(2),
        tax_details: charge.tax_details,
      })),
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/company/tenancies/create/`,
        payload
      );
      console.log("Tenancy created successfully:", response.data);
      triggerRefresh();
      closeModal();
      navigate("/admin/tenancy-master");
    } catch (error) {
      console.error(
        "Error submitting tenancy:",
        error.response?.data || error.message
      );
      alert("Failed to create tenancy. Please try again.");
    }
  };

  const closeTaxModal = () => {
    setTaxModalData({ isOpen: false, chargeId: null, taxDetails: [] });
  };

  if (!modalState.isOpen || modalState.type !== "tenancy-create") return null;

  if (loading) {
    return (
      <div className="tenancy-modal-overlay">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tenancy-modal-overlay">
        <div className="flex items-center justify-center h-screen text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tenancy-modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="tenancy-modal-container"
      >
        <div className="md:p-8 md:pt-8">
          <div className="flex justify-between items-center md:mb-8">
            <h2 className="tenancy-modal-head">Create New Tenancy</h2>
            <button
              onClick={closeModal}
              className="tenancy-close-btn hover:bg-gray-100 duration-200"
              aria-label="Close modal"
            >
              <X size={24} color="#201D1E" />
            </button>
          </div>

          <div className="tenancy-modal-grid gap-6">
            <div>
              <label className="block tenancy-modal-label">Tenant*</label>
              <div className="relative">
                <select
                  name="tenant"
                  value={formData.tenant}
                  onChange={handleInputChange}
                  className="w-full p-2 appearance-none tenancy-input-box"
                  onFocus={() => toggleSelectOpen("tenant")}
                  onBlur={() => toggleSelectOpen("tenant")}
                >
                  <option value="">Choose</option>
                  {Array.isArray(tenants) ? (
                    tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.tenant_name || "Unnamed Tenant"}
                      </option>
                    ))
                  ) : (
                    <option disabled>No tenants available</option>
                  )}
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    selectOpenStates["tenant"] ? "rotate-180" : "rotate-0"
                  }`}
                  width={22}
                  height={22}
                  color="#201D1E"
                />
              </div>
            </div>
            <div>
              <label className="block tenancy-modal-label">Building*</label>
              <div className="relative">
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  className="w-full p-2 appearance-none tenancy-input-box"
                  onFocus={() => toggleSelectOpen("building")}
                  onBlur={() => toggleSelectOpen("building")}
                >
                  <option value="">Choose</option>
                  {Array.isArray(buildings) ? (
                    buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.building_name || "Unnamed Building"}
                      </option>
                    ))
                  ) : (
                    <option disabled>No buildings available</option>
                  )}
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    selectOpenStates["building"] ? "rotate-180" : "rotate-0"
                  }`}
                  width={22}
                  height={22}
                  color="#201D1E"
                />
              </div>
            </div>
            <div className="md:flex tenancy-modal-column gap-4">
              <div className="w-1/2">
                <label className="block tenancy-modal-label">Unit*</label>
                <div className="relative">
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full p-2 appearance-none tenancy-input-box"
                    onFocus={() => toggleSelectOpen("unit")}
                    onBlur={() => toggleSelectOpen("unit")}
                  >
                    <option value="">Choose</option>
                    {Array.isArray(units) ? (
                      units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unit_name || "Unnamed Unit"}
                        </option>
                      ))
                    ) : (
                      <option disabled>No units available</option>
                    )}
                  </select>
                  <ChevronDown
                    className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                      selectOpenStates["unit"] ? "rotate-180" : "rotate-0"
                    }`}
                    width={22}
                    height={22}
                    color="#201D1E"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block tenancy-modal-label">Rental Months*</label>
                <input
                  type="number"
                  name="rental_months"
                  value={formData.rental_months}
                  onChange={handleInputChange}
                  placeholder="Enter Rental Months"
                  className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  min="1"
                />
              </div>
            </div>
            <div className="md:flex tenancy-modal-column gap-4">
              <div className="w-1/2">
                <label className="block tenancy-modal-label">Start Date*</label>
                <div className="relative">
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block tenancy-modal-label">End Date*</label>
                <div className="relative">
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    readOnly
                    className="w-full p-2 pr-10 bg-gray-100 tenancy-input-box"
                  />
                </div>
              </div>
            </div>
            <div className="md:flex tenancy-modal-column gap-4">
              <div className="w-1/2">
                <label className="block tenancy-modal-label">No. of Payments*</label>
                <input
                  type="number"
                  name="no_payments"
                  value={formData.no_payments}
                  onChange={handleInputChange}
                  placeholder="Enter No. of Payments"
                  className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  min="1"
                />
              </div>
              <div className="w-1/2">
                <label className="block tenancy-modal-label">First Rent Due On*</label>
                <div className="relative">
                  <input
                    type="date"
                    name="first_rent_due_on"
                    value={formData.first_rent_due_on}
                    onChange={handleInputChange}
                    className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block tenancy-modal-label">Rent Per Frequency</label>
              <input
                type="number"
                name="rent_per_frequency"
                value={formData.rent_per_frequency}
                onChange={handleInputChange}
                placeholder="Enter Rent Per Frequency"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block tenancy-modal-label">Total Receivable</label>
              <input
                type="text"
                name="total_receivable"
                value={formData.total_receivable}
                readOnly
                className="w-full p-2 bg-gray-100 tenancy-input-box"
              />
            </div>
            <div>
              <label className="block tenancy-modal-label">Deposit (If Any)</label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleInputChange}
                placeholder="Enter Deposit"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block tenancy-modal-label">Commission (If Any)</label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                placeholder="Enter Commission"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block tenancy-modal-label">Remarks*</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Enter Remarks"
                className="w-full p-2 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-[#2892CE] mb-3 text-[15px] font-semibold font-['Public_Sans']">
              Additional Charges
            </h3>
            <div className="mt-6 tenancy-overflow-x-auto tenancy-additional-charges-container border border-[#E9E9E9] rounded-md">
              <div className="tenancy-desktop-table">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E9E9E9] h-[57px]">
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[20px]">
                        NO
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[138px]">
                        CHARGE TYPE
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[162px]">
                        REASON
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[173px]">
                        DUE DATE
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[148px]">
                        AMOUNT
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[70px]">
                        TAX
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[43px]">
                        TOTAL
                      </th>
                      <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[61px]">
                        REMOVE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalCharges.map((charge) => (
                      <tr key={charge.id} className="border-t border-[#E9E9E9]">
                        <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                          {charge.id}
                        </td>
                        <td className="px-[10px] py-[5px] w-[138px] relative">
                          <select
                            value={charge.charge_type}
                            onChange={(e) =>
                              handleAdditionalChargeChange(
                                charge.id,
                                "charge_type",
                                e.target.value
                              )
                            }
                            className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white tenancy-modal-table-select"
                            onFocus={() =>
                              toggleSelectOpen(`charge-${charge.id}`)
                            }
                            onBlur={() =>
                              toggleSelectOpen(`charge-${charge.id}`)
                            }
                          >
                            <option value="">Choose</option>
                            {Array.isArray(chargeTypes) ? (
                              chargeTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name || "Unnamed Charge"}
                                </option>
                              ))
                            ) : (
                              <option disabled>No charge types available</option>
                            )}
                          </select>
                          <ChevronDown
                            className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                              selectOpenStates[`charge-${charge.id}`]
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[162px]">
                          <input
                            type="text"
                            value={charge.reason}
                            onChange={(e) =>
                              handleAdditionalChargeChange(
                                charge.id,
                                "reason",
                                e.target.value
                              )
                            }
                            placeholder="Enter Reason"
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[173px] relative">
                          <input
                            type="date"
                            value={charge.due_date}
                            onChange={(e) =>
                              handleAdditionalChargeChange(
                                charge.id,
                                "due_date",
                                e.target.value
                              )
                            }
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[148px]">
                          <input
                            type="number"
                            value={charge.amount}
                            onChange={(e) =>
                              handleAdditionalChargeChange(
                                charge.id,
                                "amount",
                                e.target.value
                              )
                            }
                            placeholder="Enter Amount"
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[70px]">
                          <button
                            onClick={() => showTaxDetails(charge.id, true)}
                            className="text-[#2892CE] underline"
                            disabled={charge.tax === "0.00"}
                          >
                            {charge.tax}
                          </button>
                        </td>
                        <td className="px-[10px] py-[5px] w-[43px] text-[14px] text-[#201D1E]">
                          {charge.total}
                        </td>
                        <td className="px-[10px] py-[5px] w-[30px]">
                          <button onClick={() => removeRow(charge.id)}>
                            <Trash2
                              size={20}
                              color="#201D1E"
                              className="mt-1"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="tenancy-mobile-table">
                {additionalCharges.map((charge) => (
                  <div
                    key={charge.id}
                    className="border-b border-[#E9E9E9] last:border-b-0"
                  >
                    <div className="flex justify-start border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        NO
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[44%]">
                        CHARGE TYPE
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        REASON
                      </div>
                    </div>
                    <div className="flex justify-start h-[67px] border-b border-[#E9E9E9]">
                      <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E]">
                        {charge.id}
                      </div>
                      <div className="px-[10px] py-[13px] relative w-full">
                        <select
                          value={charge.charge_type}
                          onChange={(e) =>
                            handleAdditionalChargeChange(
                              charge.id,
                              "charge_type",
                              e.target.value
                            )
                          }
                          className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white tenancy-modal-table-select"
                          onFocus={() =>
                            toggleSelectOpen(`charge-${charge.id}`)
                          }
                          onBlur={() => toggleSelectOpen(`charge-${charge.id}`)}
                        >
                          <option value="">Choose</option>
                          {Array.isArray(chargeTypes) ? (
                            chargeTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name || "Unnamed Charge"}
                              </option>
                            ))
                          ) : (
                            <option disabled>No charge types available</option>
                          )}
                        </select>
                        <ChevronDown
                          className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${
                            selectOpenStates[`charge-${charge.id}`]
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="px-[10px] py-[13px] w-full">
                        <input
                          type="text"
                          value={charge.reason}
                          onChange={(e) =>
                            handleAdditionalChargeChange(
                              charge.id,
                              "reason",
                              e.target.value
                            )
                          }
                          placeholder="Enter Reason"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        DUE DATE
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[41.5%]">
                        AMOUNT
                      </div>
                    </div>
                    <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
                      <div className="px-[9px] py-[13px] relative w-full">
                        <input
                          type="date"
                          value={charge.due_date}
                          onChange={(e) =>
                            handleAdditionalChargeChange(
                              charge.id,
                              "due_date",
                              e.target.value
                            )
                          }
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                        />
                      </div>
                      <div className="px-[10px] py-[13px] w-full">
                        <input
                          type="number"
                          value={charge.amount}
                          onChange={(e) =>
                            handleAdditionalChargeChange(
                              charge.id,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="Enter Amount"
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        TAX
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        TOTAL
                      </div>
                    </div>
                    <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
                      <div className="px-[9px] py-[13px] w-full">
                        <button
                          onClick={() => showTaxDetails(charge.id, true)}
                          className="text-[#2892CE] underline"
                          disabled={charge.tax === "0.00"}
                        >
                          {charge.tax}
                        </button>
                      </div>
                      <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                        {charge.total}
                      </div>
                    </div>
                    <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        REMOVE
                      </div>
                    </div>
                    <div className="flex justify-between h-[57px]">
                      <div className="px-[10px] py-[3px] flex justify-center">
                        <button onClick={() => removeRow(charge.id)}>
                          <Trash2 size={20} color="#201D1E" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addRow}
                className="mt-6 bg-[#2892CE] hover:bg-[#1f6c99] duration-200 text-white px-4 pl-2 mb-10 flex items-center tenancy-addrow-btn"
              >
                Add Row
                <Plus size={20} color="#ffffff" className="ml-2" />
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={togglePaymentSchedule}
                className="bg-white text-[#2892CE] px-4 py-2 border border-[#E9E9E9] rounded tenancy-btn"
              >
                {showPaymentSchedule
                  ? "Hide Payment Schedule"
                  : "Show Payment Schedule"}
              </button>

              {showPaymentSchedule && (
                <div className="mt-6 tenancy-overflow-x-auto">
                  <div className="tenancy-desktop-table">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[20px]">
                            NO
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[138px]">
                            CHARGE TYPE
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[162px]">
                            REASON
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[173px]">
                            DUE DATE
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[55px]">
                            STATUS
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[148px]">
                            AMOUNT
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[70px]">
                            TAX
                          </th>
                          <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[43px]">
                            TOTAL
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(paymentSchedule) ? (
                          paymentSchedule.map((schedule) => (
                            <tr
                              key={schedule.id}
                              className="border-t border-[#E9E9E9] h-[57px]"
                            >
                              <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                                {schedule.id}
                              </td>
                              <td className="px-[10px] py-[5px] w-[138px] text-[14px] text-[#201D1E]">
                                {schedule.charge_type_name || "N/A"}
                              </td>
                              <td className="px-[10px] py-[5px] w-[162px] text-[14px] text-[#201D1E]">
                                {schedule.reason || "N/A"}
                              </td>
                              <td className="px-[10px] py-[5px] w-[173px] text-[14px] text-[#201D1E]">
                                {schedule.due_date || "N/A"}
                              </td>
                              <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                                {schedule.status || "N/A"}
                              </td>
                              <td className="px-[10px] py-[5px] w-[148px] text-[14px] text-[#201D1E]">
                                {schedule.amount || "0.00"}
                              </td>
                              <td className="px-[10px] py-[5px] w-[70px]">
                                <button
                                  onClick={() =>
                                    showTaxDetails(schedule.id, false)
                                  }
                                  className="text-[#2892CE] underline"
                                  disabled={!schedule.tax}
                                >
                                  {schedule.tax || "0.00"}
                                </button>
                              </td>
                              <td className="px-[10px] py-[5px] w-[43px] text-[14px] text-[#201D1E]">
                                {schedule.total || "0.00"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="px-[10px] py-[5px] text-center text-[14px] text-[#201D1E]">
                              No payment schedules available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="tenancy-mobile-table">
                    {Array.isArray(paymentSchedule) ? (
                      paymentSchedule.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="border-b border-[#E9E9E9] last:border-b-0"
                        >
                          <div className="flex justify-start border-b border-[#E9E9E9] bg-[#F0F2F2] h-[57px]">
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              NO
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[44%]">
                              CHARGE TYPE
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              REASON
                            </div>
                          </div>
                          <div className="flex justify-start h-[17px] border-b border-[#E9E9E9]">
                            <div className="px-[10px] py-[13px] text-[14px] text-[#201D1E]">
                              {schedule.id}
                            </div>
                            <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                              {schedule.charge_type_name || "N/A"}
                            </div>
                            <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                              {schedule.reason || "N/A"}
                            </div>
                          </div>
                          <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F0F2F2] h-[57px]">
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              DUE DATE
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[41.5%]">
                              STATUS
                            </div>
                          </div>
                          <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
                            <div className="px-[9px] py-[13px] w-full text-[14px] text-[#201D1E]">
                              {schedule.due_date || "N/A"}
                            </div>
                            <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                              {schedule.status || "N/A"}
                            </div>
                          </div>
                          <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F0F2F2] h-[57px]">
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              AMOUNT
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              TAX
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              TOTAL
                            </div>
                          </div>
                          <div className="flex justify-start h-[67px]">
                            <div className="px-[9px] py-[13px] w-full text-[14px] text-[#201D1E]">
                              {schedule.amount || "0.00"}
                            </div>
                            <div className="px-[10px] py-[13px] w-full">
                              <button
                                onClick={() => showTaxDetails(schedule.id, false)}
                                className="text-[#2892CE] underline"
                                disabled={!schedule.tax}
                              >
                                {schedule.tax || "0.00"}
                              </button>
                            </div>
                            <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                              {schedule.total || "0.00"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-[10px] py-[13px] text-center text-[14px] text-[#201D1E]">
                        No payment schedules available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 mb-4">
              <button
                onClick={handleSubmit}
                className="bg-[#2892CE] hover:bg-[#1f6c99] duration-200 text-white px-8 py-2 tenancy-save-btn"
                aria-label="Save tenancy"
              >
                Save
              </button>
            </div>
          </div>

          {taxModalData.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Tax Details</h3>
                  <button
                    onClick={closeTaxModal}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close tax details modal"
                  >
                    <X size={24} color="#201D1E" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {taxModalData.taxDetails.length > 0 ? (
                    <table className="w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Charge Type
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Tax %
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {taxModalData.taxDetails.map((tax, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-3 py-2">
                              {tax.tax_type || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {tax.tax_percentage || 0}%
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {tax.tax_amount || "0.00"}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold bg-gray-50">
                          <td
                            colSpan={2}
                            className="border border-gray-300 px-3 py-2 text-right"
                          >
                            Total
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {taxModalData.taxDetails
                              .reduce(
                                (acc, curr) =>
                                  acc + parseFloat(curr.tax_amount || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>No tax details available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTenancyModal;