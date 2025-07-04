import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./TenancyMaster.css";
import plusicon from "../../../assets/Images/Admin Tenancy/plus-icon.svg";
import downloadicon from "../../../assets/Images/Admin Tenancy/download-icon.svg";
import viewicon from "../../../assets/Images/Admin Tenancy/view-icon.svg";
import editicon from "../../../assets/Images/Admin Tenancy/edit-icon.svg";
import deleteicon from "../../../assets/Images/Admin Tenancy/delete-icon.svg";
import configicon from "../../../assets/Images/Admin Tenancy/config-icon.svg";
import downarrow from "../../../assets/Images/Admin Tenancy/downarrow.svg";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { Edit, ChevronDown, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const TenancyMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenancyToDelete, setTenancyToDelete] = useState(null);
  const [openSelectKey, setOpenSelectKey] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    tenant: "",
    building: "",
    unit: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  const [tempFilters, setTempFilters] = useState({
    id: "",
    tenant: "",
    building: "",
    unit: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const { openModal, refreshCounter } = useModal();
  const dateRangeRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openSelectKey === "date_range" &&
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setOpenSelectKey(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelectKey]);

  const itemsPerPage = 10;

  const getUnique = (key, valueKey, labelKey) => {
    const items = tenancies.map((item, index) => ({
      value: item[key]
        ? typeof item[key] === "object"
          ? item[key][valueKey] || "N/A"
          : item[key]
        : "N/A",
      label: item[key]
        ? typeof item[key] === "object"
          ? item[key][labelKey] || "N/A"
          : item[key]
        : "N/A",
      key: `${item[key]?.[valueKey] || item[key] || "N/A"}-${item.id || index}`,
    }));
    return [...new Map(items.map((item) => [item.value, item])).values()];
  };

  const uniqueIds = getUnique("tenancy_code", "tenancy_code", "tenancy_code");
  const uniqueTenants = getUnique("tenant", "tenant_name", "tenant_name");
  const uniqueBuildings = getUnique(
    "building",
    "building_name",
    "building_name"
  );
  const uniqueUnits = getUnique("unit", "unit_name", "unit_name");
  const uniqueStatuses = getUnique("status", "status", "status");

  const idOptions = [
    { value: "", label: "All Tenancy", key: "all-tenancy" },
    ...uniqueIds.map((item) => ({
      value: item.value,
      label: item.label,
      key: item.key,
    })),
  ];
  const tenantOptions = [
    { value: "", label: "All Tenants", key: "all-tenants" },
    ...uniqueTenants.map((item) => ({
      value: item.value,
      label: item.label,
      key: item.key,
    })),
  ];
  const buildingOptions = [
    { value: "", label: "All Buildings", key: "all-buildings" },
    ...uniqueBuildings.map((item) => ({
      value: item.value,
      label: item.label,
      key: item.key,
    })),
  ];
  const unitOptions = [
    { value: "", label: "All Units", key: "all-units" },
    ...uniqueUnits.map((item) => ({
      value: item.value,
      label: item.label,
      key: item.key,
    })),
  ];
  const statusOptions = [
    { value: "", label: "All Statuses", key: "all-statuses" },
    ...uniqueStatuses.map((item) => ({
      value: item.value,
      label: item.value.charAt(0).toUpperCase() + item.value.slice(1),
      key: item.key,
    })),
  ];

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

  useEffect(() => {
    const fetchTenancies = async () => {
      try {
        const companyId = getUserCompanyId();
        setLoading(true);
        const params = {
          page: currentPage,
          page_size: itemsPerPage,
        };
        if (searchTerm) params.search = searchTerm;
        if (filters.building) params.building = filters.building;
        if (filters.status) params.status = filters.status;
        if (filters.unit) params.unit = filters.unit;
        if (filters.start_date) params.start_date = filters.start_date;
        if (filters.end_date) params.end_date = filters.end_date;
        if (filters.id) params.tenancy_code = filters.id;
        if (filters.tenant) params.tenant = filters.tenant;

        const response = await axios.get(
          `${BASE_URL}/company/tenancies/company/${companyId}/`,
          { params }
        );
        setTenancies(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching tenancies:", error);
        toast.error("Failed to fetch tenancies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenancies();
  }, [refreshCounter, searchTerm, filters, currentPage]);

  const fetchPaymentSchedules = async (tenancyId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company/tenancies/${tenancyId}/payment-schedules/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment schedules:", error);
      toast.error("Failed to fetch payment schedules. Please try again.");
      return [];
    }
  };

  const handleDeleteClick = (tenancyId) => {
    setTenancyToDelete(tenancyId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (tenancyToDelete) {
      try {
        await axios.delete(`${BASE_URL}/company/tenancies/${tenancyToDelete}/`);
        setTenancies(
          tenancies.filter((tenancy) => tenancy.id !== tenancyToDelete)
        );
        toast.success("Tenancy deleted successfully");
      } catch (error) {
        console.error("Error deleting tenancy:", error);
        toast.error("Failed to delete tenancy. Please try again.");
      }
    }
    setShowDeleteModal(false);
    setTenancyToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTenancyToDelete(null);
  };

  const handleInvoiceConfigClick = (tenancy) => {
    openModal("invoice-config", "Invoice Configuration", tenancy);
  };

  const handlePaymentScheduleClick = async (tenancy) => {
    const paymentSchedules = await fetchPaymentSchedules(tenancy.id);
    openModal("update-payment-schedule", "Update Payment Schedule", {
      tenancy,
      paymentSchedules,
    });
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleDateRange = () => {
    setOpenSelectKey(openSelectKey === "date_range" ? null : "date_range");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    const cleared = {
      id: "",
      tenant: "",
      building: "",
      unit: "",
      status: "",
      start_date: "",
      end_date: "",
    };
    setFilters(cleared);
    setTempFilters(cleared);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDownloadCSV = async () => {
    try {
      const companyId = getUserCompanyId();
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.building) params.building = filters.building;
      if (filters.status) params.status = filters.status;
      if (filters.unit) params.unit = filters.unit;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.id) params.tenancy_code = filters.id;
      if (filters.tenant) params.tenant = filters.tenant;

      const response = await axios.get(
        `${BASE_URL}/company/tenancies/${companyId}/export/`,
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tenancies.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV downloaded successfully");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV. Please try again.");
    }
  };

  const filterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const handleViewClick = (tenancy) => {
    openModal("tenancy-view", "View Tenancy", tenancy);
  };

  const handleEditClick = (tenancy) => {
    openModal("tenancy-update", "Update Tenancy", tenancy);
  };

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md tenancy-table">
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] tenancy-table-header">
        <h1 className="tenancy-head">Tenancy</h1>
        <div className="flex flex-col md:flex-row gap-[10px] tenancy-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 tenancy-search"
            />
            <motion.button
              className={`hidden md:flex items-center justify-center gap-2 px-4 py-2 h-[38px] rounded-md duration-200 ${
                showFilters
                  ? "bg-[#201D1E] text-white"
                  : "bg-[#F0F0F0] text-[#201D1E] hover:bg-[#201D1E] hover:text-[#F0F0F0]"
              }`}
              onClick={toggleFilters}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              Filters
            </motion.button>
          </div>
          <div className="flex gap-[10px] tenancy-action-buttons-container">
            <button
              className="flex items-center justify-center gap-2 w-[51%] md:w-[176px] h-[38px] rounded-md tenancy-add-new-tenancy duration-200"
              onClick={() => openModal("tenancy-create")}
            >
              Add New Tenancy
              <img
                src={plusicon}
                alt="Add"
                className="relative right-[5px] w-[16px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 w-[45%] md:w-[122px] h-[38px] rounded-md duration-200 tenancy-download-btn"
              onClick={handleDownloadCSV}
            >
              Download
              <img
                src={downloadicon}
                alt="Download"
                className="w-[15px] h-[15px] tenancy-download-img"
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="p-5 border-b border-[#E9E9E9] tenancy-desktop-only tenancy-filter-container"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={filterVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-[10px] flex-wrap">
                {[
                  ["id", idOptions],
                  ["tenant", tenantOptions],
                  ["building", buildingOptions],
                  ["unit", unitOptions],
                  ["status", statusOptions],
                ].map(([key, options]) => (
                  <div key={key} className="relative">
                    <CustomDropDown
                      options={options}
                      value={tempFilters[key]}
                      onChange={(value) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          [key]: value,
                        }))
                      }
                      dropdownClassName="px-[7px] py-[7px] w-[130px] border-[#201D1E20] focus:border-gray-300 tenancy-selection h-[38px]"
                    />
                  </div>
                ))}
                <div className="relative" ref={dateRangeRef}>
                  <div
                    className="appearance-none px-[7px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-[130px] h-[38px] cursor-pointer flex items-center justify-between tenancy-selection"
                    onClick={toggleDateRange}
                  >
                    Date Range
                    <ChevronDown
                      className={`ml-2 transition-transform duration-300 ${
                        openSelectKey === "date_range"
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    />
                  </div>
                  {openSelectKey === "date_range" && (
                    <div className="absolute z-10 bg-white p-4 mt-1 border border-gray-300 rounded-md shadow-md w-[250px]">
                      <label className="block text-sm mb-1 filter-btn">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={tempFilters.start_date}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 mb-3 outline-none"
                      />
                      <label className="block text-sm mb-1 filter-btn">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={tempFilters.end_date}
                        onChange={(e) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            end_date: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-[10px]">
                <button
                  onClick={() => {
                    setFilters(tempFilters);
                    setCurrentPage(1);
                  }}
                  className="bg-[#201D1E] text-white w-[105px] h-[38px] rounded-md hover:bg-[#F0F0F0] hover:text-[#201D1E] duration-200 filter-btn"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="w-[105px] h-[38px] bg-[#F0F0F0] text-[#4D4E4D] rounded-md clear-btn hover:bg-[#201D1E] hover:text-white duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tenancy-desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className="px-5 text-left tenancy-thead">ID</th>
              <th className="px-5 text-left tenancy-thead w-[15%]">
                TENANT NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[15%]">
                BUILDING NAME
              </th>
              <th className="pl-5 text-left tenancy-thead w-[12%]">
                UNIT NAME
              </th>
              <th className="px-5 text-left tenancy-thead">RENTAL MONTHS</th>
              <th className="px-5 text-left tenancy-thead w-[12%]">STATUS</th>
              <th className="pl-12 pr-5 text-center tenancy-thead w-[8%]">
                VIEW
              </th>
              <th className="px-5 pr-6 text-right tenancy-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {tenancies.map((tenancy) => (
              <tr
                key={tenancy.id}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left tenancy-data">
                  {tenancy.tenancy_code}
                </td>
                <td className="px-5 text-left tenancy-data">
                  {tenancy.tenant?.tenant_name || "N/A"}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.building?.building_name || "N/A"}
                </td>
                <td className="pl-5 text-left tenancy-data">
                  {tenancy.unit?.unit_name || "N/A"}
                </td>
                <td className="px-5 tenancy-data">
                  <div className="w-[50%] flex justify-center">
                    {tenancy.rental_months}
                  </div>
                </td>
                <td className="px-5 text-left tenancy-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] tenancy-status ${
                      tenancy.status === "active"
                        ? "bg-[#DDF6E8] text-[#28C76F]"
                        : tenancy.status === "pending"
                        ? "bg-[#FFF7E9] text-[#FBAD27]"
                        : tenancy.status === "terminated"
                        ? "bg-[#FFE6E6] text-[#D32F2F]"
                        : tenancy.status === "closed"
                        ? "bg-[#E0E0E0] text-[#616161]"
                        : tenancy.status === "invoice"
                        ? "bg-[#E8EFF6] text-[#1458A2]"
                        : "bg-[#E0F7E0] text-[#388E3C]"
                    }`}
                  >
                    {tenancy.status.charAt(0).toUpperCase() +
                      tenancy.status.slice(1)}
                  </span>
                </td>
                <td className="pl-12 pr-5 pt-2 text-center">
                  <button onClick={() => handleViewClick(tenancy)}>
                    <img
                      src={viewicon}
                      alt="View"
                      className="w-[30px] h-[24px] tenancy-action-btn duration-200"
                    />
                  </button>
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  {tenancy.status === "active" ? (
                    <>
                      <button
                        onClick={() => handlePaymentScheduleClick(tenancy)}
                      >
                        <Edit size={20} color="#1458A2" />
                      </button>
                      <button onClick={() => handleInvoiceConfigClick(tenancy)}>
                        <img
                          src={configicon}
                          alt="Config"
                          className="w-[18px] h-[24px] tenancy-action-btn duration-200"
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(tenancy)}>
                        <img
                          src={editicon}
                          alt="Edit"
                          className="w-[18px] h-[18px] tenancy-action-btn duration-200"
                        />
                      </button>
                      <button onClick={() => handleDeleteClick(tenancy.id)}>
                        <img
                          src={deleteicon}
                          alt="Delete"
                          className="w-[18px] h-[18px] tenancy-action-btn duration-200"
                        />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="tenancy-table-row-head">
              <th className="px-5 w-[50%] text-left tenancy-thead tenancy-id-column">
                ID
              </th>
              <th className="px-3 w-[50%] text-left tenancy-thead tenancy-tenant-column">
                TENANT NAME
              </th>
              <th className="px-5 text-right tenancy-thead"></th>
            </tr>
          </thead>
          <tbody>
            {tenancies.map((tenancy) => (
              <React.Fragment key={tenancy.id}>
                <tr
                  className={`${
                    expandedRows[tenancy.id]
                      ? "tenancy-mobile-no-border"
                      : "tenancy-mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left tenancy-data tenancy-id-column">
                    {tenancy.tenancy_code}
                  </td>
                  <td className="px-3 text-left tenancy-data tenancy-tenant-column">
                    {tenancy.tenant?.tenant_name || "N/A"}
                  </td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`tenancy-dropdown-field ${
                        expandedRows[tenancy.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(tenancy.id)}
                    >
                      <img
                        src={downarrow}
                        alt="drop-down-arrow"
                        className={`tenancy-dropdown-img ${
                          expandedRows[tenancy.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[tenancy.id] && (
                    <motion.tr
                      className="tenancy-mobile-with-border border-b border-[#E9E9E9]"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5">
                        <div className="tenancy-dropdown-content">
                          <div className="tenancy-grid">
                            <div className="tenancy-grid-item">
                              <div className="tenancy-dropdown-label">
                                BUILDING NAME
                              </div>
                              <div className="tenancy-dropdown-value">
                                {tenancy.building?.building_name || "N/A"}
                              </div>
                            </div>
                            <div className="tenancy-grid-item">
                              <div className="tenancy-dropdown-label">
                                UNIT NAME
                              </div>
                              <div className="tenancy-dropdown-value">
                                {tenancy.unit?.unit_name || "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="tenancy-grid">
                            <div className="tenancy-grid-item">
                              <div className="tenancy-dropdown-label">
                                RENTAL MONTHS
                              </div>
                              <div className="tenancy-dropdown-value">
                                {tenancy.rental_months}
                              </div>
                            </div>
                            <div className="tenancy-grid-item">
                              <div className="tenancy-dropdown-label">
                                STATUS
                              </div>
                              <div className="tenancy-dropdown-value">
                                <span
                                  className={`px-[10px] py-[5px] rounded-[4px] w-[69px] tenancy-status ${
                                    tenancy.status === "active"
                                      ? "bg-[#DDF6E8] text-[#28C76F]"
                                      : tenancy.status === "pending"
                                      ? "bg-[#FFF7E9] text-[#FBAD27]"
                                      : tenancy.status === "terminated"
                                      ? "bg-[#FFE6E6] text-[#D32F2F]"
                                      : tenancy.status === "closed"
                                      ? "bg-[#E0E0E0] text-[#616161]"
                                      : tenancy.status === "invoice"
                                      ? "bg-[#E8EFF6] text-[#1458A2]"
                                      : "bg-[#E0F7E0] text-[#388E3C]"
                                  }`}
                                >
                                  {tenancy.status.charAt(0).toUpperCase() +
                                    tenancy.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="tenancy-grid">
                            <div className="tenancy-grid-item">
                              <div className="tenancy-dropdown-label">VIEW</div>
                              <div className="tenancy-dropdown-value">
                                <button
                                  onClick={() => handleViewClick(tenancy)}
                                >
                                  <img
                                    src={viewicon}
                                    alt="View"
                                    className="w-[30px] h-[24px] tenancy-action-btn duration-200"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="tenancy-grid-item tenancy-action-column">
                              <div className="tenancy-dropdown-label">
                                ACTION
                              </div>
                              <div className="tenancy-dropdown-value tenancy-flex tenancy-items-center tenancy-gap-2">
                                {tenancy.status === "active" ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handlePaymentScheduleClick(tenancy)
                                      }
                                    >
                                      <Edit size={20} color="#1458A2" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleInvoiceConfigClick(tenancy)
                                      }
                                    >
                                      <img
                                        src={configicon}
                                        alt="Config"
                                        className="ml-2 tenancy-action-btn duration-200"
                                      />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditClick(tenancy)}
                                    >
                                      <img
                                        src={editicon}
                                        alt="Edit"
                                        className="w-[18px] h-[18px] tenancy-action-btn duration-200"
                                      />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteClick(tenancy.id)
                                      }
                                    >
                                      <img
                                        src={deleteicon}
                                        alt="Delete"
                                        className="w-[18px] h-[18px] tenancy-action-btn duration-200"
                                      />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 tenancy-pagination-container">
        <span className="tenancy-pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, tenancies.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, tenancies.length)} of{" "}
          {tenancies.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto tenancy-pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {startPage > 1 && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-2 flex items-center">...</span>}
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button
              key={startPage + i}
              className={`px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns ${
                currentPage === startPage + i
                  ? "bg-[#1458A2] text-white"
                  : "bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#8a94a3]"
              }`}
              onClick={() => setCurrentPage(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
          {endPage < totalPages - 1 && (
            <span className="px-2 flex items-center">...</span>
          )}
          {endPage < totalPages && (
            <button
              className="px-4 h-[38px] rounded-md cursor-pointer duration-200 page-no-btns bg-[#F4F4F4] hover:bg-[#e6e6e6] text-[#677487]"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        type="delete"
        title="Delete Tenancy"
        message="Are you sure you want to delete this tenancy?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default TenancyMaster;