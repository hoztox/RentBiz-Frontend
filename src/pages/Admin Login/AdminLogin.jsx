import "./AdminLogin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { IoEye, IoEyeOff } from "react-icons/io5";

import logo from "../../assets/Images/Admin Login/RentBizLogo.svg";
import slide1 from "../../assets/Images/Admin Login/Slide1.jpg";
import slide2 from "../../assets/Images/Admin Login/slide2.jpg";
import slide3 from "../../assets/Images/Admin Login/Slide1.jpg";
// import viewIcon from "../../assets/Images/Admin Login/ViewIcon.svg";
import inActiveSliderIcon from "../../assets/Images/Admin Login/inActiveSliderIcon.svg";
import activeSliderIcon from "../../assets/Images/Admin Login/activeSliderIcon.svg";

// Import the error modal component (you'll need to create this or import from the first component)
// import CompanyLoginErrorModal from "./Modal/CompanyLoginErrorModal";

const slides = [slide1, slide2, slide3];

const AdminLogin = () => {
  const [current, setCurrent] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== FRONTEND LOGIN DEBUG ===");
    console.log("Username:", username);
    console.log("Password:", password ? "***provided***" : "empty");
    if (!username || !password) {
      toast.error("Username and Password are required");
      return;
    }
    try {
      setLoading(true);
      const loginData = {
        username: username.trim(), // Remove any whitespace
        password: password,
      };
      console.log("Sending login request with data:", {
        username: loginData.username,
        password: "***hidden***"
      });
      const response = await axios.post(`${BASE_URL}/company/company-login/`, loginData);
      console.log("Login Response Status:", response.status);
      console.log("Login Response Data:", response.data);
      if (response.status === 200) {
        const {
          access,
          refresh,
          role,
          id,
          company_id,
          ...restData
        } = response.data;
        console.log("Extracted data:");
        console.log("- Access Token:", access ? "present" : "missing");
        console.log("- Refresh Token:", refresh ? "present" : "missing");
        console.log("- Role:", role);
        console.log("- ID:", id);
        console.log("- Company ID:", company_id);
        console.log("- Rest Data:", restData);
        // Store tokens
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("role", role);
        const normalizedRole = role.toLowerCase();
        console.log("Normalized Role:", normalizedRole);
        if (normalizedRole === "company") {
          console.log("Processing company login...");
          // For company login, use the company's ID (not user_id)
          localStorage.setItem("company_id", id);
          // Store all company data with company_ prefix
          Object.entries(restData).forEach(([key, value]) => {
            const storageKey = `company_${key}`;
            const storageValue = JSON.stringify(value);
            localStorage.setItem(storageKey, storageValue);
            console.log(`Stored ${storageKey}:`, storageValue);
          });
          // Clean up user-specific data
          localStorage.removeItem("user_id");
          console.log("Company login successful, navigating to dashboard");
          toast.success("Company login successful!");
          navigate("/admin/dashboard");
        } else if (normalizedRole === "user") {
          console.log("Processing user login...");
          localStorage.setItem("user_id", id);
          if (company_id) {
            localStorage.setItem("company_id", company_id);
          }
          // Store all user data with user_ prefix
          Object.entries(restData).forEach(([key, value]) => {
            const storageKey = `user_${key}`;
            const storageValue = JSON.stringify(value);
            localStorage.setItem(storageKey, storageValue);
            console.log(`Stored ${storageKey}:`, storageValue);
          });
          // Clean up company-specific data
          localStorage.removeItem("company_name");
          console.log("User login successful, navigating to dashboard");
          toast.success("User login successful!");
          navigate("/admin/dashboard");
        } else {
          console.error("Unknown role received:", role);
          toast.error("Unknown role, login failed");
        }
      }
    } catch (error) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error message:", error.message);
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          "Login failed. Please check your credentials.";
      console.error("Showing error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log("=== LOGIN PROCESS COMPLETE ===");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Toaster position="top-center" />

      <div className="login-container flex flex-col md:flex-row items-center">
        {/* Image section - full width on mobile, left side on desktop */}
        <div className="image-section w-full md:w-1/2">
          <div className="login-image-wrapper relative md:left-[20px]">
            <img
              src={slides[current]}
              alt="Slide"
              className="login-slide-image"
            />

            {/* Bottom gradient overlay */}
            <div className="gradient-overlay absolute bottom-0 left-0 w-full h-[16rem] md:h-[19rem] z-10" />

            {/* Overlay for text and slider */}
            <div className="absolute bottom-8 left-0 right-0 text-white z-10 w-full px-4 md:px-6">
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full">
                {/* Left Side: Heading + Paragraph */}
                <div className="text-center md:text-left md:mb-[25px] md:ml-[25px]">
                  <h2 className="heading-on-image mb-2 md:mb-4">
                    Manage Properties Efficiently
                  </h2>

                  {/* Short Paragraph for Mobile */}
                  <p className="login-slide-description text-sm md:hidden w-[271.5px]">
                    Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s
                  </p>

                  <p className="login-slide-description text-sm hidden md:block">
                    Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book.
                  </p>
                </div>

                {/* Right Side: Slider dots */}
                <div className="flex gap-1 mt-4 md:mt-0 md:mb-[32px]">
                  {slides.map((_, index) => (
                    <img
                      key={index}
                      src={
                        current === index
                          ? activeSliderIcon
                          : inActiveSliderIcon
                      }
                      alt={`Slider ${index + 1}`}
                      onClick={() => setCurrent(index)}
                      className="cursor-pointer"
                      style={{
                        width: "22px",
                        height: "3px",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login form section - full width on mobile, right side on desktop */}
        <div className="flex flex-col justify-center items-center px-6 md:px-10 pt-8 pb-8 md:pt-[187px] md:pb-[187px] w-full md:w-1/2">
          <img
            src={logo}
            alt="RentBiz Logo Login"
            className="h-[60px] md:h-[78px] mb-6 md:mb-[62px]"
          />
          <h2 className="right-section-heading mb-8 text-[#201D1E] text-4xl hidden md:block">
            Welcome Back to RentBiz!
          </h2>

          <form
            className="w-full space-y-4 md:space-y-7 max-w-[445px]"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="text-[#606060] input-label">Username*</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus:outline-none focus:ring-2 focus:ring-gray-700 input-field w-full mt-2"
                required
              />
            </div>

            <div>
              <label className="text-[#606060] input-label">Password*</label>
              <div className="relative mb-4 md:mb-1">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:outline-none focus:ring-2 focus:ring-gray-700 input-field w-full mt-2"
                  required
                />
                <span
                  className="absolute inset-y-0 right-5 top-[11px] md:top-[13px] flex items-center text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <IoEyeOff size={20} />
                  ) : (
                    <IoEye size={20} />
                  )}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1458A2] hover:bg-[#104880] duration-200 text-white py-2 rounded-full login-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
