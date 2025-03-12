// import React from "react";

import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FaEnvelope, FaFacebook, FaGoogle, FaLock } from "react-icons/fa";
import { APP_INFO } from "../constants/common.constants";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <Header />
      <div className="flex justify-around items-center bg-[#67B0F4] min-h-[calc(90vh-80px)]">
        {/* Logo */}
        <div>
          <img src={APP_INFO.LOGO} alt="logo" />
        </div>

        {/* Form */}
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-3xl font-bold mb-5">Đăng nhập</div>
          <form className="space-y-4">
            {/* Email */}
            <Input
              type="text"
              name="email-phone"
              placeholder="Email/Số điện thoại"
              icon={FaEnvelope}
              required
            />
            {/* Password */}
            <Input type="password" name="password" icon={FaLock} required />
            {/* Remember & Forgot */}
            <div className="flex items-center justify-end">
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

            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="mx-4 text-gray-500">HOẶC</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" fullWidth icon={FaFacebook}>
                Facebook
              </Button>
              <Button variant="outline" fullWidth icon={FaGoogle}>
                Google
              </Button>
            </div>

            <div>
              <p className="text-gray-500 text-center">
                Bạn mới biết đến DreamyMart?{" "}
                <Link to="/register" className="text-[#0078E8] hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
