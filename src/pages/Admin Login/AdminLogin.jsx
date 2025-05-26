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

  if (!username || !password) {
    toast.error("Username and Password are required");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(`${BASE_URL}/company/company-login/`, {
      username,
      password,
    });

    console.log("Login Success:", response.data);

    if (response.status === 200) {
      const {
        access,
        refresh,
        id,
        email,
        company_id,
        username,
        name,
        role: displayRole, // This is user_role like "Admin"
        ...userData
      } = response.data;

      // Decode JWT to extract normalized role (either "user" or "company")
      const decodedAccess = JSON.parse(atob(access.split('.')[1]));
      const normalizedRole = decodedAccess.role;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("role", normalizedRole); // store normalized role
      localStorage.setItem("user_display_role", displayRole); // optionally keep display role (e.g., Admin)

      if (normalizedRole === "company") {
        localStorage.setItem("company_id", company_id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);

        Object.keys(userData).forEach((key) => {
          localStorage.setItem(`company_${key}`, JSON.stringify(userData[key]));
        });

        localStorage.removeItem("user_id");

        console.log("Navigating to /admin/dashboard");
        setTimeout(() => navigate("/admin/dashboard"), 100);
      } else if (normalizedRole === "user") {
        localStorage.setItem("user_id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);
        localStorage.setItem("company_id", company_id);

        Object.keys(userData).forEach((key) => {
          localStorage.setItem(`user_${key}`, JSON.stringify(userData[key]));
        });

        localStorage.removeItem("company_id");

        console.log("Navigating to /admin/dashboard");
        setTimeout(() => navigate("/admin/dashboard"), 100);
      } else {
        toast.error("Unknown role detected.");
        console.warn("Unhandled role from token:", normalizedRole);
      }
    }
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    toast.error("Login failed. Please check your credentials.");
  } finally {
    setLoading(false);
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
