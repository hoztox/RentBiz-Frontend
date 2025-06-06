import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateTenancyModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/close-icon.svg";
import deleteicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/delete-icon.svg";
import plusicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/plus-icon.svg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";

const CreateTenancyModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const navigate = useNavigate();
  const [selectOpenStates, setSelectOpenStates] = useState({});
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(true);
  const [taxModalData, setTaxModalData] = useState({ isOpen: false, chargeId: null, taxDetails: null });

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
  });

  const [additionalCharges, setAdditionalCharges] = useState([
    {
      id: "01",
      charge_type: "",
      reason: "",
      due_date: "",
      amount: "",
      tax: "",
      total: "",
      tax_percentage: null,
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
        const [tenantsRes, buildingsRes, chargeTypesRes] = await Promise.all([
          axios.get(`${BASE_URL}/company/tenant/company/${companyId}/`),
          axios.get(`${BASE_URL}/company/buildings/vacant/${companyId}/`),
          axios.get(`${BASE_URL}/company/charges/company/${companyId}/`),
        ]);
        setTenants(tenantsRes.data);
        setBuildings(buildingsRes.data);
        setChargeTypes(chargeTypesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch units when building changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (formData.building) {
        try {
          const response = await axios.get(
            `${BASE_URL}/company/units/${formData.building}/vacant-units/`
          );
          setUnits(response.data);
        } catch (error) {
          console.error("Error fetching units:", error);
          setUnits([]);
        }
      } else {
        setUnits([]);
      }
    };
    fetchUnits();
  }, [formData.building]);

  // Update end_date and first_rent_due_on
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
  }, [formData.start_date, formData.rental_months]);

  // Fetch payment schedule preview
  useEffect(() => {
    const fetchPaymentSchedulePreview = async () => {
      const companyId = getUserCompanyId();
      if (
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
      } else {
        setPaymentSchedule([]);
      }
    };

    fetchPaymentSchedulePreview();
  }, [
    formData.rental_months,
    formData.no_payments,
    formData.first_rent_due_on,
    formData.rent_per_frequency,
    formData.deposit,
    formData.commission,
    formData.start_date,
  ]);

  const fetchTaxDetails = async (chargeTypeId, dueDate, chargeId, isAdditionalCharge = true) => {
    try {
      const companyId = getUserCompanyId();
      const chargeType = chargeTypes.find(type => type.id === parseInt(chargeTypeId));
      if (!chargeType) return;

      const response = await axios.get(
        `${BASE_URL}/company/taxes/active/${companyId}/${chargeType.name}/${dueDate}/`
      );
      const taxDetails = response.data || { tax_percentageme_to_many: [], tax_percentage: 0 };

      if (isAdditionalCharge) {
        setAdditionalCharges(prev =>
          prev.map(charge =>
            charge.id === chargeId
              ? { ...charge, tax_percentage: taxDetails.tax_percentage }
              : charge
          )
        );
      }

      setTaxModalData({
        isOpen: true,
        chargeId,
        taxDetails: {
          tax_type: chargeType.name,
          tax_percentage: taxDetails.tax_percentage,
          tax_amount: isAdditionalCharge
            ? (parseFloat(additionalCharges.find(c => c.id === chargeId)?.amount || 0) * (taxDetails.tax_percentage / 100)).toFixed(2)
            : (parseFloat(paymentSchedule.find(p => p.id === chargeId)?.amount || 0) * (taxDetails.tax_percentage / 100)).toFixed(2),
        },
      });
    } catch (error) {
      console.error("Error fetching tax details:", error);
      setTaxModalData({ isOpen: true, chargeId, taxDetails: null });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "building" ? { unit: "" } : {}),
    }));
  };

  const handleAdditionalChargeChange = async (id, field, value) => {
    setAdditionalCharges((prev) =>
      prev.map((charge) => {
        if (charge.id === id) {
          const updatedCharge = { ...charge, [field]: value };
          if (field === "charge_type" || field === "amount" || field === "due_date") {
            const selectedChargeType = chargeTypes.find(
              (type) => type.id === parseInt(updatedCharge.charge_type)
            );
            if (selectedChargeType && updatedCharge.amount && updatedCharge.due_date) {
              fetchTaxDetails(updatedCharge.charge_type, updatedCharge.due_date, id).then(() => {
                const amount = parseFloat(updatedCharge.amount || 0);
                const taxPercentage = parseFloat(updatedCharge.tax_percentage || 0);
                updatedCharge.tax = (amount * (taxPercentage / 100)).toFixed(2);
                updatedCharge.total = (amount + parseFloat(updatedCharge.tax || 0)).toFixed(2);
                setAdditionalCharges([...prev]);
              });
            } else {
              updatedCharge.tax = "0.00";
              updatedCharge.total = updatedCharge.amount || "0.00";
            }
          }
          return updatedCharge;
        }
        return charge;
      })
    );
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
        tax: "",
        total: "",
        tax_percentage: null,
      },
    ]);
  };

  const removeRow = (id) => {
    setAdditionalCharges(
      additionalCharges.filter((charge) => charge.id !== id)
    );
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
        !charge.amount ||
        charge.tax === ""
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
      additional_charges: additionalCharges.map((charge) => ({
        charge_type: parseInt(charge.charge_type),
        reason: charge.reason,
        due_date: charge.due_date,
        amount: parseFloat(charge.amount).toFixed(2),
        tax: parseFloat(charge.tax).toFixed(2),
        total: parseFloat(charge.total).toFixed(2),
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
    setTaxModalData({ isOpen: false, chargeId: null, taxDetails: null });
  };

  if (!modalState.isOpen || modalState.type !== "tenancy-create") return null;

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
              <img src={closeicon} alt="close-button" />
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
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.tenant_name}
                    </option>
                  ))}
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
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name}
                    </option>
                  ))}
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
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unit_name}
                      </option>
                    ))}
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
                <label className="block tenancy-modal-label">
                  Rental Months*
                </label>
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
                <label className="block tenancy-modal-label">
                  No. of Payments*
                </label>
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
                <label className="block tenancy-modal-label">
                  First Rent Due On*
                </label>
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
              <label className="block tenancy-modal-label">
                Rent Per Frequency
              </label>
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
              <label className="block tenancy-modal-label">
                Deposit (If Any)
              </label>
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
              <label className="block tenancy-modal-label">
                Commission (If Any)
              </label>
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
            <h3
              className="text-[#2892CE] mb-3 text-[15px] font-semibold font-['Public_Sans']"
            >
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
                            {chargeTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
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
                            onClick={() => fetchTaxDetails(charge.charge_type, charge.due_date, charge.id)}
                            className="text-[#2892CE] underline"
                            disabled={!charge.tax}
                          >
                            {charge.tax || "0.00"}
                          </button>
                        </td>
                        <td className="px-[10px] py-[5px] w-[43px] text-[14px] text-[#201D1E]">
                          {charge.total}
                        </td>
                        <td className="px-[10px] py-[5px] w-[30px]">
                          <button onClick={() => removeRow(charge.id)}>
                            <img
                              src={deleteicon}
                              alt="delete"
                              className="w-[60px] h-[20px] mt-1"
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
                          {chargeTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
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
                          onClick={() => fetchTaxDetails(charge.charge_type, charge.due_date, charge.id)}
                          className="text-[#2892CE] underline"
                          disabled={!charge.tax}
                        >
                          {charge.tax || "0.00"}
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
                          <img
                            src={deleteicon}
                            alt="delete"
                            className="w-[60px] h-[20px]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addRow}
                className="mt-6 bg-[#2892CE] hover:bg-[#1f6c99] duration-200 text-white px-4 pl-6 mb-10 flex items-center tenancy-addrow-btn"
              >
                Add Row
                <img
                  src={plusicon}
                  alt="add"
                  className="w-[20px] h-[20px] ml-2"
                />
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={togglePaymentSchedule}
                className="bg-white text-[#2892CE] px-4 py-2 border border-[#E9E9E9] rounded tenancy-hidepayement-btn"
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
                        {paymentSchedule.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-[#E9E9E9] h-[57px]"
                          >
                            <td className="px-[10px] py-[5px] w-[20px] text-[14px] text-[#201D1E]">
                              {item.id}
                            </td>
                            <td className="px-[10px] py-[5px] w-[138px] text-[14px] text-[#201D1E]">
                              {item.charge_type_name}
                            </td>
                            <td className="px-[10px] py-[5px] w-[162px] text-[14px] text-[#201D1E]">
                              {item.reason}
                            </td>
                            <td className="px-[10px] py-[5px] w-[173px] text-[14px] text-[#201D1E]">
                              {item.due_date}
                            </td>
                            <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                              {item.status}
                            </td>
                            <td className="px-[10px] py-[5px] w-[148px] text-[14px] text-[#201D1E]">
                              {item.amount}
                            </td>
                            <td className="px-[10px] py-[5px] w-[70px]">
                              <button
                                onClick={() => fetchTaxDetails(item.charge_type, item.due_date, item.id, false)}
                                className="text-[#2892CE] underline"
                                disabled={!item.tax}
                              >
                                {item.tax || "0.00"}
                              </button>
                            </td>
                            <td className="px-[10px] py-[5px] w-[43px] text-[14px] text-[#201D1E]">
                              {item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="tenancy-mobile-table">
                    {paymentSchedule.map((item) => (
                      <div
                        key={item.id}
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
                            {item.id}
                          </div>
                          <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                            {item.charge_type_name}
                          </div>
                          <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                            {item.reason}
                          </div>
                        </div>

                        <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                          <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                            DUE DATE
                          </div>
                          <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[41.5%]">
                            STATUS
                          </div>
                        </div>
                        <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
                          <div className="px-[9px] py-[13px] w-full text-[14px] text-[#201D1E]">
                            {item.due_date}
                          </div>
                          <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                            {item.status}
                          </div>
                        </div>

                        <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
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
                            {item.amount}
                          </div>
                          <div className="px-[10px] py-[13px] w-full">
                            <button
                              onClick={() => fetchTaxDetails(item.charge_type, item.due_date, item.id, false)}
                              className="text-[#2892CE] underline"
                              disabled={!item.tax}
                            >
                              {item.tax || "0.00"}
                            </button>
                          </div>
                          <div className="px-[10px] py-[13px] w-full text-[14px] text-[#201D1E]">
                            {item.total}
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <img src={closeicon} alt="close-button" className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  {taxModalData.taxDetails ? (
                    <>
                      <p><strong>Charge Type:</strong> {taxModalData.taxDetails.tax_type}</p>
                      <p><strong>Tax Percentage:</strong> {taxModalData.taxDetails.tax_percentage}%</p>
                      <p><strong>Tax Amount:</strong> {taxModalData.taxDetails.tax_amount}</p>
                    </>
                  ) : (
                    <p>No tax details available.</p>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeTaxModal}
                    className="bg-[#2892CE] hover:bg-[#1f6c99] text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
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