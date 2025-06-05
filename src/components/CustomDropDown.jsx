import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropDown = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  className = "",
  dropdownClassName = "",
  enableFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  // Click-outside handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (enableFilter) {
          setFilterText("");
          setFilteredOptions(options);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [enableFilter, options]);

  // Filter handling (if enabled)
  useEffect(() => {
    if (enableFilter && filterText) {
      setFilteredOptions(
        options.filter((opt) =>
          opt.label.toLowerCase().startsWith(filterText.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [filterText, options, enableFilter]);

  // Keyboard input for filtering
  useEffect(() => {
    if (!enableFilter) return;

    const handleKeyDown = (event) => {
      if (isOpen && event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
        setFilterText((prev) => prev + event.key);
      } else if (isOpen && event.key === "Backspace") {
        event.preventDefault();
        setFilterText((prev) => prev.slice(0, -1));
      } else if (isOpen && event.key === "Escape") {
        setIsOpen(false);
        setFilterText("");
        setFilteredOptions(options);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, options, enableFilter]);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      if (!prev && enableFilter) {
        setFilterText("");
        setFilteredOptions(options);
      }
      return !prev;
    });
  };

  const selectOption = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
    if (enableFilter) {
      setFilterText("");
      setFilteredOptions(options);
    }
  };

  const displayText = enableFilter && filterText ? filterText : 
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md w-full cursor-pointer duration-200 bg-transparent ${dropdownClassName}`}
      >
        <span className={`${value || filterText ? "text-[#201D1E]" : "text-[#201D1E]"}`}>
          {displayText}
        </span>
        <ChevronDown
          className={`ml-2 w-[20px] h-[20px] transition-transform duration-300 ease-in-out text-[#201D1E] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          isOpen
            ? "opacity-100 max-h-40 transform translate-y-0"
            : "opacity-0 max-h-0 transform -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1 max-h-40 overflow-y-auto">
          {filteredOptions.length === 0 && enableFilter ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => selectOption(option.value)}
                className="block w-full text-left px-4 py-2 text-sm text-[#201D1E] hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDropDown;