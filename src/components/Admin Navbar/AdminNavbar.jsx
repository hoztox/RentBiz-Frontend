// src/components/AdminNavbar.js
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import logo from '../../assets/Images/Admin Sidebar/Rentbiz Logo.svg';
import backarrow from '../../assets/Images/Admin Navbar/backarrow.svg';
import profile from '../../assets/Images/Admin Navbar/profile.png';
import mobilemenu from '../../assets/Images/Admin Navbar/mobile-menu.svg';
import './adminnavbar.css';
import MobileSlideMenu from '../MobileSlideMenu/MobileSlideMenu';
import { useModal } from '../../context/ModalContext';
import { BASE_URL } from '../../utils/config';

const AdminNavbar = () => {
  const { t, i18n } = useTranslation(); // Initialize translation
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: profile,
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { modalState, closeModal } = useModal();

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.setAttribute(
      'dir',
      i18n.language === 'ar' ? 'rtl' : 'ltr'
    );
  }, [i18n.language]);

  // Map language names to i18n language codes
  const languageMap = {
    English: 'en',
    العربية: 'ar',
    // Add more languages here, e.g., French: 'fr'
  };

  // Translation keys for routes
  const routeTitles = {
    '/admin/dashboard': 'dashboard',
    '/admin/users-manage': 'users',
    '/admin/buildings': 'buildings',
    '/admin/units': 'units',
    // Add other routes with translation keys
    default: 'admin_panel',
  };

  const mobileRouteTitles = {
    '/admin/users-manage': 'users',
    '/admin/buildings': 'buildings',
    '/admin/units': 'units',
    // Add other routes with translation keys
    default: 'admin',
  };

  const modalTitles = {
    'tenancy-create': 'create_tenancy',
    'create-unit-type-master': 'create_unit_type_master',
    // Add other modal types with translation keys
  };

  // Fetch profile data (unchanged)
  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const role = localStorage.getItem('role')?.toLowerCase();
      if (role === 'company') {
        const companyId = getUserCompanyId();
        if (companyId) {
          const response = await axios.get(
            `${BASE_URL}/accounts/company/${companyId}/detail/`
          );
          setProfileData({
            name: response.data.company_name || 'Admin',
            email: response.data.email_address || 'example@gmail.com',
            profileImage: response.data.company_logo || profile,
          });
        }
      } else if (role === 'user') {
        const userId = getRelevantUserId();
        if (userId) {
          const response = await axios.get(
            `${BASE_URL}/company/user/${userId}/details/`
          );
          setProfileData({
            name: response.data.name || 'User',
            email: response.data.email || 'example@gmail.com',
            profileImage: response.data.company_logo || profile,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const getUserCompanyId = () => {
    const role = localStorage.getItem('role')?.toLowerCase();
    if (role === 'company') {
      return localStorage.getItem('company_id');
    } else if (role === 'user') {
      try {
        const userCompanyId = localStorage.getItem('company_id');
        return userCompanyId ? JSON.parse(userCompanyId) : null;
      } catch (e) {
        console.error('Error parsing user company ID:', e);
        return null;
      }
    }
    return null;
  };

  const getRelevantUserId = () => {
    const role = localStorage.getItem('role')?.toLowerCase();
    if (role === 'user') {
      const userId = localStorage.getItem('user_id');
      if (userId) return userId;
    }
    return null;
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const isDashboard = currentPath === '/admin/dashboard';

  const getPageTitle = (isMobile = false) => {
    if (modalState.isOpen && modalState.title) {
      return t(modalTitles[modalState.type] || 'admin');
    }
    const titles = isMobile ? mobileRouteTitles : routeTitles;
    const key = titles[currentPath] || titles.default;
    return t(key);
  };

  useEffect(() => {
    if (currentPath) {
      localStorage.setItem('currentAdminPath', currentPath);
    }
  }, [currentPath]);

  useEffect(() => {
    const savedPath = localStorage.getItem('currentAdminPath');
    if (savedPath && !currentPath) {
      setCurrentPath(savedPath);
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    const langCode = languageMap[language];
    i18n.changeLanguage(langCode); // Change language
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
    navigate('/admin/dashboard');
  };

  const handleImageError = (e) => {
    e.target.src = profile;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={`flex items-center justify-between mx-5 h-[86px] border-b border-[#E9E9E9] bg-white admin-navbar ${
          isDashboard ? 'dashboard-nav' : 'non-dashboard-nav'
        } ${modalState.isOpen ? 'modal-open' : ''}`}
      >
        <div className="flex items-center w-full">
          <div className="left-section">
            {isDashboard && !modalState.isOpen ? (
              <img
                src={logo}
                alt={t('logo_alt')}
                className="RentBiz-Logo"
                onClick={handleLogoClick}
                aria-label={t('navigate_dashboard')}
              />
            ) : (
              <img
                src={backarrow}
                alt={t('back_arrow_alt')}
                className="back-arrow"
                onClick={handleBackClick}
                aria-label={modalState.isOpen ? t('close_modal') : t('go_back')}
              />
            )}
          </div>

          {(modalState.isOpen || !isDashboard) && (
            <h1 className="mobile-page-title" aria-live="polite">
              {getPageTitle(true)}
            </h1>
          )}

          <h1 className="navbar-head">{getPageTitle(false)}</h1>
        </div>

        <button className="mobile-menu" onClick={toggleMobileMenu}>
          <img src={mobilemenu} alt={t('menu_icon_alt')} className="w-[20px] h-[20px]" />
        </button>

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
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`absolute mt-1 w-[120px] bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? 'opacity-100 max-h-40 transform translate-y-0'
                  : 'opacity-0 max-h-0 transform -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-1">
                {Object.keys(languageMap).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    className="block w-full text-left px-4 py-2 options-text hover:bg-gray-100"
                  >
                    {lang}
                  </button>
                ))}
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
                  alt={t('user_profile_alt')}
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
                    {t('profile.greeting', { name: profileData.name })}
                  </span>
                  <span className="admin-email whitespace-nowrap">
                    {t('profile.email', { email: profileData.email })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <MobileSlideMenu
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </>
  );
};

export default AdminNavbar;