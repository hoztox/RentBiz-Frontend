import React, { useState } from "react";
import "./adminsidebar.css";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
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
import incomeExpense from "../../assets/Images/Admin Sidebar/income-expense.svg";
import logoutIcon from "../../assets/Images/Admin Sidebar/logout-icon.svg";
import CreateTenantModal from "../../pages/Admin Tenants/CreateTenantModal/CreateTenantModal";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-hot-toast';

const AdminSidebar = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const { logout } = useAuth();

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

  const closeCreateTenantModal = () => {
    setIsCreateTenantModalOpen(false);
    setActiveItem("Tenants Master");
  };

  const handleLogout = async () => {
    closeModal();
    setIsCreateTenantModalOpen(false); // Close CreateTenantModal

    // Call AuthContext logout
    logout();

    // Show toast
    toast.success(t('toast.logout_success'));

    // Update active item
    setActiveItem("Logout");
  };

  return (
    <div className="flex flex-col admin-sidebar">
      {/* Logo */}
      <div className="flex justify-center items-center pt-[30px] pb-[32px]">
        <img
          src={logo}
          alt={t('logo_alt')}
          className="h-[78px] w-[128px] cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto">
        <div className="mx-5 mb-8">
          <div
            className={`flex items-center px-[12px] py-[7px] gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "Dashboard"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              handleNonDropdownClick("Dashboard", "/admin/dashboard")
            }
          >
            <img
              src={dashboard}
              alt={t('sidebar.dashboard')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.dashboard')}</p>
          </div>
        </div>

        {/* User Management */}
        <div className="mx-5">
          <h3 className="pb-3 category-head">{t('sidebar.user_management')}</h3>
          <div
            className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "Users"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              toggleMenu("Users");
              setActiveItem("Users");
            }}
          >
            <div className="flex items-center gap-[10px]">
              <img src={users} alt={t('sidebar.users')} className="w-[18px] sidebar-icon" />
              <p className="pb-[2px] menu-text">{t('sidebar.users')}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${
                expandedMenus.Users ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expandedMenus.Users
                ? "max-h-24 opacity-100 mb-3"
                : "max-h-0 opacity-0"
            }`}
          >
            <div>
              <div
                className={`cursor-pointer mb-2 transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                  activeItem === "Create User" ? "submenu-active" : ""
                }`}
                onClick={() => {
                  setActiveItem("Create User");
                  openModal("user-create", t('sidebar.create_user'));
                }}
              >
                <p className="pl-10 py-[7px]">{t('sidebar.create_user')}</p>
              </div>

              <div
                className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                  activeItem === "Manage Users" ? "submenu-active" : ""
                }`}
                onClick={() => {
                  setActiveItem("Manage Users");
                  navigate("/admin/users-manage");
                }}
              >
                <p className="pl-10 py-[7px]">{t('sidebar.manage_users')}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] mt-[24px] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">{t('sidebar.operations')}</h3>

          {/* Properties with dropdown */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "Properties"
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
                  alt={t('sidebar.properties')}
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">{t('sidebar.properties')}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${
                  expandedMenus.Properties ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedMenus.Properties
                  ? "max-h-24 opacity-100 mb-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <div
                  className={`cursor-pointer mb-2 transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Buildings" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Buildings");
                    navigate("/admin/buildings");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.buildings')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Units" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Units");
                    navigate("/admin/units");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.units')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenants with dropdown */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "Tenants"
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
                  alt={t('sidebar.tenants')}
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">{t('sidebar.tenants')}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${
                  expandedMenus.Tenants ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedMenus.Tenants
                  ? "max-h-24 opacity-100 mb-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <div
                  className={`cursor-pointer mb-2 transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Tenants Master" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Tenants Master");
                    navigate("/admin/tenants");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.tenants_master')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Create Tenant" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Create Tenant");
                    navigate("/admin/tenants");
                    openModal("create-tenant", t('sidebar.create_tenant'));
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.create_tenant')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenancy with dropdown */}
          <div className="mb-6">
            <div
              className={`flex items-center mb-2 justify-between px-3 py-[7px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "Tenancy" ? "menu-active" : "hover:bg-gray-200"
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
                  alt={t('sidebar.tenancy')}
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">{t('sidebar.tenancy')}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${
                  expandedMenus.Tenancy ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </div>
            <div
              id="tenancy-submenu"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedMenus.Tenancy
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col py-2">
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Create Tenancy" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Create Tenancy");
                    openModal("tenancy-create");
                    navigate("/admin/tenancy-master");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.create_tenancy')}</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Tenancy Master" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Tenancy Master");
                    navigate("/admin/tenancy-master");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.tenancy_master')}</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Tenancy Confirm" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Tenancy Confirm");
                    navigate("/admin/tenancy-confirm");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.tenancy_confirm')}</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Tenancy Renewal" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Tenancy Renewal");
                    navigate("/admin/tenancy-renewal");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.tenancy_renewal')}</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Tenancy Termination" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Tenancy Termination");
                    navigate("/admin/tenancy-termination");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.tenancy_termination')}</p>
                </div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Close Tenancy" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Close Tenancy");
                    navigate("/admin/tenancy-close");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.close_tenancy')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">{t('sidebar.masters')}</h3>
          {/* Masters with dropdown */}
          <div>
            <div
              className={`flex items-center justify-between px-3 py-[7px] rounded-[4px] mb-3 cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "Masters"
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
                  alt={t('sidebar.masters')}
                  className="w-[18px] sidebar-icon"
                />
                <p className="pb-[2px] menu-text">{t('sidebar.masters')}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${
                  expandedMenus.Masters ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedMenus.Masters
                  ? "max-h-96 opacity-100 mb-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Unit Type" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Unit Type");
                    navigate("/admin/masters-unit-type");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.unit_type')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "ID Type" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("ID Type");
                    navigate("/admin/masters-id-type");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.id_type')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Charge Code" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Charge Code");
                    navigate("/admin/masters-charge-code");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.charge_code')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Taxes" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Taxes");
                    navigate("/admin/masters-taxes");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.taxes')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Charges" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Charges");
                    navigate("/admin/masters-charges");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.charges')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Document Type" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Document Type");
                    navigate("/admin/masters-document-type");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.document_type')}</p>
                </div>

                <div
                  className={`cursor-pointer transition-all duration-300 ease-in-out sub-menu rounded-md h-[36px] flex items-center ${
                    activeItem === "Translate" ? "submenu-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("Translate");
                    navigate("/admin/masters-translate");
                  }}
                >
                  <p className="pl-10 py-[7px]">{t('sidebar.translate')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Currency as normal tab */}
          <div className="mb-6">
            <div
              className={`flex items-center py-[7px] px-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
                activeItem === "Currency"
                  ? "menu-active"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() =>
                handleNonDropdownClick("Currency", "/admin/masters-currency")
              }
            >
              <img
                src={currency}
                alt={t('sidebar.currency')}
                className="w-[18px] sidebar-icon"
              />
              <p className="pb-[2px] menu-text">{t('sidebar.currency')}</p>
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">{t('sidebar.financial')}</h3>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "AdditionalCharges"
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
              alt={t('sidebar.additional_charges')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.additional_charges')}</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "Invoice"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleNonDropdownClick("Invoice", "/admin/invoice")}
          >
            <img
              src={invoice}
              alt={t('sidebar.invoice')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.invoice')}</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "MonthlyInvoice"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              handleNonDropdownClick("MonthlyInvoice", "/admin/monthly-invoice")
            }
          >
            <img
              src={monthlyInvoice}
              alt={t('sidebar.monthly_invoice')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.monthly_invoice')}</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "Collection"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              handleNonDropdownClick("Collection", "/admin/collection")
            }
          >
            <img
              src={financialCollection}
              alt={t('sidebar.collection')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.collection')}</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-3 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "Expense"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleNonDropdownClick("Expense", "/admin/expense")}
          >
            <img
              src={expense}
              alt={t('sidebar.expense')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.expense')}</p>
          </div>
          <div
            className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "Refund"
                ? "menu-active"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleNonDropdownClick("Refund", "/admin/refund")}
          >
            <img src={refund} alt={t('sidebar.refund')} className="w-[18px] sidebar-icon" />
            <p className="pb-[2px] menu-text">{t('sidebar.refund')}</p>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <h3 className="pb-3 category-head">{t('sidebar.reports')}</h3>
          <div
            className={`flex items-center py-[7px] px-3 mb-6 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === "IncomeExpense"
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
              alt={t('sidebar.income_expense')}
              className="w-[18px] sidebar-icon"
            />
            <p className="pb-[2px] menu-text">{t('sidebar.income_expense')}</p>
          </div>
          <div className="border-t border-[#E8E8E8] mb-6"></div>
        </div>

        <div className="mx-5">
          <div
            className={`flex items-center py-[7px] px-3 mb-5 gap-[10px] rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeItem === 'Logout' ? 'menu-active' : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={handleLogout}
            role="button"
            aria-label={t('sidebar.logout')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogout();
              }
            }}
          >
            <img src={logoutIcon} alt={t('sidebar.logout')} className="w-[18px] sidebar-icon" />
            <p className="pb-[2px] menu-text">{t('sidebar.logout')}</p>
          </div>
        </div>
      </div>

      <CreateTenantModal open={isCreateTenantModalOpen} onClose={closeCreateTenantModal} />

      <div className="mx-5 border-t border-[#E8E8E8] text-start py-6 side-footer-text">
        {t('sidebar.footer')}
      </div>
    </div>
  );
};

export default AdminSidebar;