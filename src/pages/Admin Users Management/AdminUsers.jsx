import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import plusicon from "../../assets/Images/Admin Users Management/plus-icon.svg";
import downloadicon from "../../assets/Images/Admin Users Management/download-icon.svg";
import editicon from "../../assets/Images/Admin Users Management/edit-icon.svg";
import deletesicon from "../../assets/Images/Admin Users Management/delete-icon.svg";
import "./AdminUsers.css";
import downarrow from "../../assets/Images/Admin Users Management/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const AdminUsers = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const itemsPerPage = 10;
  const filteredData = users;

  // Determine the direction (ltr or rtl) for table list only
  const isRtl = i18n.dir() === "rtl";

  // Dropdown options for status filter with translated labels
  const statusFilterOptions = [
    { label: t("sidebar.users"), value: "" },
    { label: t("status.active"), value: "active" },
    { label: t("status.blocked"), value: "blocked" },
  ];

  const getUserCompanyId = () => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) return storedCompanyId;
    const userRole = localStorage.getItem("role");
    if (userRole === "user") {
      const userData = localStorage.getItem("user_company_id");
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error("Error parsing user company ID:", e);
          return null;
        }
      }
    }
    return null;
  };

  const companyId = getUserCompanyId();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!companyId) {
        setError(t("errors.company_id_not_found"));
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/company/users/company/${companyId}/`,
          {
            params: {
              search: searchTerm,
              status: selectedStatus,
              page: currentPage,
              pageSize: itemsPerPage,
            },
          }
        );
        const userData = response.data.results || [];
        setUsers(userData);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [
    companyId,
    refreshCounter,
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedStatus,
  ]);

  const handleEditUser = (user) => {
    openModal("user-update", t("actions.edit_user"), {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      user_role: user.user_role,
      profile_image: user.company_logo || null,
    });
  };

  const handleToggle = async (id) => {
    if (!companyId) {
      setError(t("errors.company_id_not_found"));
      toast.error(t("errors.company_id_not_found"));
      return;
    }

    const user = users.find((u) => u.id === id);
    if (!user) {
      setError(t("errors.user_not_found"));
      toast.error(t("errors.user_not_found"));
      return;
    }

    const newStatus = user.status === "active" ? "blocked" : "active";

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );

    try {
      const response = await axios.put(`${BASE_URL}/company/users/${id}/`, {
        status: newStatus,
      });

      if (response.data.status !== newStatus) {
        throw new Error(t("errors.status_update_failed"));
      }
      toast.success(t("success.user_status_updated", { status: newStatus }));
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMessage =
        error.response?.data?.message || t("errors.status_update_failed");
      setError(errorMessage);
      toast.error(errorMessage);

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: user.status } : u))
      );
    }
  };

  const handleDelete = (id) => {
    if (!companyId) {
      setError(t("errors.company_id_not_found"));
      toast.error(t("errors.company_id_not_found"));
      return;
    }
    setUserIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userIdToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/company/users/${userIdToDelete}/`);
      setUsers((prev) => prev.filter((u) => u.id !== userIdToDelete));
      toast.success(t("success.user_deleted"));
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.message || t("errors.delete_user_failed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
      setUserIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserIdToDelete(null);
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

  const isBlocked = (id) =>
    users.find((u) => u.id === id)?.status === "blocked";

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedData = users;

  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const ToggleSwitch = ({ id, isActive, onChange }) => {
    return (
      <div
        className={`toggle-switch ${isActive ? "active" : ""}`}
        onClick={() => onChange(id)}
      >
        <div className="toggle-circle"></div>
      </div>
    );
  };

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md user-table" dir={isRtl ? "rtl" : "ltr"}>
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] user-table-header">
        <h1 className="users-head">{t("sidebar.users")}</h1>
        <div className="flex flex-col md:flex-row gap-[10px] user-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder={t("actions.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 user-search"
            />
            <div className="relative w-[40%] md:w-auto">
              <CustomDropDown
                options={statusFilterOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder={t("actions.select_status")}
                dropdownClassName="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 user-selection"
              />
            </div>
          </div>
          <div className="flex gap-[10px] user-action-buttons-container w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md user-create-btn duration-200 w-[176px]"
              onClick={() => openModal("user-create", t("actions.create_user"))}
            >
              {t("sidebar.create_user")}
              <img
                src={plusicon}
                alt={t("logo_alt.plus_icon")}
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 user-download-btn w-[122px]">
              {t("actions.download")}
              <img
                src={downloadicon}
                alt={t("logo_alt.download_icon")}
                className="w-[15px] h-[15px] user-download-icon"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="desktop-only">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E9E9E9] h-[57px]">
              <th className={`px-5 user-thead ${isRtl ? "text-right" : "text-left"}`}>{t("table.id")}</th>
              <th className={`px-5 user-thead w-[12%] ${isRtl ? "text-right" : "text-left"}`}>
                {t("table.created_date")}
              </th>
              <th className={`pl-5 user-thead w-[15%] ${isRtl ? "text-right pr-5 pl-12" : "text-left"}`}>
                {t("table.name")}
              </th>
              <th className={`px-5 user-thead ${isRtl ? "text-right" : "text-left"}`}>{t("table.username")}</th>
              <th className={`pl-12 pr-5 user-thead w-[18%] ${isRtl ? "text-right pr-12 pl-5" : "text-left"}`}>
                {t("table.role")}
              </th>
              <th className={`px-5 user-thead w-[12%] ${isRtl ? "text-right" : "text-left"}`}>
                {t("table.status")}
              </th>
              <th className={`px-5 user-thead w-[8%] ${isRtl ? "text-right" : "text-left"}`}>{t("table.block")}</th>
              <th className={`px-5 pr-6 user-thead ${isRtl ? "text-left pl-6" : "text-right"}`}>{t("table.action")}</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className={`px-5 py-8 text-center text-gray-500 ${isRtl ? "text-right" : ""}`}>
                  {t("messages.no_users_found")}
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                >
                  <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString(
                          t("locale"),
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : t("messages.na")}
                  </td>
                  <td className={`pl-5 user-data ${isRtl ? "text-right pr-5 pl-12" : "text-left"}`}>
                    {user.name || t("messages.na")}
                  </td>
                  <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                    {user.username || t("messages.na")}
                  </td>
                  <td className={`pl-12 pr-5 user-data ${isRtl ? "text-right pr-12 pl-5" : "text-left"}`}>
                    {user.user_role || t("messages.na")}
                  </td>
                  <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                    <span
                      className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                        user.status === "active"
                          ? "bg-[#e1ffea] text-[#28C76F]"
                          : "bg-[#FFE1E1] text-[#C72828]"
                      }`}
                    >
                      {t(`status.${user.status}`)}
                    </span>
                  </td>
                  <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                    <ToggleSwitch
                      id={user.id}
                      isActive={isBlocked(user.id)}
                      onChange={handleToggle}
                    />
                  </td>
                  <td
                    className={`px-5 flex gap-[23px] items-center h-[57px] ${
                      isRtl ? "justify-end" : "justify-end"
                    }`}
                  >
                    <button onClick={() => handleEditUser(user)}>
                      <img
                        src={editicon}
                        alt={t("logo_alt.edit_icon")}
                        className="w-[18px] h-[18px] action-btn duration-200"
                      />
                    </button>
                    <button onClick={() => handleDelete(user.id)}>
                      <img
                        src={deletesicon}
                        alt={t("logo_alt.delete_icon")}
                        className="w-[18px] h-[18px] action-btn duration-200"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="user-table-row-head">
              <th className={`px-5 w-[38%] user-thead user-id-column ${isRtl ? "text-right" : "text-left"}`}>
                {t("table.id")}
              </th>
              <th className={`px-5 w-[60%] user-thead ${isRtl ? "text-right" : "text-left"}`}>{t("table.name")}</th>
              <th className={`px-5 user-thead ${isRtl ? "text-left" : "text-right"}`}></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className={`px-5 py-4 text-center ${isRtl ? "text-right" : ""}`}>
                  {t("messages.no_users_found")}
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <React.Fragment key={user.id}>
                  <tr
                    className={`${
                      expandedRows[user.id]
                        ? "mobile-no-border"
                        : "mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={`px-5 user-data ${isRtl ? "text-right" : "text-left"}`}>
                      {user.name || t("messages.na")}
                    </td>
                    <td className={`py-4 flex items-center h-[57px] ${isRtl ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`user-dropdown-field ${
                          expandedRows[user.id] ? "active" : ""
                        } ${isRtl ? "ml-[15px] mr-0" : "mr-[15px]"}`}
                        onClick={() => toggleRowExpand(user.id)}
                      >
                        <img
                          src={downarrow}
                          alt={t("logo_alt.dropdown_arrow")}
                          className={`user-dropdown-img ${
                            expandedRows[user.id] ? "text-white rotate-180" : ""
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows[user.id] && (
                      <motion.tr
                        className="mobile-with-border border-b border-[#E9E9E9]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                      >
                        <td colSpan={3} className="px-5">
                          <div className={`user-dropdown-content ${isRtl ? "rtl-grid" : ""}`}>
                            <div className={`user-grid ${isRtl ? "flex-row-reverse" : ""}`}>
                              <div className="user-grid-item w-[33.33%]">
                                <div className={`dropdown-label ${isRtl ? "text-right" : ""}`}>
                                  {t("table.created_date")}
                                </div>
                                <div className={`dropdown-value ${isRtl ? "text-right" : ""}`}>
                                  {user.created_at
                                    ? new Date(
                                        user.created_at
                                      ).toLocaleDateString(t("locale"), {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : t("messages.na")}
                                </div>
                              </div>
                              <div className="user-grid-item w-[35.33%]">
                                <div className={`dropdown-label ${isRtl ? "text-right" : ""}`}>
                                  {t("table.username")}
                                </div>
                                <div className={`dropdown-value ${isRtl ? "text-right" : ""}`}>
                                  {user.username || t("messages.na")}
                                </div>
                              </div>
                              <div className="user-grid-item w-[20%]">
                                <div className={`dropdown-label ${isRtl ? "text-right" : ""}`}>
                                  {t("table.role")}
                                </div>
                                <div className={`dropdown-value ${isRtl ? "text-right" : ""}`}>
                                  {user.user_role || t("messages.na")}
                                </div>
                              </div>
                            </div>
                            <div className={`user-grid ${isRtl ? "flex-row-reverse" : ""}`}>
                              <div className="user-grid-item w-[33.33%]">
                                <div className={`dropdown-label !mb-[10px] ${isRtl ? "text-right" : ""}`}>
                                  {t("table.status")}
                                </div>
                                <div className="dropdown-value">
                                  <span
                                    className={`px-[10px] py-[5px] w-[53px] h-[24px] rounded-[4px] user-status ${
                                      user.status === "active"
                                        ? "bg-[#e1ffea] text-[#28C76F]"
                                        : "bg-[#FFE1E1] text-[#C72828] !pr-[5px] !pl-[5px]"
                                    }`}
                                  >
                                    {t(`status.${user.status}`)}
                                  </span>
                                </div>
                              </div>
                              <div className="user-grid-item w-[35.33%]">
                                <div className={`dropdown-label ${isRtl ? "text-right" : ""}`}>
                                  {t("table.block")}
                                </div>
                                <div className={`dropdown-value flex items-center gap-2 mt-[10px] ${isRtl ? "justify-end" : ""}`}>
                                  <ToggleSwitch
                                    id={user.id}
                                    isActive={isBlocked(user.id)}
                                    onChange={handleToggle}
                                  />
                                </div>
                              </div>
                              <div className="user-grid-item w-[20%]">
                                <div className={`dropdown-label ${isRtl ? "text-right" : ""}`}>
                                  {t("table.action")}
                                </div>
                                <div className={`dropdown-value flex items-center gap-[15px] mt-[10px] ${isRtl ? "mr-[5px] justify-end flex-row-reverse" : "ml-[5px]"}`}>
                                  <button onClick={() => handleEditUser(user)}>
                                    <img
                                      src={editicon}
                                      alt={t("logo_alt.edit_icon")}
                                      className="w-[18px] h-[18px] action-btn duration-200"
                                    />
                                  </button>
                                  <button onClick={() => handleDelete(user.id)}>
                                    <img
                                      src={deletesicon}
                                      alt={t("logo_alt.delete_icon")}
                                      className="w-[18px] h-[18px] action-btn duration-200"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 md:px-5 pagination-container">
        <span className="pagination admin-users-collection-list-pagination">
          {t("pagination.showing", {
            start: Math.min((currentPage - 1) * itemsPerPage + 1, totalCount),
            end: Math.min(currentPage * itemsPerPage, totalCount),
            total: totalCount,
          })}
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {t("pagination.previous")}
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
            {t("pagination.next")}
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        type="delete"
        title={t("actions.delete_user")}
        message={t("messages.confirm_delete_user")}
        confirmButtonText={t("actions.delete")}
        cancelButtonText={t("actions.cancel")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AdminUsers;