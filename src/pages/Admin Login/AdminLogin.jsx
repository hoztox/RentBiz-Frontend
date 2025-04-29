import "./AdminLogin.css";
import { useState, useEffect } from "react";
import logo from "../../assets/Images/Admin Login/RentBizLogo.svg";
import slide1 from "../../assets/Images/Admin Login/Slide1.jpg";
import slide2 from "../../assets/Images/Admin Login/slide2.jpg";
import slide3 from "../../assets/Images/Admin Login/Slide1.jpg";
import viewIcon from "../../assets/Images/Admin Login/ViewIcon.svg";
import inActiveSliderIcon from "../../assets/Images/Admin Login/inActiveSliderIcon.svg";
import activeSliderIcon from "../../assets/Images/Admin Login/activeSliderIcon.svg";
import { useNavigate } from "react-router-dom";

const slides = [slide1, slide2, slide3];

const AdminLogin = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
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
            alt="RentBiz Logo"
            className="h-[60px] md:h-[78px] mb-6 md:mb-[62px]"
          />
          <h2 className="right-section-heading mb-8 text-[#201D1E] text-4xl hidden md:block">
            Welcome Back to RentBiz!
          </h2>
          <form className="w-full space-y-4 md:space-y-9 max-w-[445px]">
            <div>
              <label className="text-[#606060] input-label">
                Email address*
              </label>
              <input
                type="email"
                placeholder="tetst@gmail.com"
                className="focus:outline-none focus:ring-2 focus:ring-gray-700 input-field w-full mt-2"
              />
            </div>
            <div>
              <label className="text-[#606060] input-label">Password*</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="tetst@gmail.com"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-700 input-field w-full mt-2"
                />
                <span className="absolute inset-y-0 right-5 top-[11px] md:top-[13px] flex items-center text-gray-400 cursor-pointer">
                  <img src={viewIcon} alt="" className="w-5 h-5" />
                </span>
              </div>
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              className="w-full bg-[#1458A2] hover:bg-[#104880] duration-200 text-white py-2 rounded-full login-btn"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
