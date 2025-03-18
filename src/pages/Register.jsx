import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebook,
  FaGoogle,
  FaLock,
  FaUser,
  FaArrowLeft,
  FaPhone,
} from "react-icons/fa";
import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/common.constants";
import Footer from "../components/layout/Footer";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    gender: "",
    fullname: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = () => {
    if (!formData.email) {
      alert("Vui lòng nhập email!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ!");
      return false;
    }

    return true;
  };

  const validatePhone = () => {
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ!");
      return false;
    }
    return true;
  };

  const handleVerifyContact = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      // TODO: Gọi API để xác minh email
      console.log("Verifying email:", formData.email);
      // Giả lập API call thành công
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone()) {
      return;
    }
    if (formData.password !== formData.confirm_password) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Form submitted:", formData);
  };

  const handleBack = () => {
    setStep(1);
  };

  const renderStep1 = () => (
    <form className="space-y-4" onSubmit={handleVerifyContact}>
      <Input
        type="email"
        name="email"
        placeholder="Nhập email"
        icon={FaEnvelope}
        required
        autoComplete="email"
        onChange={handleChange}
        value={formData.email}
      />

      <Button type="submit" fullWidth>
        Tiếp tục
      </Button>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="mx-4 text-sm text-gray-500">HOẶC</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social Register */}
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
          Bạn đã có tài khoản DreamyMart?{" "}
          <Link
            to="/login"
            className="text-[#0078E8] hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center mb-4">
        <Button
          type="button"
          variant="outline"
          icon={FaArrowLeft}
          className="mr-4"
          onClick={handleBack}
        />
        <span className="text-gray-600">
          Email: <strong>{formData.email}</strong>
        </span>
      </div>

      {/* Giới tính */}
      {/* <fieldset> */}
      <legend className="text-gray-600">Giới tính</legend>

      <div className="flex flex-row gap-x-3">
        <div className="flex items-center gap-x-3">
          <input
            defaultChecked
            id="gender-male"
            name="gender"
            type="radio"
            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
            onChange={handleChange}
            value="male"
          />
          <label
            htmlFor="gender-male"
            className="block font-medium text-gray-600"
          >
            Nam
          </label>
        </div>
        <div className="flex items-center gap-x-3">
          <input
            id="gender-female"
            name="gender"
            type="radio"
            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
            onChange={handleChange}
            value="female"
          />
          <label
            htmlFor="gender-female"
            className="block font-medium text-gray-600"
          >
            Nữ
          </label>
        </div>
      </div>
      {/* </fieldset> */}

      {/* Họ tên */}
      <Input
        type="text"
        name="fullname"
        placeholder="Họ và tên"
        icon={FaUser}
        required
        autoComplete="name"
        onChange={handleChange}
        value={formData.fullname}
      />

      {/* Số điện thoại */}
      <Input
        type="tel"
        name="phone"
        placeholder="Số điện thoại"
        icon={FaPhone}
        required
        autoComplete="tel"
        onChange={handleChange}
        value={formData.phone}
      />

      {/* Mật khẩu */}
      <Input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        icon={FaLock}
        required
        autoComplete="new-password"
        onChange={handleChange}
        value={formData.password}
      />

      {/* Xác nhận mật khẩu */}
      <Input
        type="password"
        name="confirm_password"
        placeholder="Xác nhận mật khẩu"
        icon={FaLock}
        required
        autoComplete="new-password"
        onChange={handleChange}
        value={formData.confirm_password}
      />

      <div className="text-sm text-gray-600">
        Bằng việc đăng ký, bạn đã đồng ý với DreamyMart về{" "}
        <Link to="/terms" className="text-[#0078E8] hover:underline">
          Điều khoản dịch vụ
        </Link>{" "}
        &{" "}
        <Link to="/privacy" className="text-[#0078E8] hover:underline">
          Chính sách bảo mật
        </Link>
      </div>

      <Button type="submit" fullWidth>
        Đăng ký
      </Button>
    </form>
  );

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
            Đăng ký
          </div>
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
