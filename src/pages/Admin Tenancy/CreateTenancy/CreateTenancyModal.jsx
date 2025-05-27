import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateTenancyModal.css";
import closeicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/close-icon.svg";
// import calendaricon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/calendar-icon.svg";
import deleteicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/delete-icon.svg";
import plusicon from "../../../assets/Images/Admin Tenancy/Tenenacy Modal/plus-icon.svg";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";

const CreateTenancyModal = () => {
  const { modalState, closeModal } = useModal();
  const navigate = useNavigate();
  const [selectOpenStates, setSelectOpenStates] = useState({});
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(true);

  // API data states
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);

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
    total_rent_receivable: "",
    deposit: "",
    commision: "",
    remarks: "",
  });

  const [additionalCharges, setAdditionalCharges] = useState([
    {
      id: "01",
      charge_type: "",
      reason: "",
      due_date: "",
      amount: "",
    },
  ]);

  const [paymentSchedule, setPaymentSchedule] = useState([]);

  const [expandedStates, setExpandedStates] = useState({});

  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (role === "company") {
      // When a company logs in, their own ID is stored as company_id
      return localStorage.getItem("company_id");
    } else if (role === "user" || role === "admin") {
      // When a user logs in, company_id is directly stored
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


  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = getUserCompanyId();
        const [tenantsRes, buildingsRes, unitsRes, chargeTypesRes] = await Promise.all([
          axios.get(`${BASE_URL}/company/tenant/company/${companyId}/`),
          axios.get(`${BASE_URL}/company/buildings/company/${companyId}/`),
          axios.get(`${BASE_URL}/company/units/company/${companyId}/`),
          axios.get(`${BASE_URL}/company/charges/company/${companyId}/`),
        ]);
        setTenants(tenantsRes.data);
        setBuildings(buildingsRes.data);
        setUnits(unitsRes.data);
        setChargeTypes(chargeTypesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Auto-calculate end_date and total_rent_receivable
  useEffect(() => {
    if (formData.start_date && formData.rental_months) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + parseInt(formData.rental_months));

      // Subtract 1 day to get the correct end date
      endDate.setDate(endDate.getDate() - 1);

      setFormData((prev) => ({
        ...prev,
        end_date: endDate.toISOString().split("T")[0],
      }));
    }

    if (formData.rent_per_frequency && formData.no_payments) {
      const total = (
        parseFloat(formData.rent_per_frequency) * parseInt(formData.no_payments)
      ).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        total_rent_receivable: total,
      }));
    }
  }, [formData.start_date, formData.rental_months, formData.rent_per_frequency, formData.no_payments]);

  // Generate payment schedule
  useEffect(() => {
    if (
      formData.no_payments &&
      formData.first_rent_due_on &&
      formData.rent_per_frequency &&
      formData.deposit &&
      formData.commision
    ) {
      const schedule = [];
      const firstDueDate = new Date(formData.first_rent_due_on);
      const depositChargeType = chargeTypes.find(ct => ct.name === "Deposit")?.id || "";
      const commisionChargeType = chargeTypes.find(ct => ct.name === "Commission")?.id || "";
      const rentChargeType = chargeTypes.find(ct => ct.name === "Rent")?.id || "";

      // Add Deposit
      schedule.push({
        id: "01",
        charge_type: depositChargeType,
        reason: "Deposit",
        due_date: firstDueDate.toISOString().split("T")[0],
        status: "pending",
        amount: parseFloat(formData.deposit || 0).toFixed(2),
        vat: "0.00",
        total: parseFloat(formData.deposit || 0).toFixed(2),
      });

      // Add Commission
      schedule.push({
        id: "02",
        charge_type: commisionChargeType,
        reason: "Commission",
        due_date: firstDueDate.toISOString().split("T")[0],
        status: "pending",
        amount: parseFloat(formData.commision || 0).toFixed(2),
        vat: "0.00",
        total: parseFloat(formData.commision || 0).toFixed(2),
      });

      // Add Rent payments
      const noPayments = parseInt(formData.no_payments);
      for (let i = 0; i < noPayments; i++) {
        const dueDate = new Date(firstDueDate);
        dueDate.setMonth(firstDueDate.getMonth() + i);
        schedule.push({
          id: (i + 3).toString().padStart(2, "0"),
          charge_type: rentChargeType,
          reason: "Monthly Rent",
          due_date: dueDate.toISOString().split("T")[0],
          status: "pending",
          amount: parseFloat(formData.rent_per_frequency).toFixed(2),
          vat: "0.00",
          total: parseFloat(formData.rent_per_frequency).toFixed(2),
        });
      }

      setPaymentSchedule(schedule);
      setExpandedStates(schedule.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));
    }
  }, [
    formData.no_payments,
    formData.first_rent_due_on,
    formData.rent_per_frequency,
    formData.deposit,
    formData.commision,
    chargeTypes,
  ]);

  if (!modalState.isOpen || modalState.type !== "tenancy-create") return null;

  const toggleSelectOpen = (selectId) => {
    setSelectOpenStates((prev) => ({
      ...prev,
      [selectId]: !prev[selectId],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalChargeChange = (id, field, value) => {
    setAdditionalCharges((prev) =>
      prev.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const handlePaymentScheduleChange = (id, field, value) => {
    setPaymentSchedule((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "amount" || field === "vat") {
            const amount = parseFloat(updatedItem.amount || 0);
            const vat = parseFloat(updatedItem.vat || 0);
            updatedItem.total = (amount + vat).toFixed(2);
          }
          return updatedItem;
        }
        return item;
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

  const toggleExpand = (id) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
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
    // Validate additional charges
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
    // Validate payment schedule
    for (const item of paymentSchedule) {
      if (
        !item.charge_type ||
        !item.reason ||
        !item.due_date ||
        !item.amount ||
        item.vat === ""
      ) {
        alert("Please fill all fields in Payment Schedule");
        return;
      }
    }

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();

    // Prepare data for backend
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
      commision: parseFloat(formData.commision || 0).toFixed(2),
      remarks: formData.remarks,
      additional_charges: additionalCharges.map((charge) => ({
        charge_type: parseInt(charge.charge_type),
        reason: charge.reason,
        amount: parseFloat(charge.amount).toFixed(2),
        due_date: charge.due_date,
      })),
      payment_schedule: paymentSchedule.map((item) => ({
        charge_type: parseInt(item.charge_type),
        reason: item.reason,
        due_date: item.due_date,
        status: item.status,
        amount: parseFloat(item.amount).toFixed(2),
        vat: parseFloat(item.vat).toFixed(2),
        total: parseFloat(item.total).toFixed(2),
      })),
    };

    try {
      const response = await axios.post(`${BASE_URL}/company/tenancies/create/`, payload);
      console.log('Tenancy created successfully:', response.data);

      closeModal();
      navigate("/admin/tenancy-master");
    } catch (error) {
      console.error("Error submitting tenancy:", error.response?.data || error.message);
      alert("Failed to create tenancy. Please try again.");
    }

  };

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
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${selectOpenStates["tenant"] ? "rotate-180" : "rotate-0"
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
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${selectOpenStates["building"] ? "rotate-180" : "rotate-0"
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
                    className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${selectOpenStates["unit"] ? "rotate-180" : "rotate-0"
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
                    className="w-full p-2 pr-10 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img
                      src={calendaricon}
                      alt="Calendar"
                      className="w-5 h-5"
                    />
                  </div> */}
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
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img
                      src={calendaricon}
                      alt="Calendar"
                      className="w-5 h-5"
                    />
                  </div> */}
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
                    className="w-full p-2 pr-10 focus:outline-none focus:border-gray-700 focus:ring-gray-700 tenancy-input-box"
                  />
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <img
                      src={calendaricon}
                      alt="Calendar"
                      className="w-5 h-5"
                    />
                  </div> */}
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
                Total Rent Receivable
              </label>
              <input
                type="text"
                name="total_rent_receivable"
                value={formData.total_rent_receivable}
                readOnly
                className="w-full p-2 bg-gray-100 tenancy-input-box"
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
                name="commision"
                value={formData.commision}
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
              className="text-[#2892CE] mb-3"
              style={{
                fontSize: "15px",
                fontWeight: "600",
                fontFamily: "Public Sans",
              }}
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
                            className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${selectOpenStates[`charge-${charge.id}`]
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
                          {/* <img
                            src={calendaricon}
                            alt="Calendar"
                            className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                          /> */}
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
              {/* Mobile Table */}
              <div className="tenancy-mobile-table">
                {additionalCharges.map((charge) => (
                  <div
                    key={charge.id}
                    className="border-b border-[#E9E9E9] last:border-b-0"
                  >
                    {/* First Row - 3 columns */}
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
                          className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${selectOpenStates[`charge-${charge.id}`]
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

                    {/* Second Row - 2 columns */}
                    <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                      <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                        DUE DATE
                      </div>
                      <div className="px-[10px] flex items-center tenancy-modal-thead w-[41.5%] uppercase">
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
                        {/* <img
                          src={calendaricon}
                          alt="Calendar"
                          className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        /> */}
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

                    {/* Third Row - 1 column */}
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
                        <th className="px-[10px] text-left tenancy-modal-thead uppercase w-[25px]">
                          VAT
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
                          <td className="px-[10px] py-[5px] w-[138px] relative">
                            <select
                              value={item.charge_type}
                              onChange={(e) =>
                                handlePaymentScheduleChange(
                                  item.id,
                                  "charge_type",
                                  e.target.value
                                )
                              }
                              className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white tenancy-modal-table-select cursor-not-allowed"
                              disabled
                              onFocus={() =>
                                toggleSelectOpen(`payment-charge-${item.id}`)
                              }
                              onBlur={() =>
                                toggleSelectOpen(`payment-charge-${item.id}`)
                              }
                            >
                              <option value="">Choose</option>
                              {chargeTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                            {/* <ChevronDown
                              className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${selectOpenStates[`payment-charge-${item.id}`]
                                ? "rotate-180"
                                : ""
                                }`}
                            /> */}
                          </td>
                          <td className="px-[10px] py-[5px] w-[162px]">
                            <input
                              type="text"
                              value={item.reason}
                              onChange={(e) =>
                                handlePaymentScheduleChange(
                                  item.id,
                                  "reason",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Reason"
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input cursor-not-allowed"
                              readOnly
                            />
                          </td>
                          <td className="px-[10px] py-[5px] w-[173px] relative">
                            <input
                              type="date"
                              value={item.due_date}
                              onChange={(e) =>
                                handlePaymentScheduleChange(
                                  item.id,
                                  "due_date",
                                  e.target.value
                                )
                              }
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                            />
                            {/* <img
                              src={calendaricon}
                              alt="Calendar"
                              className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            /> */}
                          </td>
                          <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                            {item.status}
                          </td>
                          <td className="px-[10px] py-[5px] w-[148px]">
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) =>
                                handlePaymentScheduleChange(
                                  item.id,
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
                          <td className="px-[10px] py-[5px] w-[25px]">
                            <input
                              type="number"
                              value={item.vat}
                              onChange={(e) =>
                                handlePaymentScheduleChange(
                                  item.id,
                                  "vat",
                                  e.target.value
                                )
                              }
                              placeholder="Enter VAT"
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                              step="0.01"
                              min="0"
                            />
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
                      className="tenancy-mobile-payment-section"
                    >
                      {/* First Row - Header */}
                      <div
                        className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${expandedStates[item.id] ? "bg-[#F2F2F2]" : "bg-white"
                          }`}
                      >
                        <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                          NO
                        </div>
                        <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                          CHARGE TYPE
                        </div>
                        <div className="px-[10px] w-[30%] flex items-center tenancy-modal-thead uppercase">
                          REASON
                        </div>
                      </div>
                      {/* First Row - Content (Clickable) */}
                      <div
                        className={`flex justify-between h-[67px] cursor-pointer ${expandedStates[item.id]
                          ? "border-b border-[#E9E9E9]"
                          : ""
                          }`}
                        onClick={() => toggleExpand(item.id)}
                      >
                        <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E]">
                          {item.id}
                        </div>
                        <div className="px-[10px] py-[13px] w-[35%]">
                          <select
                            value={item.charge_type}
                            onChange={(e) =>
                              handlePaymentScheduleChange(
                                item.id,
                                "charge_type",
                                e.target.value
                              )
                            }
                            className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white tenancy-modal-table-select"
                            onFocus={() =>
                              toggleSelectOpen(`payment-charge-${item.id}`)
                            }
                            onBlur={() =>
                              toggleSelectOpen(`payment-charge-${item.id}`)
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
                            className={`absolute right-[18px] top-1/2 transform -translate-y-1/2 duration-200 h-4 w-4 text-[#201D1E] pointer-events-none ${selectOpenStates[`payment-charge-${item.id}`]
                              ? "rotate-180"
                              : ""
                              }`}
                          />
                        </div>
                        <div className="px-[10px] py-[13px] w-[30%]">
                          <input
                            type="text"
                            value={item.reason}
                            onChange={(e) =>
                              handlePaymentScheduleChange(
                                item.id,
                                "reason",
                                e.target.value
                              )
                            }
                            placeholder="Enter Reason"
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                          />
                        </div>
                      </div>

                      {expandedStates[item.id] && (
                        <>
                          {/* Second Row - Header */}
                          <div
                            className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${expandedStates[item.id]
                              ? "bg-[#F2F2F2]"
                              : "bg-white"
                              }`}
                          >
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase">
                              DUE DATE
                            </div>
                            <div className="px-[10px] flex items-center w-[7%] tenancy-modal-thead uppercase">
                              STATUS
                            </div>
                            <div className="px-[10px] flex items-center w-[41.5%] tenancy-modal-thead uppercase">
                              AMOUNT
                            </div>
                          </div>
                          {/* Second Row - Content */}
                          <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                            <div className="px-[9px] py-[13px] relative w-full">
                              <input
                                type="date"
                                value={item.due_date}
                                onChange={(e) =>
                                  handlePaymentScheduleChange(
                                    item.id,
                                    "due_date",
                                    e.target.value
                                  )
                                }
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                              />
                              {/* <img
                                src={calendaricon}
                                alt="Calendar"
                                className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                              /> */}
                            </div>
                            <div className="py-[10px] text-[14px] text-[#201D1E]">
                              {item.status}
                            </div>
                            <div className="px-[10px] py-[13px] w-full">
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) =>
                                  handlePaymentScheduleChange(
                                    item.id,
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

                          {/* Third Row - Header */}
                          <div
                            className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${expandedStates[item.id]
                              ? "bg-[#F2F2F2]"
                              : "bg-white"
                              }`}
                          >
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[50%]">
                              VAT
                            </div>
                            <div className="px-[10px] flex items-center tenancy-modal-thead uppercase w-[50%]">
                              TOTAL
                            </div>
                          </div>
                          {/* Third Row - Content */}
                          <div className="flex justify-between h-[57px]">
                            <div className="px-[13px] py-[13px] w-full">
                              <input
                                type="number"
                                value={item.vat}
                                onChange={(e) =>
                                  handlePaymentScheduleChange(
                                    item.id,
                                    "vat",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter VAT"
                                className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 tenancy-modal-table-input"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E] w-[51%]">
                              {item.total}
                            </div>
                          </div>
                        </>
                      )}
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
      </div>
    </div>
  );
};

export default CreateTenancyModal;