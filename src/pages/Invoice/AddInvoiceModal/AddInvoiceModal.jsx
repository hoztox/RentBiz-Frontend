import React, { useEffect, useState } from "react";
import "./AddInvoiceModal.css";
import { ChevronDown, X } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddInvoiceModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [formData, setFormData] = useState({
    building: "",
    unit: "",
    tenancy: "",
    inDate: "",
    building_name: "",
    unit_name: "",
    endDate: "",
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    building: false,
    unit: false,
    tenancy: false,
  });

  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenancyDetails, setTenancyDetails] = useState(null);
  const [selectedPaymentSchedules, setSelectedPaymentSchedules] = useState([]);
  const [selectedAdditionalCharges, setSelectedAdditionalCharges] = useState(
    []
  );

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

  const fetchBuildings = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        toast.error("No company ID found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/buildings/occupied/${companyId}/`
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedBuildings = response.data.sort((a, b) => a.id - b.id);
        setBuildings(sortedBuildings);
        console.log("Fetched and sorted buildings:", sortedBuildings);
      } else {
        setBuildings([]);
        console.log("No buildings found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
      toast.error("Failed to fetch buildings");
      setBuildings([]);
    }
  };

  const fetchUnits = async (buildingId) => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId || !buildingId) {
        toast.error("Company ID or Building ID not found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/units/${buildingId}/occupied-units/`
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedUnits = response.data.sort((a, b) => a.id - b.id);
        setUnits(sortedUnits);
        console.log("Fetched and sorted units:", sortedUnits);
      } else {
        setUnits([]);
        console.log("No units found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Failed to fetch units");
      setUnits([]);
    }
  };

  const fetchTenancies = async (unitId) => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId || !unitId) {
        toast.error("Company ID or Unit ID not found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/company/tenancies/company/${companyId}/${unitId}/`
      );

      if (response.data && Array.isArray(response.data.results)) {
        const sortedTenancies = response.data.results.sort(
          (a, b) => a.id - b.id
        );
        setTenancies(sortedTenancies);
        console.log("Fetched and sorted tenancies:", sortedTenancies);
      } else {
        setTenancies([]);
        console.log("No tenancies found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching tenancies:", error);
      toast.error("Failed to fetch tenancies");
      setTenancies([]);
    }
  };

  const fetchTenancyDetails = async (tenancyId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company/tenancies/${tenancyId}/`
      );

      if (response.data && response.data.success) {
        const tenancy = response.data.tenancy;
        setTenancyDetails(tenancy);

        setFormData((prev) => ({
          ...prev,
          building_name:
            tenancy.building?.building_name ||
            tenancy.unit?.building?.building_name ||
            "",
          unit_name: tenancy.unit?.unit_name || "",
        }));

        initializeSelectedItems(tenancy);
        console.log("Fetched tenancy details:", tenancy);
      } else {
        console.error(
          "Failed to fetch tenancy details:",
          response.data?.message || "Unknown error"
        );
        toast.error("Failed to fetch tenancy details");
      }
    } catch (error) {
      console.error("Error fetching tenancy details:", error);
      toast.error("Error fetching tenancy details");
    }
  };

  const initializeSelectedItems = (tenancy) => {
    try {
      const paymentSchedules = [];
      const additionalCharges = [];

      if (
        tenancy?.payment_schedules &&
        Array.isArray(tenancy.payment_schedules)
      ) {
        tenancy.payment_schedules.forEach((schedule) => {
          if (
            schedule.status === "pending" ||
            schedule.status === "partially_paid"
          ) {
            paymentSchedules.push({
              id: schedule.id,
              charge_type: schedule.charge_type?.name || "Unknown",
              description:
                schedule.reason ||
                `Payment - Due ${schedule.due_date || "No Due Date"}`,
              due_date: schedule.due_date || "",
              amount: schedule.amount
                ? parseFloat(schedule.amount).toFixed(2)
                : "0.00",
              tax: schedule.tax ? parseFloat(schedule.tax).toFixed(2) : "0.00",
              total: schedule.balance
                ? parseFloat(schedule.balance).toFixed(2)
                : "0.00",
              amount_paid: schedule.amount_paid
                ? parseFloat(schedule.amount_paid).toFixed(2)
                : "0.00",
              status: schedule.status,
              selected: schedule.status === "partially_paid",
            });
          }
        });
      }

      if (
        tenancy?.additional_charges &&
        Array.isArray(tenancy.additional_charges)
      ) {
        tenancy.additional_charges.forEach((charge) => {
          if (
            charge.status === "pending" ||
            charge.status === "partially_paid"
          ) {
            additionalCharges.push({
              id: charge.id,
              charge_type: charge.charge_type?.name || "Unknown",
              description:
                charge.reason ||
                `Additional Charge - Due ${charge.due_date || "No Due Date"}`,
              due_date: charge.due_date || "",
              amount: charge.amount
                ? parseFloat(charge.amount).toFixed(2)
                : "0.00",
              tax: charge.tax ? parseFloat(charge.tax).toFixed(2) : "0.00",
              total: charge.balance
                ? parseFloat(charge.balance).toFixed(2)
                : "0.00",
              amount_paid: charge.amount_paid
                ? parseFloat(charge.amount_paid).toFixed(2)
                : "0.00",
              status: charge.status,
              selected: charge.status === "partially_paid",
            });
          }
        });
      }

      const sortedPaymentSchedules = paymentSchedules.sort((a, b) => {
        if (a.status === "partially_paid" && b.status !== "partially_paid")
          return -1;
        if (a.status !== "partially_paid" && b.status === "partially_paid")
          return 1;
        return 0;
      });

      const sortedAdditionalCharges = additionalCharges.sort((a, b) => {
        if (a.status === "partially_paid" && b.status !== "partially_paid")
          return -1;
        if (a.status !== "partially_paid" && b.status === "partially_paid")
          return 1;
        return 0;
      });

      setSelectedPaymentSchedules(sortedPaymentSchedules);
      setSelectedAdditionalCharges(sortedAdditionalCharges);
    } catch (error) {
      console.error("Error initializing selected items:", error);
      toast.error(
        "Failed to initialize payment schedules or additional charges"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      building: "",
      unit: "",
      tenancy: "",
      inDate: "",
      building_name: "",
      unit_name: "",
      endDate: "",
    });
    setBuildings([]);
    setUnits([]);
    setTenancies([]);
    setTenancyDetails(null);
    setSelectedPaymentSchedules([]);
    setSelectedAdditionalCharges([]);
    setOpenDropdowns({
      building: false,
      unit: false,
      tenancy: false,
    });
  };

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-invoice") {
      resetForm();
      fetchBuildings();
    }
  }, [modalState.isOpen, modalState.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "building" && value) {
      setFormData((prev) => ({
        ...prev,
        unit: "",
        tenancy: "",
        building_name:
          buildings.find((b) => b.id === parseInt(value))?.building_name || "",
        unit_name: "",
      }));
      setUnits([]);
      setTenancies([]);
      setTenancyDetails(null);
      setSelectedPaymentSchedules([]);
      setSelectedAdditionalCharges([]);
      fetchUnits(value);
    } else if (name === "unit" && value) {
      setFormData((prev) => ({
        ...prev,
        tenancy: "",
        unit_name: units.find((u) => u.id === parseInt(value))?.unit_name || "",
      }));
      setTenancies([]);
      setTenancyDetails(null);
      setSelectedPaymentSchedules([]);
      setSelectedAdditionalCharges([]);
      fetchTenancies(value);
    } else if (name === "tenancy" && value) {
      fetchTenancyDetails(value);
    }
  };

  const handlePaymentScheduleToggle = (index) => {
    const updatedSchedules = [...selectedPaymentSchedules];
    updatedSchedules[index].selected = !updatedSchedules[index].selected;
    setSelectedPaymentSchedules(updatedSchedules);
  };

  const handleAdditionalChargeToggle = (index) => {
    const updatedCharges = [...selectedAdditionalCharges];
    updatedCharges[index].selected = !updatedCharges[index].selected;
    setSelectedAdditionalCharges(updatedCharges);
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const calculateGrandTotal = () => {
    try {
      const paymentTotal = selectedPaymentSchedules
        .filter((item) => item.selected)
        .reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

      const chargeTotal = selectedAdditionalCharges
        .filter((item) => item.selected)
        .reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

      return (paymentTotal + chargeTotal).toFixed(2);
    } catch (error) {
      console.error("Error calculating grand total:", error);
      return "0.00";
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

  const handleSave = async () => {
    try {
      const companyId = getUserCompanyId();
      const userId = getRelevantUserId();

      if (!companyId) {
        toast.error("Company ID is required to create an invoice.");
        return;
      }

      if (!formData.inDate) {
        toast.error("Invoice date is required.");
        return;
      }

      if (!formData.endDate) {
        toast.error("Due date is required.");
        return;
      }

      // Validate endDate format (YYYY-MM-DD)
      let formattedEndDate = formData.endDate;
      if (formData.endDate) {
        const endDate = new Date(formData.endDate);
        if (isNaN(endDate.getTime())) {
          toast.error("Due date is invalid. Please use YYYY-MM-DD format.");
          return;
        }
        formattedEndDate = endDate.toISOString().split("T")[0]; // Ensure YYYY-MM-DD
      }

      const selectedItems = [
        ...selectedPaymentSchedules
          .filter((item) => item.selected)
          .map((item) => ({
            charge_type: item.charge_type,
            description:
              item.description || `Payment - Due ${item.due_date || "N/A"}`, // Fallback description
            due_date: item.due_date,
            amount: parseFloat(item.amount) || 0,
            tax: parseFloat(item.tax) || 0,
            total: parseFloat(item.total) || 0,
            amount_paid: parseFloat(item.amount_paid) || 0,
            type: "payment_schedule",
            schedule_id: item.id,
          })),
        ...selectedAdditionalCharges
          .filter((item) => item.selected)
          .map((item) => ({
            charge_type: item.charge_type,
            description:
              item.description ||
              `Additional Charge - Due ${item.due_date || "N/A"}`, // Fallback description
            due_date: item.due_date,
            amount: parseFloat(item.amount) || 0,
            tax: parseFloat(item.tax) || 0,
            total: parseFloat(item.total) || 0,
            amount_paid: parseFloat(item.amount_paid) || 0,
            type: "additional_charge",
            charge_id: item.id,
          })),
      ];

      if (selectedItems.length === 0) {
        toast.error("Please select at least one item to invoice.");
        return;
      }

      setLoading(true);

      const invoiceData = {
        company: companyId,
        user: userId,
        tenancy: formData.tenancy,
        invoice_date: formData.inDate,
        end_date: formattedEndDate,
        building_name: formData.building_name,
        unit_name: formData.unit_name,
        items: selectedItems,
        total_amount: parseFloat(calculateGrandTotal()),
      };

      console.log("Invoice Data Payload:", invoiceData); // Debug log

      const response = await axios.post(
        `${BASE_URL}/company/invoice/create/`,
        invoiceData
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        console.log("Invoice Created Successfully:", response.data);
        toast.success("Invoice created successfully!");
        triggerRefresh();
        closeModal();
      } else {
        toast.error(response.data?.message || "Failed to create invoice");
      }
    } catch (error) {
      console.error(
        "Error creating invoice:",
        error.response?.data || error.message
      );
      // Parse validation errors
      let errorMessage = "Error creating invoice";
      if (error.response?.data) {
        const { end_date, items } = error.response.data;
        if (end_date) {
          errorMessage = `Due date error: ${end_date.join(", ")}`;
        } else if (items && Array.isArray(items)) {
          errorMessage = items
            .map((item, index) => {
              if (item.description) {
                return `Item ${
                  index + 1
                } description error: ${item.description.join(", ")}`;
              }
              return null;
            })
            .filter(Boolean)
            .join("; ");
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllPaymentSchedules = (isChecked) => {
    const updatedSchedules = selectedPaymentSchedules.map((schedule) => ({
      ...schedule,
      selected: isChecked,
    }));
    setSelectedPaymentSchedules(updatedSchedules);
  };

  const handleSelectAllAdditionalCharges = (isChecked) => {
    const updatedCharges = selectedAdditionalCharges.map((charge) => ({
      ...charge,
      selected: isChecked,
    }));
    setSelectedAdditionalCharges(updatedCharges);
  };

  return (
    <div className="modal-overlay">
      <Toaster />
      <div className="invoice-modal-container bg-white rounded-md w-[1006px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center md:p-6 border-gray-200 flex-shrink-0">
          <h2 className="text-[#201D1E] invoice-modal-head">
            Create New Invoice
          </h2>
          <button
            onClick={closeModal}
            className="invoice-modal-close-btn hover:bg-gray-100 duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 md:overflow-y-auto md:p-6">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          )}
          {!loading &&
            selectedPaymentSchedules.length === 0 &&
            selectedAdditionalCharges.length === 0 &&
            tenancyDetails && (
              <div className="text-gray-600 mb-5">
                No pending payment schedules or additional charges available for
                this tenancy.
              </div>
            )}

          <div className="invoice-modal-grid gap-6">
            <div>
              <label className="block mb-3 invoice-modal-label">
                Select Building
              </label>
              <div className="relative">
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("building")}
                  onBlur={() =>
                    setTimeout(() => toggleDropdown("building"), 150)
                  }
                  className={`block w-full border py-2 px-3 pr-8 focus:outline-none focus:ring-gray-500 focus:border-gray-500 appearance-none invoice-modal-select ${
                    formData.building === "" ? "invoice-modal-selected" : ""
                  }`}
                  disabled={loading}
                >
                  <option value="" disabled>
                    Choose Building
                  </option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name} ({building.code})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#201D1E] pointer-events-none transition-transform duration-200 ${
                    openDropdowns.building ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">
                Select Unit
              </label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("unit")}
                  onBlur={() => setTimeout(() => toggleDropdown("unit"), 150)}
                  className={`block w-full border py-2 px-3 pr-8 focus:outline-none focus:ring-gray-500 focus:border-gray-500 appearance-none invoice-modal-select ${
                    formData.unit === "" ? "invoice-modal-selected" : ""
                  }`}
                  disabled={loading || !formData.building}
                >
                  <option value="" disabled>
                    Choose Unit
                  </option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name} ({unit.code})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#201D1E] pointer-events-none transition-transform duration-200 ${
                    openDropdowns.unit ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">
                Select Tenancy
              </label>
              <div className="relative">
                <select
                  name="tenancy"
                  value={formData.tenancy}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("tenancy")}
                  onBlur={() =>
                    setTimeout(() => toggleDropdown("tenancy"), 150)
                  }
                  className={`block w-full border py-2 px-3 pr-8 focus:outline-none focus:ring-gray-500 focus:border-gray-500 appearance-none invoice-modal-select ${
                    formData.tenancy === "" ? "invoice-modal-selected" : ""
                  }`}
                  disabled={loading || !formData.unit}
                >
                  <option value="" disabled>
                    Choose Tenancy
                  </option>
                  {tenancies.map((tenancy) => (
                    <option key={tenancy.id} value={tenancy.id}>
                      {tenancy.tenancy_code} - {tenancy.tenant?.tenant_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#201D1E] pointer-events-none transition-transform duration-200 ${
                    openDropdowns.tenancy ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="block mb-3 invoice-modal-label">
                  In Date*
                </label>
                <input
                  type="date"
                  name="inDate"
                  value={formData.inDate}
                  onChange={handleChange}
                  className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-select"
                  required
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="block mb-3 invoice-modal-label">
                  Due Date*
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="block w-full border py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-select"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-3 invoice-modal-label">
                Building Name*
              </label>
              <input
                type="text"
                name="building_name"
                value={formData.building_name}
                className="block w-full border py-2 px-3 bg-gray-100 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-select"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-3 invoice-modal-label">
                Unit Name*
              </label>
              <input
                type="text"
                name="unit_name"
                value={formData.unit_name}
                className="block w-full border py-2 px-3 bg-gray-100 focus:outline-none focus:ring-gray-500 focus:border-gray-500 invoice-modal-select"
                readOnly
              />
            </div>
          </div>

          {/* Payment Schedules Table */}
          {selectedPaymentSchedules.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg mb-3 payment-heading">
                Payment Schedules
              </h3>
              <div className="border border-[#E9E9E9] rounded-md invoice-mobile-section-container">
                {/* Desktop Table */}
                <div className="invoice-desktop-table">
                  {/* Fixed Header */}
                  <div className="invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <thead className="bg-white">
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[50px]">
                            <input
                              type="checkbox"
                              checked={
                                selectedPaymentSchedules.length > 0 &&
                                selectedPaymentSchedules.every(
                                  (item) => item.selected
                                )
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                handleSelectAllPaymentSchedules(isChecked);
                              }}
                              className="table-checkbox"
                            />
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Charge Type
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[180px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                            Due Date
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Tax
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Amount Paid
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[80px]">
                            Balance
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="max-h-64 overflow-y-auto invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <tbody>
                        {selectedPaymentSchedules.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b border-[#E9E9E9] last:border-b-0 ${
                              item.status === "partially_paid"
                                ? "bg-yellow-100"
                                : ""
                            }`}
                          >
                            <td className="px-[10px] py-[5px] w-[50px]">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() =>
                                  handlePaymentScheduleToggle(index)
                                }
                                className="tdata-checkbox"
                              />
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.charge_type}
                            </td>
                            <td className="px-[10px] py-[5px] w-[180px] invoice-modal-tdata">
                              {item.description}
                            </td>
                            <td className="px-[10px] py-[5px] w-[120px] invoice-modal-tdata">
                              {item.due_date}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.amount}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.tax}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.amount_paid}
                            </td>
                            <td className="px-[10px] py-[5px] w-[80px] invoice-modal-tdata">
                              {item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Table */}
                <div className="invoice-mobile-table">
                  {selectedPaymentSchedules.map((item, index) => (
                    <div
                      key={index}
                      className={`border-b border-[#E9E9E9] last:border-b-0 invoice-mobile-section ${
                        item.status === "partially_paid" ? "bg-yellow-100" : ""
                      }`}
                    >
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[25%]">
                          Select
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[40%]">
                          Charge Type
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[35%]">
                          Description
                        </div>
                      </div>
                      <div className="flex justify-between h-[67px] border-b border-[#E9E9E9]">
                        <div className="px-[10px] py-[13px] w-[25%]">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handlePaymentScheduleToggle(index)}
                            className="tdata-checkbox"
                          />
                        </div>
                        <div className="px-[10px] py-[13px] w-[40%] invoice-modal-tdata">
                          {item.charge_type}
                        </div>
                        <div className="px-[10px] py-[13px] w-[35%] invoice-modal-tdata">
                          {item.description}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Due Date
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Amount
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.due_date}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.amount}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Tax
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Amount Paid
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.tax}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.amount_paid}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Balance
                        </div>
                      </div>
                      <div className="flex justify-start h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Charges Table */}
          {selectedAdditionalCharges.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg mb-3 additional-charges-heading">
                Additional Charges
              </h3>
              
              <div className="border border-[#E9E9E9] rounded-md invoice-mobile-section-container">
                {/* Desktop Table */}
                <div className="invoice-desktop-table">
                  {/* Fixed Header */}
                  <div className="invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <thead className="bg-white">
                        <tr className="border-b border-[#E9E9E9] h-[57px]">
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[50px]">
                            <input
                              type="checkbox"
                              checked={
                                selectedAdditionalCharges.length > 0 &&
                                selectedAdditionalCharges.every(
                                  (item) => item.selected
                                )
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                handleSelectAllAdditionalCharges(isChecked);
                              }}
                              className="table-checkbox"
                            />
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                            Charge Type
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[180px]">
                            Description
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[120px]">
                            Due Date
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Amount
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Tax
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[100px]">
                            Amount Paid
                          </th>
                          <th className="px-[10px] text-left invoice-modal-thead uppercase w-[80px]">
                            Balance
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Scrollable Body */}
                  <div className="max-h-64 overflow-y-auto invoice-modal-overflow-x-auto">
                    <table className="invoice-modal-table border-collapse w-full">
                      <tbody>
                        {selectedAdditionalCharges.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b border-[#E9E9E9] last:border-b-0 ${
                              item.status === "partially_paid"
                                ? "bg-yellow-100"
                                : ""
                            }`}
                          >
                            <td className="px-[10px] py-[5px] w-[50px]">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() =>
                                  handleAdditionalChargeToggle(index)
                                }
                                className="tdata-checkbox"
                              />
                            </td>
                            <td className="px-[10px] py-[5px] w-[120px] invoice-modal-tdata">
                              {item.charge_type}
                            </td>
                            <td className="px-[10px] py-[5px] w-[180px] invoice-modal-tdata">
                              {item.description}
                            </td>
                            <td className="px-[10px] py-[5px] w-[120px] invoice-modal-tdata">
                              {item.due_date}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.amount}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.tax}
                            </td>
                            <td className="px-[10px] py-[5px] w-[100px] invoice-modal-tdata">
                              {item.amount_paid}
                            </td>
                            <td className="px-[10px] py-[5px] w-[80px] invoice-modal-tdata">
                              {item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Table */}
                <div className="invoice-mobile-table">
                  
                  {selectedAdditionalCharges.map((item, index) => (
                    <div
                      key={index}
                      className={`border-b border-[#E9E9E9] last:border-b-0 invoice-mobile-section ${
                        item.status === "partially_paid" ? "bg-yellow-100" : ""
                      }`}
                    >
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[25%]">
                          Select
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[40%]">
                          Charge Type
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[35%]">
                          Description
                        </div>
                      </div>
                      <div className="flex justify-between h-[67px] border-b border-[#E9E9E9]">
                        <div className="px-[10px] py-[13px] w-[25%]">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleAdditionalChargeToggle(index)}
                            className="tdata-checkbox"
                          />
                        </div>
                        <div className="px-[10px] py-[13px] w-[40%] invoice-modal-tdata">
                          {item.charge_type}
                        </div>
                        <div className="px-[10px] py-[13px] w-[35%] invoice-modal-tdata">
                          {item.description}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Due Date
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Amount
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.due_date}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.amount}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Tax
                        </div>
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Amount Paid
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.tax}
                        </div>
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.amount_paid}
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                        <div className="px-[10px] flex items-center invoice-modal-thead uppercase w-[50%]">
                          Balance
                        </div>
                      </div>
                      <div className="flex justify-start h-[67px]">
                        <div className="px-[10px] py-[13px] w-[50%] invoice-modal-tdata">
                          {item.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <div className="text-lg grand-total-text">
              Grand Total: {calculateGrandTotal()}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="md:p-4 mt-4 border-gray-200 flex justify-end flex-shrink-0 md:mr-2">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#2892CE] hover:bg-[#076094] duration-200 text-white py-2 px-6 mb-3 invoice-modal-save-btn"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
