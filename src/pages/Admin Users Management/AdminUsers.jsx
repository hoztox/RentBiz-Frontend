import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import plusicon from "../../assets/Images/Admin Users Management/plus-icon.svg";
import downloadicon from "../../assets/Images/Admin Users Management/download-icon.svg";
import editicon from "../../assets/Images/Admin Users Management/edit-icon.svg";
import deletesicon from "../../assets/Images/Admin Users Management/delete-icon.svg";
import "./AdminUsers.css";
import downarrow from "../../assets/Images/Admin Users Management/downarrow.svg";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";
import UserDeleteModal from "./UserDeleteModal/UserDeleteModal";
import CustomDropDown from "../../components/CustomDropDown";
import { motion, AnimatePresence } from "framer-motion";

const AdminUsers = () => {
  const [selectedOption, setSelectedOption] = useState("showing");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal, refreshCounter } = useModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const itemsPerPage = 10;

  const options = [
    { value: "showing", label: "Showing" },
    { value: "all", label: "All" },
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
    const fetchUsers = async () => {
      if (!companyId) {
        setError("Company ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/company/users/company/${companyId}/`
        );
        const userData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [companyId, refreshCounter]);

  const handleEditUser = (user) => {
    console.log("User data passed to modal:", user);
    openModal("user-update", "Edit User", {
      id: user.id,
      name: user.name,
      username: user.username,
      user_role: user.user_role,
      profile_image: user.company_logo || null,
    });
  };

  const handleToggle = async (id) => {
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      toast.error("Company ID not found. Please log in again.");
      return;
    }

    const user = users.find((u) => u.id === id);
    if (!user) {
      setError("User not found. Please try again.");
      toast.error("User not found. Please try again.");
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
        throw new Error("Status update failed on the server.");
      }
      toast.success(`User ${newStatus} successfully.`);
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update user status. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: user.status } : u))
      );
    }
  };

  const handleDelete = (id) => {
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      toast.error("Company ID not found. Please log in again.");
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
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete user. Please try again.";
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

  const filteredData = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  if (loading) {
    return <div className="p-5">Loading users...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <div className="border border-[#E9E9E9] rounded-md user-table">
      <Toaster />
      <div className="flex justify-between items-center p-5 border-b border-[#E9E9E9] user-table-header">
        <h1 className="users-head">Users</h1>
        <div className="flex flex-col md:flex-row gap-[10px] user-inputs-container">
          <div className="flex flex-col md:flex-row gap-[10px] w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-[14px] py-[7px] outline-none border border-[#201D1E20] rounded-md w-full md:w-[302px] focus:border-gray-300 duration-200 user-search"
            />
            <CustomDropDown
              options={options}
              value={selectedOption}
              onChange={setSelectedOption}
              placeholder="Showing"
              className="w-[40%] md:w-[121px]"
              dropdownClassName="user-selection px-[14px] py-[7px] border-[#201D1E20]"
              enableFilter={false}
            />
          </div>
          <div className="flex gap-[10px] user-action-buttons-container w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md user-create-btn duration-200 w-[176px]"
              onClick={() => openModal("user-create", "Create User")}
            >
              Create User
              <img
                src={plusicon}
                alt="plus icon"
                className="relative right-[5px] md:right-0 w-[15px] h-[15px]"
              />
            </button>
            <button className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 user-download-btn w-[122px]">
              Download
              <img
                src={downloadicon}
                alt="Download Icon"
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
              <th className="px-5 text-left user-thead">ID</th>
              <th className="px-5 text-left user-thead w-[12%]">
                CREATED DATE
              </th>
              <th className="pl-5 text-left user-thead w-[15%]">NAME</th>
              <th className="px-5 text-left user-thead">USERNAME</th>
              <th className="pl-12 pr-5 text-left user-thead w-[18%]">ROLE</th>
              <th className="px-5 text-left user-thead w-[12%]">STATUS</th>
              <th className="px-5 text-left user-thead w-[8%]">BLOCK</th>
              <th className="px-5 pr-6 text-right user-thead">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-5 text-left user-data">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-5 text-left user-data">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="pl-5 text-left user-data">
                    {user.name || "N/A"}
                  </td>
                  <td className="px-5 text-left user-data">
                    {user.username || "N/A"}
                  </td>
                  <td className="pl-12 pr-5 text-left user-data">
                    {user.user_role || "N/A"}
                  </td>
                  <td className="px-5 text-left user-data">
                    <span
                      className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                        user.status === "active"
                          ? "bg-[#e1ffea] text-[#28C76F]"
                          : "bg-[#FFE1E1] text-[#C72828]"
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 text-left user-data">
                    <ToggleSwitch
                      id={user.id}
                      isActive={isBlocked(user.id)}
                      onChange={handleToggle}
                    />
                  </td>
                  <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                    <button onClick={() => handleEditUser(user)}>
                      <img
                        src={editicon}
                        alt="Edit"
                        className="w-[18px] h-[18px] action-btn duration-200"
                      />
                    </button>
                    <button onClick={() => handleDelete(user.id)}>
                      <img
                        src={deletesicon}
                        alt="Delete"
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
              <th className="px-5 w-[38%] text-left user-thead user-id-column">
                ID
              </th>
              <th className="px-5 w-[60%] text-left user-thead">NAME</th>
              <th className="px-5 text-right user-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-4 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`${
                      expandedRows[user.id]
                        ? "mobile-no-border"
                        : "mobile-with-border"
                    } border-b border-[#E9E9E9] h-[57px]`}
                  >
                    <td className="px-5 text-left user-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-5 text-left user-data">
                      {user.name || "N/A"}
                    </td>
                    <td className="py-4 flex items-center justify-end h-[57px]">
                      <div
                        className={`user-dropdown-field ${
                          expandedRows[user.id] ? "active" : ""
                        }`}
                        onClick={() => toggleRowExpand(user.id)}
                      >
                        <img
                          src={downarrow}
                          alt="drop-down-arrow"
                          className={`user-dropdown-img ${
                            expandedRows[user.id] ? "text-white" : ""
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
                          <div className="user-dropdown-content">
                            <div className="user-grid">
                              <div className="user-grid-item w-[33.33%]">
                                <div className="dropdown-label">
                                  CREATED DATE
                                </div>
                                <div className="dropdown-value">
                                  {user.created_at
                                    ? new Date(
                                        user.created_at
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "N/A"}
                                </div>
                              </div>
                              <div className="user-grid-item w-[35.33%]">
                                <div className="dropdown-label">USERNAME</div>
                                <div className="dropdown-value">
                                  {user.username || "N/A"}
                                </div>
                              </div>
                              <div className="user-grid-item w-[20%]">
                                <div className="dropdown-label">ROLE</div>
                                <div className="dropdown-value">
                                  {user.user_role || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="user-grid">
                              <div className="user-grid-item w-[33.33%]">
                                <div className="dropdown-label !mb-[10px]">
                                  STATUS
                                </div>
                                <div className="dropdown-value">
                                  <span
                                    className={`px-[10px] py-[5px] w-[53px] h-[24px] rounded-[4px] user-status ${
                                      user.status === "active"
                                        ? "bg-[#e1ffea] text-[#28C76F]"
                                        : "bg-[#FFE1E1] text-[#C72828] !pr-[5px] !pl-[5px]"
                                    }`}
                                  >
                                    {user.status.charAt(0).toUpperCase() +
                                      user.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="user-grid-item w-[35.33%]">
                                <div className="dropdown-label">BLOCK</div>
                                <div className="dropdown-value flex items-center gap-2 mt-[10px]">
                                  <ToggleSwitch
                                    id={user.id}
                                    isActive={isBlocked(user.id)}
                                    onChange={handleToggle}
                                  />
                                </div>
                              </div>
                              <div className="user-grid-item w-[20%]">
                                <div className="dropdown-label">ACTION</div>
                                <div className="dropdown-value flex items-center gap-[15px] ml-[5px] mt-[10px]">
                                  <button onClick={() => handleEditUser(user)}>
                                    <img
                                      src={editicon}
                                      alt="Edit"
                                      className="w-[18px] h-[18px] action-btn duration-200"
                                    />
                                  </button>
                                  <button onClick={() => handleDelete(user.id)}>
                                    <img
                                      src={deletesicon}
                                      alt="Delete"
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
        <span className="pagination collection-list-pagination">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto md:py-2 w-full md:w-auto pagination-buttons">
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

      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminUsers;