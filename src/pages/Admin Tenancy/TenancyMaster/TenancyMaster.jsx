import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Download, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import { useModal } from "../../../context/ModalContext";
import { BASE_URL } from "../../../utils/config";
import CustomDropDown from "../../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import UpdatePaymentScheduleModal from "../UpdateTenancyModal/UpdatePaymentSchedule";

const TenancyMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("showing");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenancyToDelete, setTenancyToDelete] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTenancy, setSelectedTenancy] = useState(null);
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const itemsPerPage = 10;
  const { openModal, refreshCounter } = useModal();

  const dropdownOptions = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
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
    const fetchAndSortTenancies = async () => {
      try {
        const companyId = getUserCompanyId();
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/company/tenancies/company/${companyId}/`
        );
        const sortedTenancies = response.data.sort((a, b) => a.id - b.id);
        setTenancies(sortedTenancies);
      } catch (error) {
        console.error("Error fetching tenancies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortTenancies();
  }, [refreshCounter]);

  const fetchPaymentSchedules = async (tenancyId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company/tenancies/${tenancyId}/payment-schedules/`
      );
      setPaymentSchedules(response.data);
    } catch (error) {
      console.error("Error fetching payment schedules:", error);
      alert("Failed to fetch payment schedules.");
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
      } catch (error) {
        console.error("Error deleting tenancy:", error);
        alert("Failed to delete tenancy. Please try again.");
      }
    }
    setShowDeleteModal(false);
    setTenancyToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTenancyToDelete(null);
  };

  const handlePaymentScheduleClick = async (tenancy) => {
    setSelectedTenancy(tenancy);
    await fetchPaymentSchedules(tenancy.id);
    setShowPaymentModal(true);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  const filteredData = tenancies.filter(
    (tenancy) =>
      tenancy.tenancy_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenancy.tenant?.tenant_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenancy.building?.building_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenancy.unit?.unit_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      tenancy.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Tenancy Management</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search tenancies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-72 transition-all"
            />
            <CustomDropDown
              options={dropdownOptions}
              value={selectedOption}
              onChange={setSelectedOption}
              className="w-full md:w-32"
              dropdownClassName="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-3 md:mt-0">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
              onClick={() => openModal("tenancy-create")}
            >
              <Plus size={18} />
              Add Tenancy
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 h-14 bg-gray-50">
              <th className="px-6 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 text-left text-sm font-semibold text-gray-600 w-[15%]">TENANT NAME</th>
              <th className="px-6 text-left text-sm font-semibold text-gray-600 w-[15%]">BUILDING</th>
              <th className="px-6 text-left text-sm font-semibold text-gray-600 w-[12%]">UNIT NAME</th>
              <th className="px-6 text-center text-sm font-semibold text-gray-600">RENTAL MONTHS</th>
              <th className="px-6 text-left text-sm font-semibold text-gray-600 w-[12%]">STATUS</th>
              <th className="px-6 text-center text-sm font-semibold text-gray-600 w-[8%]">VIEW</th>
              <th className="px-6 text-right text-sm font-semibold text-gray-600">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <tr
                key={tenancy.tenancy_code}
                className="border-b border-gray-200 h-14 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 text-gray-700">{tenancy.tenancy_code}</td>
                <td className="px-6 text-gray-700">{tenancy.tenant?.name || "N/A"}</td>
                <td className="px-6 text-gray-700">{tenancy.building?.building_name || "N/A"}</td>
                <td className="px-6 text-gray-700">{tenancy.unit?.name || "N/A"}</td>
                <td className="px-6 text-gray-700 text-center">{tenancy.rental_months}</td>
                <td className="px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      tenancy.status === "active"
                        ? "bg-blue-100 text-blue-600"
                        : tenancy.status === "pending"
                        ? "bg-orange-100 text-orange-600"
                        : tenancy.status === "terminated"
                        ? "bg-red-100 text-red-600"
                        : tenancy.status === "closed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {tenancy.status.charAt(0).toUpperCase() + tenancy.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 text-center">
                  <button onClick={() => handleViewClick(tenancy)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <Eye size={18} className="text-gray-600" />
                  </button>
                </td>
                <td className="px-6 flex gap-3 items-center justify-end h-14">
                  {tenancy.status === "active" ? (
                    <button onClick={() => handlePaymentScheduleClick(tenancy)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <Edit size={18} className="text-blue-600" />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(tenancy)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <Edit size={18} className="text-gray-600" />
                      </button>
                      <button onClick={() => handleDeleteClick(tenancy.id)} className="p-2 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 size={18} className="text-red-600" />
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
            <tr className="border-b border-gray-200 h-14 bg-gray-50">
              <th className="px-5 w-[50%] text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-3 w-[50%] text-left text-sm font-semibold text-gray-600">TENANT NAME</th>
              <th className="px-5 text-right text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tenancy) => (
              <React.Fragment key={tenancy.tenancy_code}>
                <tr
                  className={`border-b border-gray-200 h-14 ${expandedRows[tenancy.tenancy_code] ? "" : "border-b"}`}
                >
                  <td className="px-5 text-gray-700">{tenancy.tenancy_code}</td>
                  <td className="px-3 text-gray-700">{tenancy.tenant?.name || "N/A"}</td>
                  <td className="py-4 flex items-center justify-end h-14">
                    <button
                      className={`p-2 rounded-full transition-colors ${expandedRows[tenancy.tenancy_code] ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                      onClick={() => toggleRowExpand(tenancy.tenancy_code)}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows[tenancy.tenancy_code] && (
                    <motion.tr
                      className="border-b border-gray-200"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      <td colSpan={3} className="px-5 py-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500">BUILDING NAME</div>
                            <div className="text-gray-700">{tenancy.building?.building_name || "N/A"}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">UNIT NAME</div>
                            <div className="text-gray-700">{tenancy.unit?.name || "N/A"}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">RENTAL MONTHS</div>
                            <div className="text-gray-700">{tenancy.rental_months}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">STATUS</div>
                            <div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  tenancy.status === "active"
                                    ? "bg-blue-100 text-blue-600"
                                    : tenancy.status === "pending"
                                    ? "bg-orange-100 text-orange-600"
                                    : tenancy.status === "terminated"
                                    ? "bg-red-100 text-red-600"
                                    : tenancy.status === "closed"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {tenancy.status.charAt(0).toUpperCase() + tenancy.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500">VIEW</div>
                              <button onClick={() => handleViewClick(tenancy)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Eye size={18} className="text-gray-600" />
                              </button>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">ACTION</div>
                              <div className="flex gap-2">
                                {tenancy.status === "active" ? (
                                  <button onClick={() => handlePaymentScheduleClick(tenancy)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <Edit size={18} className="text-blue-600" />
                                  </button>
                                ) : (
                                  <>
                                    <button onClick={() => handleEditClick(tenancy)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                      <Edit size={18} className="text-gray-600" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(tenancy.id)} className="p-2 hover:bg-red-100 rounded-full transition-colors">
                                      <Trash2 size={18} className="text-red-600" />
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-t border-gray-200">
        <span className="text-sm text-gray-600 mb-3 md:mb-0">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto">
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {startPage > 1 && (
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-2 flex items-center text-gray-600">...</span>}
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button
              key={startPage + i}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === startPage + i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              onClick={() => setCurrentPage(startPage + i)}
            >
              {startPage + i}
            </button>
          ))}
          {endPage < totalPages - 1 && (
            <span className="px-2 flex items-center text-gray-600">...</span>
          )}
          {endPage < totalPages && (
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
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
      {showPaymentModal && (
        <UpdatePaymentScheduleModal
          tenancy={selectedTenancy}
          paymentSchedules={paymentSchedules}
          onClose={() => setShowPaymentModal(false)}
          refreshSchedules={() => fetchPaymentSchedules(selectedTenancy.id)}
        />
      )}
    </div>
  );
};

export default TenancyMaster;