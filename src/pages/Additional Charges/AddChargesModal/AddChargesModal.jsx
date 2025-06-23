import React, { useEffect, useState } from "react";
import "./AddChargesModal.css";
import { ChevronDown, X } from "lucide-react";
import closeicon from "../../../assets/Images/Additional Charges/close-icon.svg";
import plusicon from "../../../assets/Images/Additional Charges/input-plus-icon.svg";
import { useModal } from "../../../context/ModalContext";
import axios from "axios";
import { BASE_URL } from "../../../utils/config";
import { toast } from "react-hot-toast";

const AddChargesModal = () => {
  const { modalState, closeModal, triggerRefresh } = useModal();
  const [formData, setFormData] = useState({
    building: "",
    unit: "",
    tenancy: "",
    inDate: "",
    chargeCode: "",
    reason: "",
    amountDue: "",
    taxAmount: "",
    totalAmount: "",
    dueDate: "",
    status: "",
    remarks: "",
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    building: false,
    unit: false,
    tenancy: false,
    chargeCode: false,
    status: false,
  });
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchBuildings = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("No company ID found");
        toast.error("No company ID found");
        return;
      }

      setLoading(true);
      setError(null);

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
    } finally {
      setLoading(false);
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

      setError(null);

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

      setError(null);

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

  const fetchChargeTypes = async () => {
    try {
      const companyId = getUserCompanyId();
      if (!companyId) {
        setError("Company ID not found");
        toast.error("Company ID not found");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/company/charges/company/${companyId}/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setChargeTypes(response.data);
      } else {
        setChargeTypes([]);
      }
    } catch (error) {
      console.error("Error fetching charge types:", error);
      setError("Failed to fetch charge types");
      toast.error("Failed to fetch charge types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "create-additional-charges") {
      setFormData({
        building: "",
        unit: "",
        tenancy: "",
        inDate: "",
        chargeCode: "",
        reason: "",
        amountDue: "",
        taxAmount: "",
        totalAmount: "",
        dueDate: "",
        status: "",
        remarks: "",
      });
      setBuildings([]);
      setUnits([]);
      setTenancies([]);
      setChargeTypes([]);
      setError("");
      fetchBuildings();
      fetchChargeTypes();
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
      }));
      setUnits([]);
      setTenancies([]);
      fetchUnits(value);
    } else if (name === "unit" && value) {
      setFormData((prev) => ({
        ...prev,
        tenancy: "",
      }));
      setTenancies([]);
      fetchTenancies(value);
    } else if (name === "tenancy" || name === "inDate" || name === "chargeCode" || name === "reason" || name === "dueDate" || name === "amountDue" || name === "status" || name === "remarks") {
      setError("");
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    const fetchTaxPreview = async () => {
      const companyId = getUserCompanyId();
      if (!companyId || !formData.chargeCode || !formData.amountDue || !formData.dueDate || !formData.inDate) {
        setFormData((prev) => ({
          ...prev,
          taxAmount: "",
          totalAmount: "",
        }));
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/company/tenancies/preview-additional-charge-tax/`,
          {
            company: companyId,
            charge_type: formData.chargeCode,
            amount: formData.amountDue,
            due_date: formData.dueDate,
            in_date: formData.inDate,
            reason: formData.reason || "Additional Charge",
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            taxAmount: response.data.additional_charge.tax || "0.00",
            totalAmount: response.data.additional_charge.total || "0.00",
          }));
          setError("");
        } else {
          setFormData((prev) => ({
            ...prev,
            taxAmount: "",
            totalAmount: "",
          }));
          setError(response.data.message || "Failed to fetch tax preview");
          toast.error(response.data.message || "Failed to fetch tax preview");
        }
      } catch (err) {
        setFormData((prev) => ({
          ...prev,
          taxAmount: "",
          totalAmount: "",
        }));
        setError("Error fetching tax preview: " + err.message);
        toast.error("Error fetching tax preview: " + err.message);
      }
    };

    fetchTaxPreview();
  }, [formData.chargeCode, formData.amountDue, formData.dueDate, formData.inDate, formData.reason]);

  const handleSave = async () => {
    if (!formData.building || !formData.unit || !formData.tenancy || !formData.chargeCode || !formData.reason || !formData.dueDate || !formData.amountDue || !formData.status || !formData.inDate) {
      setError("Please fill all required fields (Building, Unit, Tenancy Contract, Charge Code, Reason, In Date, Due Date, Amount Due, Status)");
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      tenancy: formData.tenancy,
      charge_type: formData.chargeCode,
      reason: formData.reason,
      in_date: formData.inDate,
      due_date: formData.dueDate,
      amount: formData.amountDue,
      tax: formData.taxAmount || "0.00",
      status: formData.status,
      remarks: formData.remarks,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/company/additional-charges/create/`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

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
            <X size={20} />
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        )}

        <div className="md:p-6 mt-[-15px]">
          <div className="grid ac-grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block add-charges-label">Select Building*</label>
              <div className="relative">
                <select
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("building")}
                  onBlur={() => setTimeout(() => toggleDropdown("building"), 150)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !formData.building ? "add-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled>Choose Building</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name} ({building.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      openDropdowns.building ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Select Unit*</label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("unit")}
                  onBlur={() => setTimeout(() => toggleDropdown("unit"), 150)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !formData.unit ? "add-charges-selected" : ""
                  }`}
                  disabled={!formData.building}
                >
                  <option value="" disabled>Choose Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name} ({unit.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      openDropdowns.unit ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Tenancy Contract*</label>
              <div className="relative">
                <select
                  name="tenancy"
                  value={formData.tenancy}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("tenancy")}
                  onBlur={() => setTimeout(() => toggleDropdown("tenancy"), 150)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !formData.tenancy ? "add-charges-selected" : ""
                  }`}
                  disabled={!formData.unit}
                >
                  <option value="" disabled>Choose</option>
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
                      openDropdowns.tenancy ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">In Date*</label>
              <input
                type="date"
                name="inDate"
                value={formData.inDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Due Date*</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Charge Code*</label>
              <div className="relative">
                <select
                  name="chargeCode"
                  value={formData.chargeCode}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("chargeCode")}
                  onBlur={() => setTimeout(() => toggleDropdown("chargeCode"), 150)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !formData.chargeCode ? "add-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled>Choose</option>
                  {chargeTypes.map((charge) => (
                    <option key={charge.id} value={charge.id}>{charge.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      openDropdowns.chargeCode ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Reason*</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter The Reason"
                className="block w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Amount Due*</label>
              <input
                type="number"
                name="amountDue"
                value={formData.amountDue}
                onChange={handleChange}
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
                  name="taxAmount"
                  value={formData.taxAmount}
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
                name="totalAmount"
                value={formData.totalAmount}
                readOnly
                className="block w-full px-3 py-2 border border-gray-200 bg-gray-100 add-charges-input"
              />
            </div>

            <div className="space-y-2">
              <label className="block add-charges-label">Status*</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  onFocus={() => toggleDropdown("status")}
                  onBlur={() => setTimeout(() => toggleDropdown("status"), 150)}
                  className={`block w-full pl-3 pr-10 py-2 border border-gray-200 appearance-none focus:outline-none focus:ring-gray-500 focus:border-gray-500 add-charges-selection ${
                    !formData.status ? "add-charges-selected" : ""
                  }`}
                >
                  <option value="" disabled>Choose</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown
                    size={16}
                    className={`text-[#201D1E] transition-transform duration-300 ${
                      openDropdowns.status ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-1">
              <label className="block add-charges-label">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
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