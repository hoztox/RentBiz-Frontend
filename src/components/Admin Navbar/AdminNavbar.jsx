import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import profile from "../../assets/Images/Admin Navbar/profile.svg";
import "./adminnavbar.css";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
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
    <nav className="flex items-center justify-between mx-5 h-[86px] border-b border-[#E9E9E9] bg-white">
      
      <div>
        <h1 className="navbar-head">Dashboard Overview</h1>
      </div>

      
      <div className="flex items-center">
        
        <div className="relative mr-5" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-between px-3 py-[7px] border border-[#E9E9E9] rounded-md bg-[#FBFBFB] w-[120px] h-[36px] select-box"
          >
            {selectedLanguage}
            <ChevronDown
              size={20}
              className={`ml-2 transform transition-transform duration-300 ease-in-out text-[#201D1E] ${isOpen ? 'rotate-180' : ''}`}
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
              <button 
                onClick={() => selectLanguage('English')}
                className="block w-full text-left px-4 py-2 options-text hover:bg-gray-100"
              >
                English
              </button>
              <button 
                onClick={() => selectLanguage('Arabic')}
                className="block w-full text-left px-4 py-2 options-text hover:bg-gray-100"
              >
                Arabic
              </button>
              <button 
                onClick={() => selectLanguage('Spanish')}
                className="block w-full text-left px-4 py-2 options-text hover:bg-gray-100"
              >
                Spanish
              </button>
            </div>
          </div>
        </div>
  
        <div className="flex items-center  profile-section">
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
  );
};

export default AdminNavbar;