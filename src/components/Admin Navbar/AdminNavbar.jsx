import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Images/Admin Sidebar/Rentbiz Logo.svg";
import backarrow from "../../assets/Images/Admin Navbar/backarrow.svg";
import profile from "../../assets/Images/Admin Navbar/profile.png";
import mobilemenu from "../../assets/Images/Admin Navbar/mobile-menu.svg";
import "./adminnavbar.css";
import MobileSlideMenu from "../MobileSlideMenu/MobileSlideMenu";
import { useModal } from "../../context/ModalContext";
import { BASE_URL } from "../../utils/config";

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
  "/admin/masters-charge-code": "Charge Code Masters Overview",
  "/admin/masters-taxes": "Taxes Overview",
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
  "/admin/masters-charge-code": "Charge Code Masters",
  "/admin/masters-taxes": "Taxes Overview",
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
  "/admin/building-timeline": "",
  "/admin/create-building": "Create New Building",
  "/admin/upload-documents": "Upload Documents",
  "/admin/submitted": "Submitted",
  "/admin/update-building-timeline": "",
  "/admin/update-building": "Update Building",
  "/admin/update-building-upload-documents": "Upload Documents",
  "/admin/update-building-submitted": "Submitted",
  "/admin/unit-timeline": "",
  "/admin/unit-select-building-form": "Select Building",
  "/admin/unit-create-unit-form": "Create New Unit",
  "/admin/unit-upload-documents": "Upload Documents",
  "/admin/unit-submitted": "Submitted",
  "/admin/update-unit-timeline": "",
  "/admin/update-select-building-form": "Select Building",
  "/admin/update-unit": "Update Unit",
  "/admin/update-unit-upload-documents": "Upload Documents",
  "/admin/update-unit-submitted": "Submitted",
  "/admin/tenant-timeline": "",
  "/admin/tenant-upload-documents": "Upload Documents",
  "/admin/tenant-submitted": "Submitted",
  "/admin/edit-tenant-timeline": "",
  "/admin/edit-create-tenant": "Update Tenant",
  "/admin/edit-tenant-upload-docs": "Upload Documents",
  "/admin/edit-tenant-submitted": "Submitted",
  default: "Admin",
};

const modalTitles = {
  "user-create": "Create User",
  "user-update": "Update User",
  "create-building": "Create New Building",
  "edit-building": "Update Building",
  "create-unit": "Select Building",
  "edit-unit": "Select Building",
  "create-tenant": "Create New Tenant",
  "tenancy-create": "Create New Tenancy",
  "tenancy-update": "Update Tenancy",
  "tenancy-view": "Tenancy View",
  "create-unit-type-master": "Create New Unit Type Master",
  "update-unit-type-master": "Update Unit Type Master",
  // "create-id-type-master": "Create New ID Type Master",
  // "update-id-type-master": "Update ID Type Master",
  "create-charge-code-type": "Create New Charge Code Master",
  "update-charge-code-type": "Update Charge Code Master",
  "create-tax-master": "Create New Tax",
  "update-tax-master": "Update Tax",
  "create-charges-master": "Create New Charges Master",
  "update-charges-master": "Update Charges Master",
  "create-document-type-master": "Create New Document Type Master",
  "update-document-type-master": "Update Document Type Master",
  "add-currency-master": "Create New Currency",
  "update-currency-master": "Update Currency",
  "create-additional-charges": "Create New Additional Charges",
  "update-additional-charges": "Update Additional Charges",
  "create-invoice": "Create New Invoice",
  "view-invoice": "Invoice View",
  "create-monthly-invoice": "Create New Monthly Invoice",
  "view-monthly-invoice": "Monthly Invoice View",
  "create-collection": "Create New Collection",
  "update-collection": "Update Collection",
  "create-expense": "Create New Expense",
  "update-expense": "Update Expense",
  "create-refund": "Create Refund",
  "update-refund": "Update Refund",
  "tenancy-renewal": "Tenancy Renewal",
};

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profileImage: profile, // fallback to default
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { modalState, closeModal } = useModal();

  // Helper functions
  const getUserCompanyId = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "company") {
      return localStorage.getItem("company_id");
    } else if (role === "user") {
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
    if (role === "user") {
      const userId = localStorage.getItem("user_id");
      if (userId) return userId;
    }
    return null;
  };

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const role = localStorage.getItem("role")?.toLowerCase();

      if (role === "company") {
        const companyId = getUserCompanyId();
        if (companyId) {
          const response = await axios.get(
            `${BASE_URL}/accounts/company/${companyId}/detail/`
          );
          const companyData = response.data;

          setProfileData({
            name: companyData.company_name || "Admin",
            email: companyData.email_address || "example@gmail.com",
            profileImage: companyData.company_logo
              ? companyData.company_logo.startsWith("http")
                ? companyData.company_logo
                : `${BASE_URL.replace("/api", "")}${companyData.company_logo}`
              : profile,
          });
          console.log("company details:", response.data);
        }
      } else if (role === "user") {
        const userId = getRelevantUserId();
        if (userId) {
          const response = await axios.get(
            `${BASE_URL}/company/user/${userId}/details/`
          );
          const userData = response.data;

          setProfileData({
            name: userData.name || "User",
            email: userData.email || "example@gmail.com",
            profileImage: userData.company_logo
              ? userData.company_logo.startsWith("http")
                ? userData.company_logo
                : `${BASE_URL.replace("/api", "")}${userData.company_logo}`
              : profile,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Keep default values if API call fails
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const isDashboard = currentPath === "/admin/dashboard";

  const getPageTitle = (isMobile = false) => {
    // Prioritize modal title when modal is open and title is set
    if (modalState.isOpen && modalState.title) {
      return modalState.title;
    }

    // Fallback to modal type if title is not set
    if (modalState.isOpen && modalState.type) {
      return modalTitles[modalState.type] || mobileRouteTitles.default;
    }

    const path = currentPath;
    const titles = isMobile ? mobileRouteTitles : routeTitles;

    // Check for exact route match and allow empty string to be returned
    if (path in titles) {
      return titles[path] !== undefined ? titles[path] : "";
    }

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
  }, []);

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

  // Handle profile image error
  const handleImageError = (e) => {
    e.target.src = profile; // fallback to default image
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

          {/* Center Section: Page Title (mobile view) */}
          {(modalState.isOpen || !isDashboard) && (
            <h1 className="mobile-page-title" aria-live="polite">
              {getPageTitle(true)}
            </h1>
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

          <div className="flex items-center profile-section justify-end">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-5">
              {isLoadingProfile ? (
                <div className="w-[46px] h-[46px] bg-gray-200 animate-pulse rounded-full"></div>
              ) : (
                <img
                  src={profileData.profileImage}
                  alt="User Profile"
                  className="w-[46px] h-[46px] object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
            <div className="flex flex-col">
              {isLoadingProfile ? (
                <>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                </>
              ) : (
                <>
                  <span className="admin-name whitespace-nowrap">
                    Hi, {profileData.name}
                  </span>
                  <span className="admin-email whitespace-nowrap">
                    {profileData.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <MobileSlideMenu
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </>
  );
};

export default AdminNavbar;
