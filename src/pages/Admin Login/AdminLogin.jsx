import './AdminLogin.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import logo from '../../assets/Images/Admin Login/RentBizLogo.svg';
import slide1 from '../../assets/Images/Admin Login/Slide1.jpg';
import slide2 from '../../assets/Images/Admin Login/slide2.jpg';
import slide3 from '../../assets/Images/Admin Login/Slide1.jpg';
import inActiveSliderIcon from '../../assets/Images/Admin Login/inActiveSliderIcon.svg';
import activeSliderIcon from '../../assets/Images/Admin Login/activeSliderIcon.svg';

const slides = [slide1, slide2, slide3];

const AdminLogin = () => {
  const [current, setCurrent] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();

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
    console.log('=== FRONTEND LOGIN DEBUG ===');
    console.log('Username:', username);
    console.log('Password:', password ? '***provided***' : 'empty');
    
    if (!username || !password) {
      toast.error('Username and Password are required');
      return;
    }
    
    try {
      setLoading(true);
      const loginData = {
        username: username.trim(),
        password,
      };
      
      console.log('Sending login request with data:', {
        username: loginData.username,
        password: '***hidden***',
      });
      
      const response = await axios.post(`${BASE_URL}/company/company-login/`, loginData);
      console.log('Login Response Status:', response.status);
      console.log('Login Response Data:', response.data);
      
      if (response.status === 200) {
        login(response.data); // Use AuthContext login
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error message:', error.message);
      
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';
      
      console.error('Showing error message:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== LOGIN PROCESS COMPLETE ===');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Toaster position="top-center" />
      <div className="login-container flex flex-col md:flex-row items-center">
        <div className="image-section w-full md:w-1/2">
          <div className="login-image-wrapper relative md:left-[20px]">
            <img src={slides[current]} alt="Slide" className="login-slide-image" />
            <div className="gradient-overlay absolute bottom-0 left-0 w-full h-[16rem] md:h-[19rem] z-10" />
            <div className="absolute bottom-8 left-0 right-0 text-white z-10 w-full px-4 md:px-6">
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full">
                <div className="text-center md:text-left md:mb-[25px] md:ml-[25px]">
                  <h2 className="heading-on-image mb-2 md:mb-4">
                    Manage Properties Efficiently
                  </h2>
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
                <div className="flex gap-1 mt-4 md:mt-0 md:mb-[32px]">
                  {slides.map((_, index) => (
                    <img
                      key={index}
                      src={current === index ? activeSliderIcon : inActiveSliderIcon}
                      alt={`Slider ${index + 1}`}
                      onClick={() => setCurrent(index)}
                      className="cursor-pointer"
                      style={{ width: '22px', height: '3px' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center px-6 md:px-10 pt-8 pb-8 md:pt-[187px] md:pb-[187px] w-full md:w-1/2">
          <img
            src={logo}
            alt="RentBiz Logo Login"
            className="h-[60px] md:h-[78px] mb-6 md:mb-[62px]"
          />
          <h2 className="right-section-heading mb-8 text-[#201D1E] text-4xl hidden md:block">
            Welcome Back to RentBiz!
          </h2>
          <form className="w-full space-y-4 md:space-y-7 max-w-[445px]" onSubmit={handleSubmit}>
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
                  type={passwordVisible ? 'text' : 'password'}
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
                  {passwordVisible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1458A2] hover:bg-[#104880] duration-200 text-white py-2 rounded-full login-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;