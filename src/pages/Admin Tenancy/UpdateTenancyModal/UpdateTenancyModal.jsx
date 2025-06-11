import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateTenancyModal.css";
import { ChevronDown, X, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "../../../utils/config";

const UpdateTenancyModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const navigate = useNavigate();
  const [selectOpenStates, setSelectOpenStates] = useState({});
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [displayBuildings, setDisplayBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [displayUnits, setDisplayUnits] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taxModalData, setTaxModalData] = useState({
    isOpen: false,
    chargeId: null,
    taxDetails: [],
  });
  const [expandedStates, setExpandedStates] = useState({});

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
    commission: "",
    remarks: "",
    status: "pending",
  });

  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [paymentSchedule, setPaymentSchedule] = useState([]);

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

  // Initialize form data when modal opens
  useEffect(() => {
    if (
      modalState.isOpen &&
      modalState.type === "tenancy-update" &&
      modalState.data
    ) {
      const tenancy = modalState.data;

      const newFormData = {
        tenant: tenancy.tenant?.id?.toString() || "",
        building: tenancy.building?.id?.toString() || "",
        unit: tenancy.unit?.id?.toString() || "",
        rental_months: tenancy.rental_months?.toString() || "",
        start_date: tenancy.start_date || "",
        end_date: tenancy.end_date || "",
        no_payments: tenancy.no_payments?.toString() || "",
        first_rent_due_on: tenancy.first_rent_due_on || "",
        rent_per_frequency: tenancy.rent_per_frequency
          ? parseFloat(tenancy.rent_per_frequency).toFixed(2)
          : "",
        total_rent_receivable: tenancy.total_rent_receivable
          ? parseFloat(tenancy.total_rent_receivable).toFixed(2)
          : "",
        deposit: tenancy.deposit ? parseFloat(tenancy.deposit).toFixed(2) : "",
        commission: tenancy.commision
          ? parseFloat(tenancy.commision).toFixed(2)
          : "",
        remarks: tenancy.remarks || "",
        status: tenancy.status || "pending",
      };
      setFormData(newFormData);

      const newAdditionalCharges = tenancy.additional_charges?.map(
        (charge, index) => ({
          id: (index + 1).toString().padStart(2, "0"),
          charge_type: charge.charge_type?.id?.toString() || "",
          reason: charge.reason || "",
          due_date: charge.due_date || "",
          status: charge.status || "pending",
          amount: charge.amount ? parseFloat(charge.amount).toFixed(2) : "",
          tax: charge.tax ? parseFloat(charge.tax).toFixed(2) : "0.00",
          total: charge.total ? parseFloat(charge.total).toFixed(2) : "0.00",
          tax_details: charge.tax_details || [],
        })
      ) || [];
      setAdditionalCharges(newAdditionalCharges);

      const newPaymentSchedule = tenancy.payment_schedules?.map(
        (item, index) => ({
          id: (index + 1).toString().padStart(2, "0"),
          charge_type: item.charge_type?.id?.toString() || "",
          charge_type_name: item.charge_type?.name || "",
          reason: item.reason || "",
          due_date: item.due_date || "",
          status: item.status || "pending",
          amount: item.amount ? parseFloat(item.amount).toFixed(2) : "",
          tax: item.tax ? parseFloat(item.tax).toFixed(2) : "0.00",
          total: item.total ? parseFloat(item.total).toFixed(2) : "",
          tax_details: item.tax_details || [],
        })
      ) || [];
      setPaymentSchedule(newPaymentSchedule);

      const newExpandedStates = tenancy.payment_schedules?.reduce(
        (acc, item, index) => ({
          ...acc,
          [(index + 1).toString().padStart(2, "0")]: false,
        }),
        {}
      ) || {};
      setExpandedStates(newExpandedStates);

      setError(null);
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        toast.error("Company ID invalid.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [tenantsRes, buildingsRes, buildingsVacant, chargeTypesRes] =
          await Promise.all([
            axios.get(`${BASE_URL}/company/tenant/company/${companyId}/`),
            axios.get(`${BASE_URL}/company/buildings/company/${companyId}/`),
            axios.get(`${BASE_URL}/company/buildings/vacant/${companyId}/`),
            axios.get(`${BASE_URL}/company/charges/company/${companyId}/`),
          ]);

        setTenants(tenantsRes.data);
        setBuildings(buildingsRes.data);
        setChargeTypes(chargeTypesRes.data);

        // Combine vacant buildings with the current tenancy's building
        const tenancyBuilding = modalState.data?.building;
        if (tenancyBuilding) {
          const combinedBuildings = [...buildingsVacant.data];
          const isTenancyBuildingInVacant = buildingsVacant.data.some(
            (building) => building.id === tenancyBuilding.id
          );
          if (!isTenancyBuildingInVacant) {
            combinedBuildings.push(tenancyBuilding);
          }
          const uniqueBuildings = Array.from(
            new Map(combinedBuildings.map((building) => [building.id, building])).values()
          );
          setDisplayBuildings(uniqueBuildings);
        } else {
          setDisplayBuildings(buildingsVacant.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load tenancy data. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (modalState.isOpen && modalState.type === "tenancy-update") {
      fetchData();
    }
  }, [modalState.isOpen, modalState.type, modalState.data]);

  // Fetch units when building changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (formData.building) {
        try {
          const response = await axios.get(
            `${BASE_URL}/company/units/${formData.building}/vacant-units/`
          );
          const vacantUnits = response.data;
          setUnits(vacantUnits);

          // Combine vacant units with the current tenancy's unit
          const tenancyUnit = modalState.data?.unit;
          const tenancyBuildingId = modalState.data?.building?.id;
          if (tenancyUnit && parseInt(formData.building) === tenancyBuildingId) {
            const combinedUnits = [...vacantUnits];
            const isTenancyUnitInVacant = vacantUnits.some(
              (unit) => unit.id === tenancyUnit.id
            );
            if (!isTenancyUnitInVacant) {
              combinedUnits.push(tenancyUnit);
            }
            const uniqueUnits = Array.from(
              new Map(combinedUnits.map((unit) => [unit.id, unit])).values()
            );
            setDisplayUnits(uniqueUnits);
          } else {
            setDisplayUnits(vacantUnits);
          }
        } catch (error) {
          console.error("Error fetching units:", error);
          setUnits([]);
          setDisplayUnits([]);
          toast.error("Failed to load units.");
        }
      } else {
        setUnits([]);
        setDisplayUnits([]);
      }
    };
    fetchUnits();
  }, [formData.building, modalState.data]);

  // Update end_date and total_rent_receivable
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

    if (formData.rent_per_frequency && formData.rental_months) {
      const total = (
        parseFloat(formData.rent_per_frequency) * parseInt(formData.rental_months)
      ).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        total_rent_receivable: total,
      }));
    }
  }, [
    formData.start_date,
    formData.rental_months,
    formData.rent_per_frequency,
    formData.no_payments,
    formData.first_rent_due_on,
  ]);

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
          setLoading(true);
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
          const schedules = response.data.payment_schedules.map((item, index) => ({
            ...item,
            id: (index + 1).toString().padStart(2, "0"),
          }));
          setPaymentSchedule(schedules);
          setExpandedStates(
            schedules.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
          );
        } catch (error) {
          console.error("Error fetching payment schedule preview:", error);
          setPaymentSchedule([]);
          toast.error("Failed to load payment schedule preview.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPaymentSchedulePreview();
  }, [showPaymentSchedule]);

  // Fetch tax preview for additional charges
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

  if (
    !modalState.isOpen ||
    modalState.type !== "tenancy-update" ||
    !modalState.data
  ) {
    return null;
  }

  const toggleSelectOpen = (selectId) => {
    setSelectOpenStates((prev) => ({
      ...prev,
      [selectId]: !prev[selectId],
    }));
  };

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

  const handlePaymentScheduleChange = (id, field, value) => {
    setPaymentSchedule((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "amount" || field === "tax") {
            const amount = parseFloat(updatedItem.amount || 0);
            const tax = parseFloat(updatedItem.tax || 0);
            updatedItem.total = (amount + tax).toFixed(2);
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
        status: "pending",
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

  const togglePaymentSchedule = () => {
    setShowPaymentSchedule(!showPaymentSchedule);
  };

  const toggleExpand = (id) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showTaxDetails = (chargeId, isAdditionalCharge = true) => {
    const charges = isAdditionalCharge ? additionalCharges : paymentSchedule;
    const charge = charges.find((c) => c.id === chargeId);
    if (charge) {
      setTaxModalData({
        isOpen: true,
        chargeId,
        taxDetails: charge.tax_details || [],
      });
    } else {
      setTaxModalData({
        isOpen: true,
        chargeId,
        taxDetails: [],
      });
    }
  };

  const closeTaxModal = () => {
    setTaxModalData({ isOpen: false, chargeId: null, taxDetails: [] });
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
        toast.error(`Please fill the ${field.replace("_", " ")} field`);
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
        toast.error("Please fill all fields in Additional Charges");
        return;
      }
    }
    for (const item of paymentSchedule) {
      if (
        !item.charge_type ||
        !item.reason ||
        !item.due_date ||
        !item.amount ||
        item.tax === ""
      ) {
        toast.error("Please fill all fields in Payment Schedule");
        return;
      }
    }

    const companyId = getUserCompanyId();
    const userId = getRelevantUserId();
    const tenancyId = modalState.data?.id;

    if (!companyId) {
      toast.error("Company ID is missing or invalid");
      return;
    }
    if (!tenancyId) {
      toast.error("Tenancy ID is missing");
      return;
    }

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
      status: formData.status,
      additional_charges: additionalCharges.map((charge) => ({
        charge_type: parseInt(charge.charge_type),
        reason: charge.reason,
        due_date: charge.due_date,
        status: charge.status,
        amount: parseFloat(charge.amount).toFixed(2),
        tax: parseFloat(charge.tax).toFixed(2),
        total: parseFloat(charge.total).toFixed(2),
        tax_details: charge.tax_details,
      })),
      payment_schedules: paymentSchedule.map((item) => ({
        charge_type: parseInt(item.charge_type),
        reason: item.reason,
        due_date: item.due_date,
        status: item.status,
        amount: parseFloat(item.amount).toFixed(2),
        tax: parseFloat(item.tax).toFixed(2),
        total: parseFloat(item.total).toFixed(2),
        tax_details: item.tax_details,
      })),
    };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${BASE_URL}/company/tenancies/${tenancyId}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update tenancy");
      }

      toast.success("Tenancy updated successfully");
      triggerRefresh();
      closeModal();
    } catch (error) {
      console.error("Error updating tenancy:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update tenancy. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.tenant) {
    return <div className="text-lg">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 update-tenancy-modal-overlay">
      <Toaster />
      <div
        onClick={(e) => e.stopPropagation()}
        className="update-tenancy-modal-container relative bg-white rounded-md w-full max-w-[100%] md:max-w-[80%] p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="update-tenancy-modal-head">Update Tenancy</h2>
          <button
            onClick={closeModal}
            className="update-tenancy-close-btn hover:bg-gray-100 duration-200"
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={16} color="#201D1E" />
          </button>
        </div>

        <div className="update-tenancy-modal-grid gap-6">
          <div>
            <label className="block update-tenancy-modal-label">Tenant*</label>
            <div className="relative">
              <select
                name="tenant"
                value={formData.tenant}
                onChange={handleInputChange}
                className="w-full p-2 appearance-none update-tenancy-input-box"
                onFocus={() => toggleSelectOpen("tenant")}
                onBlur={() => toggleSelectOpen("tenant")}
                disabled={loading}
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
                size={22}
                color="#201D1E"
              />
            </div>
          </div>
          <div>
            <label className="block update-tenancy-modal-label">Building*</label>
            <div className="relative">
              <select
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                className="w-full p-2 appearance-none update-tenancy-input-box"
                onFocus={() => toggleSelectOpen("building")}
                onBlur={() => toggleSelectOpen("building")}
                disabled={loading}
              >
                <option value="">Choose</option>
                {displayBuildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.building_name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                  selectOpenStates["building"] ? "rotate-180" : "rotate-0"
                }`}
                size={22}
                color="#201D1E"
              />
            </div>
          </div>

          <div className="md:flex update-tenancy-column gap-4">
            <div className="w-1/2">
              <label className="block update-tenancy-modal-label">Unit*</label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full p-2 appearance-none update-tenancy-input-box"
                  onFocus={() => toggleSelectOpen("unit-selection")}
                  onBlur={() => toggleSelectOpen("unit-selection")}
                  disabled={loading}
                >
                  <option value="">Choose</option>
                  {displayUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-[11px] top-[11px] text-gray-400 pointer-events-none transition-transform duration-300 ${
                    selectOpenStates["unit-selection"] ? "rotate-180" : "rotate-0"
                  }`}
                  size={22}
                  color="#201D1E"
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block update-tenancy-modal-label">
                Rental Months*
              </label>
              <input
                type="number"
                name="rental_months"
                value={formData.rental_months}
                onChange={handleInputChange}
                placeholder="Enter Rental Months"
                className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-input-box"
                min="1"
                disabled={loading}
              />
            </div>
          </div>
          <div className="md:flex update-tenancy-column gap-4">
            <div className="w-1/2">
              <label className="block update-tenancy-modal-label">
                Start Date*
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-gray-400 update-tenancy-input-box"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block update-tenancy-modal-label">End Date*</label>
              <div className="relative">
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  readOnly
                  className="w-full p-2 bg-gray-100 update-tenancy-input-box"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="md:flex update-tenancy-column gap-4">
            <div className="w-1/2">
              <label className="block update-tenancy-modal-label">
                No. Of Payments*
              </label>
              <input
                type="number"
                name="no_payments"
                value={formData.no_payments}
                onChange={handleInputChange}
                placeholder="Enter No. Of Payments"
                className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-input-box"
                min="1"
                disabled={loading}
              />
            </div>
            <div className="w-1/2">
              <label className="block update-tenancy-modal-label">
                First Rent Due On*
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="first_rent_due_on"
                  value={formData.first_rent_due_on}
                  onChange={handleInputChange}
                  className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-gray-400 update-tenancy-input-box"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block update-tenancy-modal-label">
              Rent Per Frequency
            </label>
            <input
              type="number"
              name="rent_per_frequency"
              value={formData.rent_per_frequency}
              onChange={handleInputChange}
              placeholder="Enter Rent Per Frequency"
              className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-input-box"
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block update-tenancy-modal-label">
              Total Rent Receivable
            </label>
            <input
              type="text"
              name="total_rent_receivable"
              value={formData.total_rent_receivable}
              readOnly
              className="w-full p-2 bg-gray-100 update-tenancy-input-box"
              disabled
            />
          </div>
          <div>
            <label className="block update-tenancy-modal-label">
              Deposit (If Any)
            </label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
              placeholder="Enter Deposit"
              className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-input-box"
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block update-tenancy-modal-label">
              Commission (If Any)
            </label>
            <input
              type="number"
              name="commission"
              value={formData.commission}
              onChange={handleInputChange}
              placeholder="Enter Commission"
              className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-input-box"
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block update-tenancy-modal-label">Remarks*</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Enter Remarks"
              className="w-full p-2 focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-input-box"
              disabled={loading}
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
          <div className="mt-6 update-tenancy-overflow-x-auto update-tenancy-additional-charges-container border border-[#E9E9E9] rounded-md">
            <div className="update-tenancy-desktop-table">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E9E9] h-[57px]">
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[20px]">
                      NO
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[138px]">
                      CHARGE TYPE
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[162px]">
                      REASON
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[173px]">
                      DUE DATE
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[55px]">
                      STATUS
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[148px]">
                      AMOUNT
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[70px]">
                      TAX
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[43px]">
                      TOTAL
                    </th>
                    <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[61px]">
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
                          className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white update-tenancy-modal-table-select"
                          onFocus={() => toggleSelectOpen(`charge-${charge.id}`)}
                          onBlur={() => toggleSelectOpen(`charge-${charge.id}`)}
                          disabled={loading}
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
                          size={16}
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
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input"
                          disabled={loading}
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
                          className="w-full h-[38px] border focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-gray-400 update-tenancy-modal-table-input"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-[10px] py-[5px] w-[55px] text-[14px] text-[#201D1E]">
                        {charge.status}
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
                          className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input"
                          step="0.01"
                          min="0"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-[10px] py-[5px] w-[70px]">
                        <button
                          onClick={() => showTaxDetails(charge.id, true)}
                          className="text-[#2892CE] underline"
                          disabled={parseFloat(charge.tax) === 0 && !charge.tax_details.length}
                        >
                          {charge.tax}
                        </button>
                      </td>
                      <td className="px-[10px] py-[5px] w-[43px] text-[14px] text-[#201D1E]">
                        {charge.total}
                      </td>
                      <td className="px-[10px] py-[5px] w-[61px]">
                        <button
                          onClick={() => removeRow(charge.id)}
                          aria-label="Remove charge"
                          disabled={loading}
                        >
                          <Trash2 size={20} color="#201D1E" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="update-tenancy-mobile-table">
              {additionalCharges.map((charge) => (
                <div
                  key={charge.id}
                  className="border-b border-[#E9E9E9] last:border-b-0 update-tenancy-mobile-section-container"
                >
                  <div className="flex justify-start border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                      NO
                    </div>
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase w-[44%]">
                      CHARGE TYPE
                    </div>
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
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
                        className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white update-tenancy-modal-table-select"
                        onFocus={() => toggleSelectOpen(`charge-${charge.id}`)}
                        onBlur={() => toggleSelectOpen(`charge-${charge.id}`)}
                        disabled={loading}
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
                        size={16}
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
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                      DUE DATE
                    </div>
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead w-[7%] uppercase">
                      STATUS
                    </div>
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead w-[41.5%] uppercase">
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
                        className="w-full h-[38px] border focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-gray-400 update-tenancy-modal-table-input"
                        disabled={loading}
                      />
                    </div>
                    <div className="py-[10px] text-[14px] text-[#201D1E]">
                      {charge.status}
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
                        className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input"
                        step="0.01"
                        min="0"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead w-[20%] uppercase">
                      TAX
                    </div>
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                      TOTAL
                    </div>
                    <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                      REMOVE
                    </div>
                  </div>
                  <div className="flex justify-between h-[57px]">
                    <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E] text-center">
                      <button
                        onClick={() => showTaxDetails(charge.id, true)}
                        className="text-[#2892CE] underline"
                        disabled={parseFloat(charge.tax) === 0 && !charge.tax_details.length}
                      >
                        {charge.tax}
                      </button>
                    </div>
                    <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E]">
                      {charge.total}
                    </div>
                    <div className="px-[10px] py-[3px] flex justify-center">
                      <button onClick={() => removeRow(charge.id)} disabled={loading}>
                        <Trash2 size={20} color="#201D1E" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={addRow}
            className="mt-6 bg-[#2892CE] hover:bg-[#1f6c99] duration-200 text-white px-4 pl-6 mb-10 flex items-center update-tenancy-addrow-btn"
            aria-label="Add additional charge row"
            disabled={loading}
          >
            Add Row
            <Plus size={20} color="#ffffff" className="ml-2" />
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={togglePaymentSchedule}
            className="bg-white text-[#2892CE] px-4 py-2 border border-[#E9E9E9] rounded update-tenancy-btn"
            aria-label={
              showPaymentSchedule
                ? "Hide payment schedule"
                : "Show payment schedule"
            }
            disabled={loading}
          >
            {showPaymentSchedule ? "Hide Payment Schedule" : "Show Payment Schedule"}
          </button>

          {showPaymentSchedule && (
            <div className="mt-6 update-tenancy-overflow-x-auto">
              <div className="update-tenancy-desktop-table">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#E9E9E9] h-[57px]">
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[53px]">
                        NO
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[138px]">
                        CHARGE TYPE
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[162px]">
                        REASON
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[173px]">
                        DUE DATE
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[55px]">
                        STATUS
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[148px]">
                        AMOUNT
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[70px]">
                        TAX
                      </th>
                      <th className="px-[10px] text-left update-tenancy-modal-thead uppercase w-[43px]">
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
                        <td className="px-[10px] py-[5px] w-[53px] text-[14px] text-[#201D1E]">
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
                            className="w-full h-[38px] border text-gray-700 appearance-none focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-white update-tenancy-modal-table-select cursor-not-allowed"
                            disabled
                          >
                            <option value="">Choose</option>
                            {chargeTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
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
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input cursor-not-allowed"
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
                            className="w-full h-[38px] border focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-gray-400 update-tenancy-modal-table-input"
                            disabled={loading}
                          />
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
                            className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input"
                            step="0.01"
                            min="0"
                            disabled={loading}
                          />
                        </td>
                        <td className="px-[10px] py-[5px] w-[70px]">
                          <button
                            onClick={() => showTaxDetails(item.id, false)}
                            className="text-[#2892CE] underline"
                            disabled={parseFloat(item.tax) === 0 && !item.tax_details.length}
                          >
                            {item.tax}
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
              <div className="update-tenancy-mobile-table">
                {paymentSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="update-tenancy-mobile-payment-section"
                  >
                    <div
                      className={`flex justify-between border-b border-[#E9E9E9] h-[57px] rounded-t ${
                        expandedStates[item.id] ? "bg-[#F2F2F2]" : "bg-white"
                      }`}
                    >
                      <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                        NO
                      </div>
                      <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                        CHARGE TYPE
                      </div>
                      <div className="px-[10px] w-[30%] flex items-center update-tenancy-modal-thead uppercase">
                        REASON
                      </div>
                    </div>
                    <div
                      className={`flex justify-between h-[67px] cursor-pointer ${
                        expandedStates[item.id] ? "border-b border-[#E9E9E9]" : ""
                      }`}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E]">
                        {item.id}
                      </div>
                      <div className="px-[10px] py-[13px] w-[35%] text-[14px] text-[#201D1E]">
                        {chargeTypes.find(
                          (type) => type.id === parseInt(item.charge_type)
                        )?.name || item.charge_type_name}
                      </div>
                      <div className="px-[10px] py-[13px] w-[30%] text-[14px] text-[#201D1E]">
                        {item.reason}
                      </div>
                    </div>

                    {expandedStates[item.id] && (
                      <>
                        <div className="flex justify-between border-b border-[#E9E9E9] bg-[#F2F2F2] h-[57px]">
                          <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase">
                            DUE DATE
                          </div>
                          <div className="px-[10px] flex items-center w-[7%] update-tenancy-modal-thead uppercase">
                            STATUS
                          </div>
                          <div className="px-[10px] flex items-center w-[41.5%] update-tenancy-modal-thead uppercase">
                            AMOUNT
                          </div>
                        </div>
                        <div className="flex justify-start border-b border-[#E9E9E9] h-[67px]">
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
                              className="w-full h-[38px] border focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-gray-400 update-tenancy-modal-table-input"
                              disabled={loading}
                            />
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
                              className="w-full h-[38px] border placeholder-[#b7b5be] focus:outline-none focus:ring-gray-700 focus:border-gray-700 update-tenancy-modal-table-input"
                              step="0.01"
                              min="0"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between bg-[#F2F2F2] h-[57px] border-b border-[#E9E9E9]">
                          <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase w-[50%]">
                            TAX
                          </div>
                          <div className="px-[10px] flex items-center update-tenancy-modal-thead uppercase w-[50%]">
                            TOTAL
                          </div>
                        </div>
                        <div className="flex justify-between h-[57px]">
                          <div className="px-[13px] py-[13px] text-[14px] text-[#201D1E] text-center">
                            <button
                              onClick={() => showTaxDetails(item.id, false)}
                              className="text-[#2892CE] underline"
                              disabled={parseFloat(item.tax) === 0 && !item.tax_details.length}
                            >
                              {item.tax}
                            </button>
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
            className={`text-white rounded w-[150px] h-[38px] update-tenancy-save-btn duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2892CE] hover:bg-[#2276a7]"
            }`}
            aria-label="Save tenancy"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
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
                        <th className="border border-gray-300 py-2 text-left">
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
                            {tax.tax_type}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {tax.tax_percentage}%
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {tax.tax_amount}
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
  );
};

export default UpdateTenancyModal;