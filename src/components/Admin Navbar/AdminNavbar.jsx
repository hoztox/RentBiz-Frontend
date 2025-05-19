import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Images/Admin Sidebar/Rentbiz Logo.svg";
import backarrow from "../../assets/Images/Admin Navbar/backarrow.svg";
import profile from "../../assets/Images/Admin Navbar/profile.svg";
import mobilemenu from "../../assets/Images/Admin Navbar/mobile-menu.svg";
import "./adminnavbar.css";
import MobileSlideMenu from "../MobileSlideMenu/MobileSlideMenu";
import AdminCreateUserModal from "../AdminCreateUserModal/AdminCreateUserModal";
import CreateTenancyModal from "../../pages/Admin Tenancy/CreateTenancy/CreateTenancyModal";
import CreateTenantModal from "../../pages/Admin Tenants/CreateTenantModal/CreateTenantModal";
import { useModal } from "../../context/ModalContext";

const routeTitles = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/users-manage": "Users Overview",
  "/admin/buildings": "Building Overview",
  "/admin/units": "Unit Overview",
  "/admin/tenants": "Tenant Overview",
  "/admin/tenancy-master": "Tenancy Overview",
  "/admin/tenancy-confirm": "Tenancy Confirm Overview",
  "/admin/tenancy-renewal": "Tenancy Renewal Overview",
  "/admin/tenancy-termination": "Tenancy Cancellation Overview",
  "/admin/tenancy-close": "Tenancy Close Overview",
  "/admin/masters-unit-type": "Unit Masters Overview",
  "/admin/masters-id-type": "ID Type Masters Overview",
  "/admin/masters-charge-code-type": "Charge Code Type Masters Overview",
  "/admin/masters-charges": "Charges Masters Overview",
  "/admin/masters-document-type": "Document Type Masters Overview",
  "/admin/masters-translate": "Language Overview",
  "/admin/masters-currency": "Currency Overview",
  "/admin/additional-charges": "Additional Charges Overview",
  "/admin/invoice": "Invoice Overview",
  "/admin/monthly-invoice": "Invoice Overview",
  "/admin/collection": "Collection Overview",
  "/admin/expense": "Expense Overview",
  "/admin/refund": "Refund Overview",
  "/admin/tenancy-report": "Tenant Report Overview",
  "/admin/upcoming-collection": "Upcoming Collection Overview",
  "/admin/collection-report": "Collection Report Overview",
  "/admin/income-expense-report": "Income / Expense Report Overview",
  default: "Admin Panel",
};

const mobileRouteTitles = {
  "/admin/users-manage": "Users",
  "/admin/buildings": "Buildings",
  "/admin/units": "Units",
  "/admin/tenants": "Tenants",
  "/admin/tenancy-master": "Tenancy",
  "/admin/tenancy-confirm": "Tenancy Confirm",
  "/admin/tenancy-renewal": "Tenancy Renewal",
  "/admin/tenancy-termination": "Tenancy Termination",
  "/admin/tenancy-close": "Tenancy Closing",
  "/admin/masters-unit-type": "Unit Type Masters",
  "/admin/masters-id-type": "ID Type Masters",
  "/admin/masters-charge-code-type": "Charge Code Type",
  "/admin/masters-charges": "Charges Master",
  "/admin/masters-document-type": "Document Type Masters",
  "/admin/masters-translate": "Translation",
  "/admin/masters-currency": "Currency",
  "/admin/additional-charges": "Additional Charges",
  "/admin/invoice": "Invoice List",
  "/admin/monthly-invoice": "Monthly Invoice List",
  "/admin/collection": "Collection",
  "/admin/expense": "Expenses",
  "/admin/refund": "Refund",
  "/admin/tenancy-report": "Tenant Report",
  "/admin/upcoming-collection": "Upcoming Collection Report",
  "/admin/collection-report": "Collection Report",
  "/admin/income-expense-report": "Income-Expense Report",
  default: "Admin"
};

const modalTitles = {
  "user-create": "Create User",
  "user-update": "Update User",
  "tenancy-create": "Create New Tenancy",
  "tenancy-update": "Update Tenancy",
  "tenancy-view": "Tenancy View",
  "create-unit-type-master": "Create New Unit Type Master",
  "update-unit-type-master": "Update Unit Type Master",
  "create-id-type-master":"Create New ID Type Master",
  "update-id-type-master":"Update ID Type Master",
  "create-charge-code-type": "Create New Charge Code Master",
  "update-charge-code-type": "Update Charge Code Master",
  "create-charges-master": "Create New Charges Master",
  "update-charges-master": "Update Charges Master",
  "create-document-type-master": "Create New Document Type Master",
  "update-document-type-master": "Update Document Type Master",
  "add-currency-master": "Create New Currency",
  "update-currency-master": "Update Currency",
  "create-additional-charges": "Create New Additional Charges",
  "update-additional-charges": "Update Additional Charges"
}

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  // const [isCreateTenantModalOpen, setIsCreateTenantModalOpen] = useState(false);
  // const [isTenancyModalOpen, setIsTenancyModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { modalState, closeModal} = useModal();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const isDashboard = currentPath === "/admin/dashboard";

  const getPageTitle = (isMobile = false) => {
    if (isMobile && modalState.isOpen) {
      return modalTitles[modalState.type] || mobileRouteTitles.default;
    }

    const path = currentPath;
    const titles = isMobile ? mobileRouteTitles : routeTitles;

    // Check for exact route match
    if (titles[path]) return titles[path];

      // Handle nested routes (optional, uncomment if needed)
    // if (path.startsWith("/admin/buildings")) return titles["/admin/buildings"];
    // if (path.startsWith("/admin/units")) return titles["/admin/units"];
    // if (path.startsWith("/admin/tenants")) return titles["/admin/tenants"];
    // if (path.startsWith("/admin/tenancy")) return titles["/admin/tenancy-master"];
    // if (path.startsWith("/admin/masters")) return titles["/admin/masters-unit-type"];

    // Fallback for unknown routes
    return titles.default || "Admin";
  };

  // Store current path in localstorage when it changes
  useEffect(() => {
    if (currentPath) {
      localStorage.setItem("currentAdminPath", currentPath);
    }
  }, [currentPath]);

  // Retrieve path from localstorage on initial load
  useEffect(() => {
    const savedPath = localStorage.getItem("currentAdminPath");
    if (savedPath && !currentPath) {
      setCurrentPath(savedPath);
    }
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // const openUserModal = () => {
  //   setIsUserModalOpen(true);
  // };

  // const closeUserModal = () => {
  //   setIsUserModalOpen(false);
  // };

  // const openCreateTenantModal = () => {
  //   setIsCreateTenantModalOpen(true);
  // };

  // const closeCreateTenentModal = () => {
  //   setIsCreateTenantModalOpen(false);
  // };

  // const openTenancyModal = () => {
  //   setIsTenancyModalOpen(true);
  // };

  // const closeTenancyModal = () => {
  //   setIsTenancyModalOpen(false);
  // };

  
  const handleBackClick = () => {
    if (modalState.isOpen) {
      closeModal();
    } else {
      navigate(-1);
    }
  };

  const handleLogoClick = () => {
    navigate("/admin/dashboard");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={`flex items-center justify-between mx-5 h-[86px] border-b border-[#E9E9E9] bg-white admin-navbar ${
          isDashboard ? "dashboard-nav" : "non-dashboard-nav"
        } ${modalState.isOpen ? "modal-open" : ""}`}
      >
        <div className="flex items-center w-full">
          {/* Left Section: Logo or Back Arrow */}
          <div className="left-section">
            {isDashboard && !modalState.isOpen ? (
              <img
                src={logo}
                alt="RentBiz Logo"
                className="RentBiz-Logo"
                onClick={handleLogoClick}
                aria-label="Navigate to dashboard"
              />
            ) : (
              <img
                src={backarrow}
                alt="Back Arrow"
                className="back-arrow"
                onClick={handleBackClick}
                aria-label={modalState.isOpen ? "Close modal" : "Go back"}
              />
            )}
          </div>

          {/* Center Section: Page Title (non-dashboard pages or modals in mobile) */}
          {(modalState.isOpen || !isDashboard) && (
            <h1 className="mobile-page-title">{getPageTitle(true)}</h1>
          )}

          {/* Desktop Page Title */}
          <h1 className="navbar-head">{getPageTitle(false)}</h1>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu" onClick={toggleMobileMenu}>
          <img src={mobilemenu} alt="Menu Icon" className="w-[20px] h-[20px]" />
        </button>

        {/* Right Section: Language Dropdown and Profile (Desktop) */}
        <div className="flex items-center navbar-right-side">
          <div className="relative mr-5" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between px-3 py-[7px] border border-[#E9E9E9] rounded-md bg-[#FBFBFB] w-[120px] h-[36px] select-box"
            >
              {selectedLanguage}
              <ChevronDown
                size={20}
                className={`ml-2 transform transition-transform duration-300 ease-in-out text-[#201D1E] ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute mt-1 w-[120px] bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? "opacity-100 max-h-40 transform translate-y-0"
                  : "opacity-0 max-h-0 transform -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="py-1">
                <button
                  onClick={() => selectLanguage("English")}
                  className="block w-full text-left px-4 py-2 options-text hover:bg-gray-100"
                >
                  English
                </button>
                <button
                  onClick={() => selectLanguage("العربية")}
                  className="block w-full text-left px-4 py-2 options-text hover:bg-gray-100"
                >
                  العربية
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center profile-section">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-5">
              <img
                src={profile}
                alt="User Profile"
                className="w-[46px] h-[46px] object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="admin-name">Hi, Admin</span>
              <span className="admin-email">example@gmail.com</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <MobileSlideMenu
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Modals */}
      <AdminCreateUserModal />
      <CreateTenantModal />
      <CreateTenancyModal />
    </>
  );
};

export default AdminNavbar;
