// import React from "react";

import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FaEnvelope, FaFacebook, FaGoogle, FaLock } from "react-icons/fa";
import { APP_INFO } from "../constants/common.constants";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/layout/Footer";

const Login = () => {
  const [formData, setFormData] = useState({
    email_phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row justify-around items-center bg-[#67B0F4] min-h-[calc(90vh-80px)] px-4 py-8">
        {/* Logo - Ẩn trên mobile, hiện trên desktop */}
        <div className="hidden lg:block lg:w-1/3">
          <img src={APP_INFO.LOGO} alt="logo" className="max-w-full h-auto" />
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-2xl sm:text-3xl font-bold mb-5 text-center lg:text-left">
            Đăng nhập
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <Input
              type="text"
              name="email_phone"
              placeholder="Email/Số điện thoại"
              icon={FaEnvelope}
              required
              autoComplete="email"
              onChange={handleChange}
              value={formData.email_phone}
            />
            {/* Password */}
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              icon={FaLock}
              required
              onChange={handleChange}
              value={formData.password}
            />
            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div></div>
              {/* <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#0078E8] focus:ring-[#0078E8]"
                />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
              </label> */}
              <Link
                to="/forgot-password"
                className="text-sm text-[#0078E8] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Button type="submit" fullWidth>
              Đăng nhập
            </Button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="mx-4 text-sm text-gray-500">HOẶC</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="facebook" fullWidth icon={FaFacebook}>
                Facebook
              </Button>
              <Button variant="google" fullWidth icon={FaGoogle}>
                Google
              </Button>
            </div>

            <div className="mt-6">
              <p className="text-gray-500 text-center text-sm sm:text-base">
                Bạn mới biết đến DreamyMart?{" "}
                <Link
                  to="/register"
                  className="text-[#0078E8] hover:underline font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
