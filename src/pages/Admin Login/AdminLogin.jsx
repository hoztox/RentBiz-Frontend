import "./AdminLogin.css";
import { useState, useEffect } from "react";
import logo from "../../assets/Images/Admin Login/RentBizLogo.svg";
import slide1 from "../../assets/Images/Admin Login/Slide1.svg";
import slide2 from "../../assets/Images/Admin Login/slide2.jpg";
import slide3 from "../../assets/Images/Admin Login/Slide1.svg";
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
    navigate('/admin/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="login-container flex items-center">
        {/* Left side with white padding and image inside */}
        <div className="image-section">
          <div className="login-image-wrapper relative">
            <img
              src={slides[current]}
              alt="Slide"
              className="login-slide-image"
            />

            {/* Bottom gradient overlay */}
            <div className="gradient-overlay absolute bottom-0 left-0 w-full h-[19rem] z-10" />

            {/* Overlay for text and slider */}
            <div
              className="absolute bottom-6 left-6 right-6 text-white z-10"
              style={{
                width: "436px",
                height: "72px",
                top: "715.31px",
                left: "50.51px",
              }}
            >
              {/* Heading */}
              <div>
                <h2 className="heading-on-image">
                  Manage Properties Efficiently
                </h2>
              </div>

              {/* Paragraph */}
              <div className="paragraph-container flex justify-between items-center">
                <p className="login-slide-description">
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type
                  and scrambled it to make a type specimen book.
                </p>
                <div
                  className="absolute right-5 flex gap-1"
                  style={{
                    width: "66px",
                    height: "3px",
                    top: "50px",
                    left: "519px",
                  }}
                >
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

        {/* Right side - login form */}
        <div className="flex flex-col justify-center items-center px-10 pt-[187px] pb-[187px] flex-1">
          <img
            src={logo}
            alt="RentBiz Logo"
            className="h-[78px] mb-[62px]"
            style={{
              width: "128.19px",
              height: "78.09px",
              left: "158.41px",
            }}
          />
          <h2
            className="right-section-heading mb-8 text-[#201D1E]"
            style={{
              width: "414px",
              height: "44px",
              fontFamily: "Inter Tight",
              fontWeight: "500",
              fontSize: "36px",
              lineHeight: "100%",
              letterSpacing: "0px",
            }}
          >
            Welcome Back to RentBiz!
          </h2>
          <form className="w-full space-y-5">
            <div>
              <label className="w-[103px] h-[19px]  text-[#606060] input-label">
                Email address*
              </label>
              <input
                type="email"
                placeholder="tetst@gmail.com"
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
              />
            </div>
            <div>
              <label className="w-[103px] h-[19px] text-[#606060] input-label">
                Password*
              </label>
              <div className="relative mt-[6px]">
                <input
                  type="password"
                  placeholder="tetst@gmail.com"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
                />
                <span className="absolute inset-y-0 right-[65px] top-[17px] flex items-center text-gray-400 cursor-pointer">
                  <img src={viewIcon} alt="" className="w-5 h-5" />
                </span>
              </div>
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              className="w-full bg-[#1458A2] hover:bg-[#104880] text-white py-2 mt-[32px] rounded-full login-btn"
              style={{
                width: "445px",
                height: "52px",
                borderRadius: "76px",
                marginTop: "32px",
              }}
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
