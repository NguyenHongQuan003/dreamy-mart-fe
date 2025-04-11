import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import Header from "../components/layout/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/app.constants";
import Footer from "../components/layout/Footer";
import OTPInput from "../components/common/OTPInput";
import { toast } from "react-toastify";
import {
  generateOTP,
  verifyOTP,
  forgotPassword,
} from "../services/userService";
import { useNavigate } from "react-router-dom";
import {
  validateConfirmPassword,
  validateOTP,
  validatePassword,
} from "../utils/validate";
import Loading from "../components/common/Loading";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "otp":
        setErrors((prev) => ({ ...prev, otp: validateOTP(value) }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          confirm_password: validateConfirmPassword(value, formData.password),
        }));
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        break;
      case "confirm_password":
        setErrors((prev) => ({
          ...prev,
          confirm_password: validateConfirmPassword(value, formData.password),
        }));
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await generateOTP(formData.email);
      if (result) {
        toast.success("Mã OTP đã được gửi đến email của bạn");
        setFormData((prev) => ({ ...prev, otp: "" }));
      }
      setStep(2);
    } catch (error) {
      console.error("Lỗi gửi OTP:", error);
      toast.error("Gửi mã OTP không thành công");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form className="space-y-4" onSubmit={handleStep1Submit}>
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

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loading size="sm" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          "Tiếp tục"
        )}
      </Button>

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

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const result = await verifyOTP(formData.email, formData.otp);
      console.log("Kết quả xác minh OTP:", result);
      if (result) {
        console.log("Xác minh OTP thành công");
        toast.success("Xác minh OTP thành công");
        setStep(3);
        setFormData((prev) => ({ ...prev, otp: "" }));
      } else {
        console.log("OTP không hợp lệ");
        toast.error("OTP không hợp lệ hoặc hết hạn");
      }
    } catch (error) {
      console.error("Lỗi xác minh OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    console.log("formData OTP", formData);
    const otpError = validateOTP(formData.otp);
    if (!otpError) {
      await handleVerifyOTP();
    } else {
      setErrors((prev) => ({ ...prev, otp: otpError }));
    }
  };

  const renderStep2 = () => (
    <form className="mt-8 space-y-6" onSubmit={handleStep2Submit}>
      <label className="block text-center font-medium text-gray-700 mb-2">
        Nhập mã OTP đã gửi đến email của bạn
      </label>

      <OTPInput
        length={6}
        onChangeOTP={(otp) => {
          setFormData({ ...formData, otp });
          handleChange({ target: { name: "otp", value: otp } });
        }}
        error={errors.otp}
      />
      <Button
        type="submit"
        fullWidth
        disabled={
          (errors.otp !== "" || formData.otp === "" ? true : false) || isLoading
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loading size="sm" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          "Xác nhận"
        )}
      </Button>
    </form>
  );
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirm_password,
      formData.password
    );

    if (!passwordError && !confirmPasswordError) {
      console.log("Registration completed:", formData);
      try {
        const response = await forgotPassword(
          formData.email,
          formData.password
        );
        console.log("response forgotPassword", response);
        if (response) {
          toast.success("Đổi mật khẩu thành công!");
          navigate("/login");
        } else {
          toast.error("Đổi mật khẩu thất bại!");
        }
      } catch (error) {
        console.log("Error when register:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors({
        password: passwordError,
        confirm_password: confirmPasswordError,
      });
      setIsLoading(false);
    }
  };
  const renderStep3 = () => (
    <form className="space-y-4" onSubmit={handleFinalSubmit}>
      {/* Mật khẩu */}
      <Input
        type="password"
        name="password"
        placeholder="Mật khẩu mới"
        icon={FaLock}
        required
        autoComplete="new-password"
        onChange={handleChange}
        value={formData.password}
        error={errors.password}
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
        error={errors.confirm_password}
      />
      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loading size="sm" />
            <span>Đang xử lý...</span>
          </div>
        ) : (
          "Xác nhận"
        )}
      </Button>
    </form>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row justify-around items-center bg-[#67B0F4] min-h-[calc(90vh-80px)] px-4 py-8">
        <div className="hidden lg:block lg:w-1/3">
          <img src={APP_INFO.LOGO} alt="logo" className="max-w-full h-auto" />
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex mb-5 justify-between items-center">
            <div className="text-2xl sm:text-3xl font-bold text-center lg:text-left">
              Quên mật khẩu
            </div>
            <div className="flex items-center">
              {step > 1 && (
                <Button
                  type="button"
                  size="small"
                  variant="outline"
                  icon={FaArrowLeft}
                  onClick={handleBack}
                />
              )}
              <p className="ml-4 text-sm text-gray-600">Bước {step} / 3</p>
            </div>
          </div>
          {renderStep()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
