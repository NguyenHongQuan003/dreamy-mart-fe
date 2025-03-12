import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebook,
  FaGoogle,
  FaLock,
  FaPhone,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/common.constants";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contact: "", // email hoặc số điện thoại
    fullname: "",
    password: "",
    confirm_password: "",
  });
  const [contactType, setContactType] = useState("phone"); // "phone" hoặc "email"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactTypeChange = (type) => {
    setContactType(type);
    setFormData((prev) => ({ ...prev, contact: "" }));
  };

  const validateContact = () => {
    if (!formData.contact) {
      alert("Vui lòng nhập thông tin liên hệ!");
      return false;
    }

    if (contactType === "phone") {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.contact)) {
        alert("Số điện thoại không hợp lệ!");
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contact)) {
        alert("Email không hợp lệ!");
        return false;
      }
    }

    return true;
  };

  const handleVerifyContact = (e) => {
    e.preventDefault();
    if (validateContact()) {
      // TODO: Gọi API để xác minh email/số điện thoại
      console.log("Verifying contact:", formData.contact);
      // Giả lập API call thành công
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <div className="flex gap-3 mb-6">
        <Button
          type="button"
          variant={contactType === "phone" ? "primary" : "outline"}
          onClick={() => handleContactTypeChange("phone")}
        >
          Số điện thoại
        </Button>
        <Button
          type="button"
          variant={contactType === "email" ? "primary" : "outline"}
          onClick={() => handleContactTypeChange("email")}
        >
          Email
        </Button>
      </div>

      <Input
        type={contactType === "phone" ? "tel" : "email"}
        name="contact"
        placeholder={
          contactType === "phone" ? "Nhập số điện thoại" : "Nhập email"
        }
        icon={contactType === "phone" ? FaPhone : FaEnvelope}
        required
        autoComplete={contactType === "phone" ? "tel" : "email"}
        onChange={handleChange}
        value={formData.contact}
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
        <Button variant="outline" fullWidth icon={FaFacebook}>
          Facebook
        </Button>
        <Button variant="outline" fullWidth icon={FaGoogle}>
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
          {contactType === "phone" ? "Số điện thoại: " : "Email: "}
          <strong>{formData.contact}</strong>
        </span>
      </div>

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
    </>
  );
};

export default Register;
