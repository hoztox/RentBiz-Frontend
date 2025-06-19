import React, { useState, useEffect } from "react";
import "./UpdateExpenseModal.css";
import { ChevronDown } from "lucide-react";
import closeicon from "../../../assets/Images/Expense/close-icon.svg";
import calendaricon from "../../../assets/Images/Expense/calendar-icon.svg";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";

const UpdateExpenseModal = () => {
  const { modalState, closeModal } = useModal();

  const initialFormData = {
    id: "",
    building: "",
    expense_type: "",
    tenancy: "",
    tenant: "",
    unit: "",
    charge_type: "",
    date: "",
    amount: "",
    tax: "",
    total_amount: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [dropdownData, setDropdownData] = useState({
    buildings: [],
    tenancies: [],
    tenants: [],
    units: [],
    charges: [],
  });
  const [isLoading, setIsLoading] = useState({
    buildings: false,
    tenancies: false,
    tenants: false,
    units: false,
    charges: false,
  });
  const [isSelectOpen, setIsSelectOpen] = useState({
    building: false,
    expense_type: false,
    tenancy: false,
    tenant: false,
    unit: false,
    charge_type: false,
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const getUserCompanyId = () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();
      let companyId = null;

      if (role === "company" || role === "user" || role === "admin") {
        companyId = localStorage.getItem("company_id");
      }

      return companyId ? parseInt(companyId) : null;
    } catch (e) {
      console.error("Error getting user company ID:", e);
      return null;
    }
  };

  const fetchBuildings = async () => {
    try {
      setIsLoading(prev => ({ ...prev, buildings: true }));
      const companyId = getUserCompanyId();
      if (!companyId) {
        console.error("No company ID found - cannot fetch buildings");
        return;
      }
      const response = await axios.get(`${BASE_URL}/company/buildings/company/${companyId}/`);
      let buildingsData = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.data || [];
      setDropdownData(prev => ({ ...prev, buildings: buildingsData }));
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setDropdownData(prev => ({ ...prev, buildings: [] }));
    } finally {
      setIsLoading(prev => ({ ...prev, buildings: false }));
    }
  };

  const fetchTenancies = async () => {
    try {
      setIsLoading(prev => ({ ...prev, tenancies: true }));
      const companyId = getUserCompanyId();
      if (!companyId) {
        console.error("No company ID found for tenancies");
        return;
      }
      const response = await axios.get(`${BASE_URL}/company/tenancies/company/${companyId}/`);
      setDropdownData(prev => ({
        ...prev,
        tenancies: Array.isArray(response.data) ? response.data : [],
      }));
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      setDropdownData(prev => ({ ...prev, tenancies: [] }));
    } finally {
      setIsLoading(prev => ({ ...prev, tenancies: false }));
    }
  };

  const fetchCharges = async () => {
    try {
      setIsLoading(prev => ({ ...prev, charges: true }));
      const companyId = getUserCompanyId();
      if (!companyId) {
        console.error("No company ID found for charges");
        return;
      }
      const response = await axios.get(`${BASE_URL}/company/charges/company/${companyId}/`);
      setDropdownData(prev => ({
        ...prev,
        charges: Array.isArray(response.data) ? response.data : [],
      }));
    } catch (error) {
      console.error("Error fetching charges:", error);
      setDropdownData(prev => ({ ...prev, charges: [] }));
    } finally {
      setIsLoading(prev => ({ ...prev, charges: false }));
    }
  };

  const fetchInitialDropdownData = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        console.error("No company ID found");
        return;
      }
      await Promise.all([fetchBuildings(), fetchCharges(), fetchTenancies()]);
    } catch (error) {
      console.error("Error in fetchInitialDropdownData:", error);
    }
  };

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "update-expense" && modalState.data) {
      const expenseData = modalState.data;
      
      setFormData({
        id: expenseData.id || "",
        building: expenseData.building?.id?.toString() || "",
        expense_type: expenseData.expense_type || "",
        tenancy: expenseData.tenancy?.id?.toString() || "",
        tenant: expenseData.tenant?.id?.toString() || "",
        unit: expenseData.unit?.id?.toString() || "",
        charge_type: expenseData.charge_type?.id?.toString() || "",
        date: expenseData.date || "",
        amount: expenseData.amount || "",
        tax: expenseData.tax || "",
        total_amount: expenseData.total_amount || "",
        description: expenseData.description || "",
      });

      // Pre-populate tenant and unit data for tenancy expenses
      if (expenseData.expense_type === "tenancy" && expenseData.tenant && expenseData.unit) {
        setDropdownData(prev => ({
          ...prev,
          tenants: [{
            id: expenseData.tenant.id,
            name: expenseData.tenant.tenant_name, // Use tenant_name from API
          }],
          units: [{
            id: expenseData.unit.id,
            unit_name: expenseData.unit.unit_name, // Use unit_name from API
            building: expenseData.building?.id,
          }],
        }));
      }

      fetchInitialDropdownData();
    } else {
      setFormData(initialFormData);
      setDropdownData({
        buildings: [],
        tenancies: [],
        tenants: [],
        units: [],
        charges: [],
      });
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  const calculateTotal = async () => {
    if (!formData.amount || !formData.charge_type || !formData.date) {
      setFormData(prev => ({
        ...prev,
        tax: "0.00",
        total_amount: formData.amount || "0.00",
      }));
      return;
    }

    const companyId = getUserCompanyId();
    if (!companyId) {
      console.error("No company ID found");
      setFormData(prev => ({
        ...prev,
        tax: "0.00",
        total_amount: formData.amount || "0.00",
      }));
      return;
    }

    setIsCalculating(true);
    try {
      const response = await axios.post(`${BASE_URL}/company/expenses/calculate-total/`, {
        company: companyId,
        charge_type: parseInt(formData.charge_type),
        amount: parseFloat(formData.amount).toFixed(2),
        due_date: formData.date,
      });

      if (response.data.tax !== undefined && response.data.total_amount !== undefined) {
        setFormData(prev => ({
          ...prev,
          tax: response.data.tax,
          total_amount: response.data.total_amount,
        }));
      } else {
        console.error("Invalid response format:", response.data);
        setFormData(prev => ({
          ...prev,
          tax: "0.00",
          total_amount: formData.amount || "0.00",
        }));
      }
    } catch (error) {
      console.error("Error fetching tax and total:", error);
      setFormData(prev => ({
        ...prev,
        tax: "0.00",
        total_amount: formData.amount || "0.00",
      }));
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (formData.amount && formData.charge_type && formData.date && !isCalculating) {
      calculateTotal();
    } else {
      setFormData(prev => ({
        ...prev,
        tax: "0.00",
        total_amount: formData.amount || "0.00",
      }));
    }
  }, [formData.amount, formData.charge_type, formData.date]);

  useEffect(() => {
    if (formData.expense_type === "tenancy" && dropdownData.tenancies.length === 0) {
      fetchTenancies();
    }
  }, [formData.expense_type, dropdownData.tenancies.length]);

  const handleSelectToggle = (field) => {
    setIsSelectOpen(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === "expense_type") {
        if (value === "general") {
          newData.tenancy = "";
          newData.tenant = "";
          newData.unit = "";
          newData.building = "";
          setDropdownData(prev => ({
            ...prev,
            tenants: [],
            units: [],
          }));
        } else if (value === "tenancy") {
          newData.tenancy = "";
          newData.tenant = "";
          newData.unit = "";
          newData.building = "";
          setDropdownData(prev => ({
            ...prev,
            tenants: [],
            units: [],
          }));
        }
      }

      if (field === "tenancy" && value) {
        const selectedTenancy = dropdownData.tenancies.find(
          tenancy => tenancy.id === parseInt(value)
        );
        if (selectedTenancy) {
          newData.building = selectedTenancy.building?.id?.toString() || "";
          newData.unit = selectedTenancy.unit?.id?.toString() || "";
          newData.tenant = selectedTenancy.tenant?.id?.toString() || "";

          setDropdownData(prev => ({
            ...prev,
            tenants: [
              {
                id: selectedTenancy.tenant?.id,
                name: selectedTenancy.tenant?.tenant_name, // Fixed: Use tenant_name
              },
            ],
            units: [
              {
                id: selectedTenancy.unit?.id,
                unit_name: selectedTenancy.unit?.unit_name, // Fixed: Use unit_name
                building: selectedTenancy.building?.id,
              },
            ],
          }));
        } else {
          newData.building = "";
          newData.unit = "";
          newData.tenant = "";
          setDropdownData(prev => ({
            ...prev,
            tenants: [],
            units: [],
          }));
        }
      } else if (field === "tenancy" && !value) {
        newData.building = "";
        newData.unit = "";
        newData.tenant = "";
        setDropdownData(prev => ({
          ...prev,
          tenants: [],
          units: [],
        }));
      }

      return newData;
    });

    if (e.target.tagName === "SELECT") {
      if (value === "") {
        e.target.classList.add("financial-expense-update-selected");
      } else {
        e.target.classList.remove("financial-expense-update-selected");
      }
    }
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "user" || role === "admin") {
      const userId = localStorage.getItem("user_id");
      return userId ? parseInt(userId) : null;
    }
    return null;
  };

  const handleUpdate = async () => {
    const requiredFields = ["building", "expense_type", "charge_type", "date", "amount"];
    const tenancyRequiredFields = ["tenancy", "tenant", "unit"];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (formData.expense_type === "tenancy") {
      missingFields.push(...tenancyRequiredFields.filter(field => !formData[field]));
    }

    if (missingFields.length > 0) {
      console.log("Please fill all required fields:", missingFields);
      return;
    }

    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();
      if (!companyId) {
        console.error("No company ID found for updating expense");
        return;
      }

      const payload = {
        ...formData,
        company: companyId,
        user: userId,
        charge_type: parseInt(formData.charge_type),
        amount: parseFloat(formData.amount).toFixed(2),
        tax: parseFloat(formData.tax || "0.00").toFixed(2),
        total_amount: parseFloat(formData.total_amount || formData.amount).toFixed(2),
      };

      const response = await axios.put(`${BASE_URL}/company/expenses/${formData.id}/`, payload);
      if (response.data) {
        console.log("Expense Updated: ", response.data);
        closeModal();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setDropdownData({
      buildings: [],
      tenancies: [],
      tenants: [],
      units: [],
      charges: [],
    });
    setIsLoading({
      buildings: false,
      tenancies: false,
      tenants: false,
      units: false,
      charges: false,
    });
    closeModal();
  };

  const filteredUnits = Array.isArray(dropdownData.units)
    ? dropdownData.units.filter(
        unit =>
          unit.building === parseInt(formData.building) ||
          unit.building_id === parseInt(formData.building)
      )
    : [];

  if (!modalState.isOpen || modalState.type !== "update-expense" || !modalState.data) {
    return null;
  }

  return (
    <div className="financial-expense-update-modal-wrapper">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 financial-expense-update-modal-overlay">
        <div className="bg-white rounded-md w-[1006px] shadow-lg p-1 financial-expense-update-modal-container">
          <div className="flex justify-between items-center md:p-6 mt-2">
            <h2 className="text-[#201D1E] financial-expense-update-head">
              Update Expense
            </h2>
            <button
              onClick={handleClose}
              className="financial-expense-update-close-btn hover:bg-gray-100 duration-200"
            >
              <img src={closeicon} alt="close" className="w-[15px] h-[15px]" />
            </button>
          </div>

          <div className="md:p-6 md:mt-[-15px]">
            <div className="grid gap-6 financial-expense-update-modal-grid">
              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Expense Type*
                </label>
                <div className="relative">
                  <select
                    value={formData.expense_type}
                    onChange={handleChange("expense_type")}
                    onFocus={() => handleSelectToggle("expense_type")}
                    onBlur={() => handleSelectToggle("expense_type")}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                      formData.expense_type === "" ? "financial-expense-update-selected" : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      Choose Expense Type
                    </option>
                    <option value="general">General</option>
                    <option value="tenancy">Tenancy</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpen.expense_type ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {formData.expense_type === "tenancy" && (
                <div className="space-y-2">
                  <label className="block financial-expense-update-label">
                    Tenancy*
                  </label>
                  <div className="relative">
                    <select
                      value={formData.tenancy}
                      onChange={handleChange("tenancy")}
                      onFocus={() => handleSelectToggle("tenancy")}
                      onBlur={() => handleSelectToggle("tenancy")}
                      disabled={isLoading.tenancies}
                      className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                        formData.tenancy === "" ? "financial-expense-update-selected" : ""
                      } ${isLoading.tenancies ? "opacity-50" : ""}`}
                    >
                      <option value="" disabled hidden>
                        {isLoading.tenancies ? "Loading tenancies..." : "Choose Tenancy"}
                      </option>
                      {Array.isArray(dropdownData.tenancies) &&
                        dropdownData.tenancies.map(tenancy => (
                          <option key={tenancy.id} value={tenancy.id}>
                            {tenancy.tenancy_code}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown
                        size={16}
                        className={`text-[#201D1E] transition-transform duration-300 ${
                          isSelectOpen.tenancy ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Building*
                </label>
                <div className="relative">
                  <select
                    value={formData.building}
                    onChange={handleChange("building")}
                    onFocus={() => handleSelectToggle("building")}
                    onBlur={() => handleSelectToggle("building")}
                    disabled={
                      isLoading.buildings ||
                      (formData.expense_type === "tenancy" && formData.tenancy)
                    }
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                      formData.building === "" ? "financial-expense-update-selected" : ""
                    } ${
                      isLoading.buildings ||
                      (formData.expense_type === "tenancy" && formData.tenancy)
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <option value="" disabled hidden>
                      {isLoading.buildings ? "Loading buildings..." : "Choose Building"}
                    </option>
                    {Array.isArray(dropdownData.buildings) &&
                      dropdownData.buildings.map(building => (
                        <option key={building.id} value={building.id}>
                          {building.building_name}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpen.building ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {formData.expense_type === "tenancy" && (
                <div className="space-y-2">
                  <label className="block financial-expense-update-label">
                    Tenant*
                  </label>
                  <div className="relative">
                    <select
                      value={formData.tenant}
                      onChange={handleChange("tenant")}
                      onFocus={() => handleSelectToggle("tenant")}
                      onBlur={() => handleSelectToggle("tenant")}
                      disabled={isLoading.tenants || formData.tenancy}
                      className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                        formData.tenant === "" ? "financial-expense-update-selected" : ""
                      } ${isLoading.tenants || formData.tenancy ? "opacity-50" : ""}`}
                    >
                      <option value="" disabled hidden>
                        {isLoading.tenants
                          ? "Loading tenants..."
                          : !formData.tenancy
                          ? "Select tenancy first"
                          : "Choose Tenant"}
                      </option>
                      {Array.isArray(dropdownData.tenants) &&
                        dropdownData.tenants.map(tenant => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown
                        size={16}
                        className={`text-[#201D1E] transition-transform duration-300 ${
                          isSelectOpen.tenant ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.expense_type === "tenancy" && (
                <div className="space-y-2">
                  <label className="block financial-expense-update-label">
                    Units*
                  </label>
                  <div className="relative">
                    <select
                      value={formData.unit}
                      onChange={handleChange("unit")}
                      onFocus={() => handleSelectToggle("unit")}
                      onBlur={() => handleSelectToggle("unit")}
                      disabled={isLoading.units || formData.tenancy}
                      className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                        formData.unit === "" ? "financial-expense-update-selected" : ""
                      } ${isLoading.units || formData.tenancy ? "opacity-50" : ""}`}
                    >
                      <option value="" disabled hidden>
                        {isLoading.units
                          ? "Loading units..."
                          : !formData.building
                          ? "Select building first"
                          : "Choose Unit"}
                      </option>
                      {filteredUnits.map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unit_name || unit.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown
                        size={16}
                        className={`text-[#201D1E] transition-transform duration-300 ${
                          isSelectOpen.unit ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Charges*
                </label>
                <div className="relative">
                  <select
                    value={formData.charge_type}
                    onChange={handleChange("charge_type")}
                    onFocus={() => handleSelectToggle("charge_type")}
                    onBlur={() => handleSelectToggle("charge_type")}
                    disabled={isLoading.charges}
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-selection ${
                      formData.charge_type === "" ? "financial-expense-update-selected" : ""
                    } ${isLoading.charges ? "opacity-50" : ""}`}
                  >
                    <option value="" disabled hidden>
                      {isLoading.charges ? "Loading charges..." : "Choose Charge"}
                    </option>
                    {Array.isArray(dropdownData.charges) &&
                      dropdownData.charges.map(charge => (
                        <option key={charge.id} value={charge.id}>
                          {charge.name}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown
                      size={16}
                      className={`text-[#201D1E] transition-transform duration-300 ${
                        isSelectOpen.charge_type ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Date*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={handleChange("date")}
                    className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center px-2 pointer-events-none">
                    <img src={calendaricon} alt="calendar" className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Amount*
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange("amount")}
                  placeholder="Enter Amount"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Tax Amount
                </label>
                <input
                  type="text"
                  value={formData.tax}
                  readOnly
                  placeholder="Auto-calculated"
                  className="block w-full px-3 py-2 border border-gray-200 bg-gray-50 financial-expense-update-input"
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={formData.total_amount}
                  readOnly
                  placeholder="Auto-calculated"
                  className="block w-full px-3 py-2 border border-gray-200 bg-gray-50 financial-expense-update-input"
                />
              </div>

              <div className="space-y-2">
                <label className="block financial-expense-update-label">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Enter Description"
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 financial-expense-update-input"
                />
              </div>

              <div className="flex items-end justify-end financial-expense-update-modal-save-wrapper">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isCalculating || Object.values(isLoading).some(loading => loading)}
                  className="bg-[#2892CE] text-white financial-expense-update-save-btn duration-200 disabled:opacity-50"
                >
                  {isCalculating
                    ? "Calculating..."
                    : Object.values(isLoading).some(loading => loading)
                    ? "Loading..."
                    : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateExpenseModal;