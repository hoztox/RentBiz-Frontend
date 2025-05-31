import React, { useState } from "react";
import "./adminsidebar.css";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Images/Admin Sidebar/Rentbiz Logo.svg";
import dashboard from "../../assets/Images/Admin Sidebar/dashboard.svg";
import users from "../../assets/Images/Admin Sidebar/users.svg";
import properties from "../../assets/Images/Admin Sidebar/properties.svg";
import tenants from "../../assets/Images/Admin Sidebar/tenants.svg";
import tenancy from "../../assets/Images/Admin Sidebar/tenancy.svg";
import masters from "../../assets/Images/Admin Sidebar/masters.svg";
import currency from "../../assets/Images/Admin Sidebar/currency.svg";
import additionalCharges from "../../assets/Images/Admin Sidebar/additional charges.svg";
import invoice from "../../assets/Images/Admin Sidebar/invoice.svg";
import monthlyInvoice from "../../assets/Images/Admin Sidebar/monthly invoice.svg";
import financialCollection from "../../assets/Images/Admin Sidebar/financial collection.svg";
import expense from "../../assets/Images/Admin Sidebar/expense.svg";
import refund from "../../assets/Images/Admin Sidebar/refund.svg";
import tenancyReport from "../../assets/Images/Admin Sidebar/tenancy report.svg";
import upcomingCollection from "../../assets/Images/Admin Sidebar/upcoming collection.svg";
import reportCollection from "../../assets/Images/Admin Sidebar/report collection.svg";
import incomeExpense from "../../assets/Images/Admin Sidebar/income-expense.svg";
import logout from "../../assets/Images/Admin Sidebar/logout-icon.svg"
import CreateTenantModal from "../../pages/Admin Tenants/CreateTenantModal/CreateTenantModal";
import { useModal } from "../../context/ModalContext";

const AdminSidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleNonDropdownClick = (item, path) => {
    setActiveItem(item);

    // Close all dropdown menus
    setExpandedMenus({
      Users: false,
      Properties: false,
      Tenants: false,
      Tenancy: false,
      Masters: false,
    });

    // Navigate to the provided path
    navigate(path);
  };

  const [expandedMenus, setExpandedMenus] = useState({
    Users: false,
    Properties: false,
    Tenants: false,
    Tenancy: false,
    Masters: false,
  });

  const toggleMenu = (menu) => {
    // Create a new object with all menus closed
    const newExpandedState = {
      Users: false,
      Properties: false,
      Tenants: false,
      Tenancy: false,
      Masters: false,
    };

    // Only toggle the selected menu
    newExpandedState[menu] = !expandedMenus[menu];

    // Update the state with the new object
    setExpandedMenus(newExpandedState);
  };

  const handleLogoClick = () => {
    setActiveItem("Dashboard"); // Update the active state
    navigate("/admin/dashboard");
  };

  // Create Tenant Modal
  const [isCreateTenantModalOpen, setIsCreateTenantModalOpen] = useState(false);

  const openCreateTenantModal = () => {
    setIsCreateTenantModalOpen(true);
    setActiveItem("Tenants Master");
  };

  const closeCreateTenantModal = () => {
    setIsCreateTenantModalOpen(false);
    setActiveItem("Tenants Master");
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();

    // Navigate to login page
    navigate("/");

    // Update active item to reflect logout
    setActiveItem("Logout");
  };

  return (
    <div className="flex flex-col admin-sidebar">
      {/* Logo */}
      <div className="flex justify-center items-center pt-[30px] pb-[32px]">
        <img
          src={logo}
          alt="Rentbiz Logo"
          className="h-[78px] w-[128px] cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto">
        <div className="mx-5 mb-8">
          <div
            className={`flex items-center px-[12px] py-[7px] gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Dashboard"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick("Dashboard", "/admin/dashboard")
            }
          >
            <img
              src={dashboard}
              alt="Dashboard"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Dashboard</p>
          </div>
        </div>

        {/* User Management */}
        <div className="mx-5">
          <h3 className="pb-3 category-head">USER MANAGEMENT</h3>
          <div
            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Users"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => {
              toggleMenu("Users");
              setActiveItem("Users");
            }}
          >
            <div className="flex items-center gap-[10px]">
              <img src={users} alt="Users" className="w-[18px] sidebar-icon" />
              <p className="pb-[2px] menu-text">Users</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Users ? "rotate-180" : ""
                }`}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMenus.Users
              ? "max-h-24 opacity-100 mb-3"
              : "max-h-0 opacity-0"
              }`}
          >
            <div>
              <div
                className={`cursor-pointer mb-2 transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Create User" ? "submenu-active" : ""
                  }`}
                onClick={() => {
                  setActiveItem("Create User");
                  openModal("user-create");
                }}
              >
                <p className="pl-10 py-[7px]">Create User</p>
              </div>

              <div
                className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Manage Users" ? "submenu-active" : ""
                  }`}
                onClick={() => {
                  setActiveItem("Manage Users");
                  navigate("/admin/users-manage");
                }}
              >
                <p className="pl-10 py-[7px]">Manage Users</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] mt-[24px] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">OPERATIONS</h3>

          {/* Properties with dropdown */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Properties"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => {
                toggleMenu("Properties");
                setActiveItem("Properties");
              }}
            >
              <div className="flex items-center gap-[10px]">
                <img
                  src={properties}
                  alt="Properties"
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">Properties</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Properties ? "rotate-180" : ""
                  }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMenus.Properties
                ? "max-h-24 opacity-100 mb-3"
                : "max-h-0 opacity-0"
                }`}
            >
              <div>
                <div
                  className={`cursor-pointer mb-2 transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Buildings" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Buildings");
                    navigate("/admin/buildings");
                  }}
                >
                  <p className="pl-10 py-[7px]">Buildings</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Units" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Units");
                    navigate("/admin/units");
                  }}
                >
                  <p className="pl-10 py-[7px]">Units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenants with dropdown */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Tenants"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => {
                toggleMenu("Tenants");
                setActiveItem("Tenants");
              }}
            >
              <div className="flex items-center gap-[10px]">
                <img
                  src={tenants}
                  alt="Tenants"
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">Tenants</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Tenants ? "rotate-180" : ""
                  }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMenus.Tenants
                ? "max-h-24 opacity-100 mb-3"
                : "max-h-0 opacity-0"
                }`}
            >
              <div>
                <div
                  className={`cursor-pointer mb-2 transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Tenants Master" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Tenants Master");
                    navigate("/admin/tenants");
                  }}
                >
                  <p className="pl-10 py-[7px]">Tenants Master</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Create Tenant" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Create Tenant");
                    openCreateTenantModal();
                    navigate("/admin/tenants");
                  }}
                >
                  <p className="pl-10 py-[7px]">Create Tenant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenancy with dropdown */}
          <div className="mb-6">
            <div
              className={`flex items-center mb-2 justify-between px-3 py-[7px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Tenancy" ? "menu-active" : "hover:bg-gray-200"
                }`}
              onClick={() => {
                toggleMenu("Tenancy");
                setActiveItem("Tenancy");
              }}
              role="button"
              aria-expanded={expandedMenus.Tenancy}
              aria-controls="tenancy-submenu"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleMenu("Tenancy");
                  setActiveItem("Tenancy");
                }
              }}
            >
              <div className="flex items-center gap-[10px]">
                <img
                  src={tenancy}
                  alt="Tenancy"
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">Tenancy</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Tenancy ? "rotate-180" : ""
                  }`}
                aria-hidden="true"
              />
            </div>
            <div
              id="tenancy-submenu"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMenus.Tenancy
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="flex flex-col py-2">
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Create Tenancy" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Create Tenancy");
                    openModal("tenancy-create");
                    navigate("/admin/tenancy-master");
                  }}
                >
                  <p className="pl-10 py-[7px]">Create Tenancy</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Tenancy Master" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Tenancy Master");
                    navigate("/admin/tenancy-master");
                  }}
                >
                  <p className="pl-10 py-[7px]">Tenancy Master</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Tenancy Confirm" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Tenancy Confirm");
                    navigate("/admin/tenancy-confirm");
                  }}
                >
                  <p className="pl-10 py-[7px]">Tenancy Confirm</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Tenancy Renewal" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Tenancy Renewal");
                    navigate("/admin/tenancy-renewal");
                  }}
                >
                  <p className="pl-10 py-[7px]">Tenancy Renewal</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Tenancy Termination" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Tenancy Termination");
                    navigate("/admin/tenancy-termination");
                  }}
                >
                  <p className="pl-10 py-[7px]">Tenancy Termination</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Close Tenancy" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Close Tenancy");
                    navigate("/admin/tenancy-close");
                  }}
                >
                  <p className="pl-10 py-[7px]">Close Tenancy</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">MASTERS</h3>
          {/* Masters with dropdown */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Masters"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => {
                toggleMenu("Masters");
                setActiveItem("Masters");
              }}
            >
              <div className="flex items-center gap-[10px]">
                <img
                  src={masters}
                  alt="Masters"
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">Masters</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${expandedMenus.Masters ? "rotate-180" : ""
                  }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMenus.Masters
                ? "max-h-96 opacity-100 mb-3"
                : "max-h-0 opacity-0"
                }`}
            >
              <div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Unit Type" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Unit Type");
                    navigate("/admin/masters-unit-type");
                  }}
                >
                  <p className="pl-10 py-[7px]">Unit Type</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "ID Type" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("ID Type");
                    navigate("/admin/masters-id-type");
                  }}
                >
                  <p className="pl-10 py-[7px]">ID Type</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Charge Code" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Charge Code");
                    navigate("/admin/masters-charge-code");
                  }}
                >
                  <p className="pl-10 py-[7px]">Charge Code</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Taxes" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Taxes");
                    navigate("/admin/masters-taxes");
                  }}
                >
                  <p className="pl-10 py-[7px]">Taxes</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Charges" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Charges");
                    navigate("/admin/masters-charges");
                  }}
                >
                  <p className="pl-10 py-[7px]">Charges</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Document Type" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Document Type");
                    navigate("/admin/masters-document-type");
                  }}
                >
                  <p className="pl-10 py-[7px]">Document Type</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${activeItem === "Translate" ? "submenu-active" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("Translate");
                    navigate("/admin/masters-translate");
                  }}
                >
                  <p className="pl-10 py-[7px]">Translate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Currency as normal tab */}
          <div className="mb-6">
            <div
              className={`flex items-center py-[7px] px-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Currency"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() =>
                handleNonDropdownClick("Currency", "/admin/masters-currency")
              }
            >
              <img
                src={currency}
                alt="Currency"
                className="w-[18px] sidebar-icon"
              />
              <p className="pb-[2px] menu-text">Currency</p>
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">FINANCIAL</h3>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "AdditionalCharges"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick(
                "AdditionalCharges",
                "/admin/additional-charges"
              )
            }
          >
            <img
              src={additionalCharges}
              alt="Additional Charges"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Additional Charges</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Invoice"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => handleNonDropdownClick("Invoice", "/admin/invoice")}
          >
            <img
              src={invoice}
              alt="Invoice"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Invoice</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "MonthlyInvoice"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick("MonthlyInvoice", "/admin/monthly-invoice")
            }
          >
            <img
              src={monthlyInvoice}
              alt="Monthly Invoice"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Monthly Invoice</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Collection"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick("Collection", "/admin/collection")
            }
          >
            <img
              src={financialCollection}
              alt="Financial Collection"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Collection</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Expense"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => handleNonDropdownClick("Expense", "/admin/expense")}
          >
            <img
              src={expense}
              alt="Expense"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Expense</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Refund"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => handleNonDropdownClick("Refund", "/admin/refund")}
          >
            <img src={refund} alt="Refund" className="w-[18px] sidebar-icon" />
            <p className="pb-[2px] menu-text">Refund</p>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">REPORTS</h3>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "TenancyReport"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick("TenancyReport", "/admin/tenancy-report")
            }
          >
            <img
              src={tenancyReport}
              alt="Tenancy Report"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Tenancy Report</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "UpcomingCollection"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick(
                "UpcomingCollection",
                "/admin/upcoming-collection"
              )
            }
          >
            <img
              src={upcomingCollection}
              alt="Upcoming Collection"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Upcoming Collection</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "ReportCollection"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick(
                "ReportCollection",
                "/admin/collection-report"
              )
            }
          >
            <img
              src={reportCollection}
              alt="Report Collection"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Collection</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "IncomeExpense"
              ? "menu-active"
              : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() =>
              handleNonDropdownClick(
                "IncomeExpense",
                "/admin/income-expense-report"
              )
            }
          >
            <img
              src={incomeExpense}
              alt="Income Expense"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Income/Expense</p>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <div
            className={`flex items-center py-[7px] px-3 mb-5 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${activeItem === "Logout"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
              }`}
            onClick={handleLogout}
            role="button"
            aria-label="Logout"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleLogout();
              }
            }}
          >
            <img
              src={logout}
              alt="Logout"
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">Logout</p>
          </div>
        </div>
      </div>


      {/* Create Tenant Modal */}
      <CreateTenantModal
        open={isCreateTenantModalOpen}
        onClose={closeCreateTenantModal}
      />

      {/* Footer */}
      <div className="mx-5 border-t border-[#E8E8E8] text-start py-6 side-footer-text ">
        Powered By RentBiz - 2025
      </div>
    </div>
  );
};

export default AdminSidebar;
