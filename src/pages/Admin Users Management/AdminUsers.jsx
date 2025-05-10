import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import plusicon from "../../assets/Images/Admin Users Management/plus-icon.svg";
import downloadicon from "../../assets/Images/Admin Users Management/download-icon.svg";
import editicon from "../../assets/Images/Admin Users Management/edit-icon.svg";
import deletesicon from "../../assets/Images/Admin Users Management/delete-icon.svg";
import "./AdminUsers.css";
import AdminCreateUserModal from "../../components/AdminCreateUserModal/AdminCreateUserModal";
import EditUserModal from "./EditUserModal/EditUserModal";
import downarrow from "../../assets/Images/Admin Users Management/downarrow.svg"

const AdminUsers = () => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [expandedRows, setExpandedRows] = useState({});

  const [toggleStates, setToggleStates] = useState({
    "01": false,
    "02": false,
    "03": false,
    "04": false,
    "05": false,
    "06": false,
    "07": false,
    "08": false,
    "09": false,
    10: false,
  });

  const handleToggle = (id) => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const demoData = [
    {
      id: "01",
      date: "09 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "02",
      date: "10 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "03",
      date: "11 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "04",
      date: "12 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "05",
      date: "13 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "06",
      date: "13 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "07",
      date: "13 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "08",
      date: "13 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "09",
      date: "13 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
    {
      id: "10",
      date: "13 Sept 2024",
      name: "Anonymous",
      username: "Test",
      role: "Manager",
      status: "Active",
    },
  ];

  const filteredData = demoData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="border border-[#E9E9E9] rounded-md user-table">
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

            <div className="relative w-full md:w-auto">
              <select
                name="select"
                id=""
                className="appearance-none px-[14px] py-[7px] border border-[#201D1E20] bg-transparent rounded-md w-full md:w-[121px] cursor-pointer focus:border-gray-300 duration-200 user-selection"
                onFocus={() => setIsSelectOpen(true)}
                onBlur={() => setIsSelectOpen(false)}
              >
                <option value="showing">Showing</option>
                <option value="all">All</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-[10px] w-[20px] h-[20px] transition-transform duration-300 ${
                  isSelectOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>

          <div className="flex gap-[10px] user-action-buttons-container w-full md:w-auto justify-start">
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md user-create-btn duration-200 w-[176px]"
              onClick={openModal}
            >
              Create User
              <img
                src={plusicon}
                alt="plus icon"
                className="w-[15px] h-[15px]"
              />
            </button>
            <button
              className="flex items-center justify-center gap-2 h-[38px] rounded-md duration-200 user-download-btn w-[122px]"
            >
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
            {paginatedData.map((user, index) => (
              <tr
                key={index}
                className="border-b border-[#E9E9E9] h-[57px] hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 text-left user-data">{user.id}</td>
                <td className="px-5 text-left user-data">{user.date}</td>
                <td className="pl-5 text-left user-data">{user.name}</td>
                <td className="px-5 text-left user-data">{user.username}</td>
                <td className="pl-12 pr-5 text-left user-data">{user.role}</td>
                <td className="px-5 text-left user-data">
                  <span
                    className={`px-[10px] py-[5px] rounded-[4px] w-[69px] ${
                      user.status === "Active"
                        ? "bg-[#e1ffea] text-[#28C76F]"
                        : "bg-[#FFE1E1] text-[#C72828]"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 text-left user-data">
                  <ToggleSwitch
                    id={user.id}
                    isActive={toggleStates[user.id] || false}
                    onChange={handleToggle}
                  />
                </td>
                <td className="px-5 flex gap-[23px] items-center justify-end h-[57px]">
                  <button onClick={openEditModal}>
                    <img
                      src={editicon}
                      alt="Edit"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                  <button>
                    <img
                      src={deletesicon}
                      alt="Deletes"
                      className="w-[18px] h-[18px] action-btn duration-200"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="user-table-row-head">
              <th className="px-5 text-left user-thead user-id-column">ID</th>
              <th className="px-5 text-left user-thead">CREATED DATE</th>
              <th className="px-5 text-right user-thead"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    expandedRows[user.id]
                      ? "mobile-no-border"
                      : "mobile-with-border"
                  } border-b border-[#E9E9E9] h-[57px]`}
                >
                  <td className="px-5 text-left user-data">{user.id}</td>
                  <td className="px-5 text-left user-data">{user.date}</td>
                  <td className="py-4 flex items-center justify-end h-[57px]">
                    <div
                      className={`user-dropdown-field ${
                        expandedRows[user.id] ? "active" : ""
                      }`}
                      onClick={() => toggleRowExpand(user.id)}
                    >
                      <img src={downarrow} alt="drop-down-arrow"
                        className={`user-dropdown-img  ${
                          expandedRows[user.id] ? "text-white" : ""
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows[user.id] && (
                  <tr className="mobile-with-border border-b border-[#E9E9E9]">
                    <td colSpan={3} className="px-5">
                      <div className="user-dropdown-content">
                        <div className="grid grid-cols-3 gap-9 mb-6">
                          <div>
                            <div className="dropdown-label">NAME</div>
                            <div className="dropdown-value">{user.name}</div>
                          </div>
                          <div className="ml-[15px]">
                            <div className="dropdown-label">USERNAME</div>
                            <div className="dropdown-value">{user.username}</div>
                          </div>
                          <div className="ml-[25px]">
                            <div className="dropdown-label">ROLE</div>
                            <div className="dropdown-value">{user.role}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-9 mb-5">
                          <div>
                            <div className="dropdown-label">STATUS</div>
                            <div className="dropdown-value">
                              <span
                                className={`px-[10px] py-[5px] w-[53px] h-[24px] rounded-[4px] user-status ${
                                  user.status === "Active"
                                    ? "bg-[#e1ffea] text-[#28C76F]"
                                    : "bg-[#FFE1E1] text-[#C72828] !pr-[0px] !pl-[5px]"
                                }`}
                              >
                                {user.status}
                              </span>
                            </div>
                          </div>
                          <div className="ml-[15px]">
                            <div className="dropdown-label">BLOCK</div>
                            <div className="dropdown-value flex items-center gap-2 mt-[10px]">
                              <ToggleSwitch
                                id={user.id}
                                isActive={toggleStates[user.id] || false}
                                onChange={handleToggle}
                              />
                            </div>
                          </div>
                          <div className="ml-[25px]">
                            <div className="dropdown-label">ACTION</div>
                            <div className="dropdown-value flex items-center gap-2 mt-[10px]">
                              <button onClick={openEditModal}>
                                <img
                                  src={editicon}
                                  alt="Edit"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                              <button>
                                <img
                                  src={deletesicon}
                                  alt="Deletes"
                                  className="w-[18px] h-[18px] action-btn duration-200"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 md:px-5 pagination-container">
        <span className="collection-list-pagination pagination-text">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>
        <div className="flex gap-[4px] overflow-x-auto py-2 w-full md:w-auto pagination-buttons">
          <button
            className="px-[10px] py-[6px] rounded-md bg-[#F4F4F4] hover:bg-[#e6e6e6] duration-200 cursor-pointer pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
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

      <AdminCreateUserModal isOpen={isModalOpen} onClose={closeModal} />
      <EditUserModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
};

export default AdminUsers;