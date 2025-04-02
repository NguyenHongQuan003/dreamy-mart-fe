import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotalAmount,
  clearCart,
} from "../redux/slices/cartSlice";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
  FaMoneyBill,
  FaUniversity,
  FaCheck,
  FaShoppingBag,
  FaCheckCircle,
} from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalAmount);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
  });

  useEffect(() => {
    console.log("Shipping Info", shippingInfo);
  }, [shippingInfo]);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Validate form fields
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Nếu giỏ hàng trống, chuyển hướng về trang giỏ hàng
    if (cartItems.length === 0 && currentStep === 1) {
      navigate("/cart");
    }

    // Khi trang tải, lấy thông tin người dùng từ localStorage (nếu có)
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: userInfo.fullname || prev.fullName,
        email: userInfo.email || prev.email,
        phone: userInfo.phone || prev.phone,
      }));
    }
  }, [cartItems.length, navigate, currentStep]);

  const validateStep1 = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ tên";
    if (!shippingInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(shippingInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!shippingInfo.address.trim())
      newErrors.address = "Vui lòng nhập địa chỉ";
    if (!shippingInfo.city.trim())
      newErrors.city = "Vui lòng chọn tỉnh/thành phố";
    if (!shippingInfo.district.trim())
      newErrors.district = "Vui lòng chọn quận/huyện";
    if (!shippingInfo.ward.trim()) newErrors.ward = "Vui lòng chọn phường/xã";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
      processOrder();
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/cart");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật trực tiếp giá trị mà không dùng callback phức tạp
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });

    // Xóa lỗi nếu có
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const processOrder = () => {
    setIsProcessing(true);

    // Giả lập quá trình xử lý đơn hàng
    setTimeout(() => {
      // Tạo mã đơn hàng ngẫu nhiên
      const generatedOrderId =
        "DM" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedOrderId);
      setIsProcessing(false);

      // Lưu thông tin đơn hàng vào localStorage để có thể xem lại
      const orderDetails = {
        id: generatedOrderId,
        date: new Date().toISOString(),
        items: cartItems,
        total: cartTotal,
        shipping: shippingInfo,
        payment: {
          method: paymentMethod,
          status: "Đã thanh toán",
        },
      };

      // Lưu đơn hàng vào localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, orderDetails])
      );

      // Xóa giỏ hàng sau khi đặt hàng thành công
      dispatch(clearCart());
    }, 3000);
  };

  // Tạo component hiển thị các bước thanh toán
  const CheckoutSteps = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div
          className={`flex flex-col items-center ${
            currentStep >= 1 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            <FaShoppingBag />
          </div>
          <span className="mt-2 text-sm font-medium">Thông tin</span>
        </div>

        <div
          className={`w-20 h-1 mx-2 ${
            currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
          }`}
        ></div>

        <div
          className={`flex flex-col items-center ${
            currentStep >= 2 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            <FaCreditCard />
          </div>
          <span className="mt-2 text-sm font-medium">Thanh toán</span>
        </div>

        <div
          className={`w-20 h-1 mx-2 ${
            currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
          }`}
        ></div>

        <div
          className={`flex flex-col items-center ${
            currentStep >= 3 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            <FaCheckCircle />
          </div>
          <span className="mt-2 text-sm font-medium">Hoàn tất</span>
        </div>
      </div>
    );
  };

  // Component hiển thị thông tin giao hàng (Bước 1)
  const ShippingForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
          Thông tin giao hàng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Input
              label="Họ và tên"
              type="text"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleInputChange}
              placeholder="Nguyễn Văn A"
              required
              error={errors.fullName}
            />
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              required
              error={errors.email}
            />
          </div>

          <div>
            <Input
              label="Số điện thoại"
              type="tel"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              placeholder="0123456789"
              required
              error={errors.phone}
            />
          </div>

          <div>
            <Input
              label="Địa chỉ"
              type="text"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              placeholder="Số nhà, đường, phường/xã"
              required
              error={errors.address}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={shippingInfo.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
            {errors.city && (
              <p className="mt-1 text-red-500 text-xs">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              value={shippingInfo.district}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.district ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Chọn Quận/Huyện</option>
              <option value="Quận Gò Vấp">Quận Gò Vấp</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 7">Quận 7</option>
            </select>
            {errors.district && (
              <p className="mt-1 text-red-500 text-xs">{errors.district}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <select
              name="ward"
              value={shippingInfo.ward}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.ward ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Chọn Phường/Xã</option>
              <option value="Phường 5">Phường 5</option>
              <option value="Phường 12">Phường 12</option>
              <option value="Phường 14">Phường 14</option>
            </select>
            {errors.ward && (
              <p className="mt-1 text-red-500 text-xs">{errors.ward}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Input
              label="Ghi chú đơn hàng (tùy chọn)"
              type="textarea"
              name="notes"
              value={shippingInfo.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
            />
          </div>
        </div>
      </div>
    );
  };

  // Component hiển thị phương thức thanh toán (Bước 2)
  const PaymentMethod = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
          Phương thức thanh toán
        </h2>

        <div className="space-y-4">
          <div
            className={`border ${
              paymentMethod === "cod"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            } rounded-lg p-4 cursor-pointer transition-colors`}
            onClick={() => handlePaymentMethodChange("cod")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === "cod"
                    ? "border-blue-500"
                    : "border-gray-300"
                } flex items-center justify-center mr-3`}
              >
                {paymentMethod === "cod" && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center">
                <FaMoneyBill className="text-green-600 mr-2" />
                <span className="font-medium">
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
            </div>
            {paymentMethod === "cod" && (
              <p className="text-sm text-gray-600 mt-2 ml-8">
                Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng
              </p>
            )}
          </div>

          <div
            className={`border ${
              paymentMethod === "bank"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            } rounded-lg p-4 cursor-pointer transition-colors`}
            onClick={() => handlePaymentMethodChange("bank")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === "bank"
                    ? "border-blue-500"
                    : "border-gray-300"
                } flex items-center justify-center mr-3`}
              >
                {paymentMethod === "bank" && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center">
                <FaUniversity className="text-blue-600 mr-2" />
                <span className="font-medium">Chuyển khoản ngân hàng</span>
              </div>
            </div>
            {paymentMethod === "bank" && (
              <div className="text-sm text-gray-600 mt-2 ml-8">
                <p>Thông tin tài khoản:</p>
                <p>Ngân hàng: Vietcombank</p>
                <p>Số tài khoản: 1234567890</p>
                <p>Chủ tài khoản: NGUYEN VAN A</p>
                <p>Nội dung: [Tên của bạn] thanh toán đơn hàng</p>
              </div>
            )}
          </div>

          <div
            className={`border ${
              paymentMethod === "card"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            } rounded-lg p-4 cursor-pointer transition-colors`}
            onClick={() => handlePaymentMethodChange("card")}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === "card"
                    ? "border-blue-500"
                    : "border-gray-300"
                } flex items-center justify-center mr-3`}
              >
                {paymentMethod === "card" && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center">
                <FaCreditCard className="text-purple-600 mr-2" />
                <span className="font-medium">
                  Thanh toán thẻ tín dụng/ghi nợ
                </span>
              </div>
            </div>
            {paymentMethod === "card" && (
              <div className="text-sm text-gray-600 mt-2 ml-8">
                <p>Hỗ trợ tất cả các loại thẻ phổ biến</p>
                <div className="flex space-x-2 mt-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                    alt="American Express"
                    className="h-6"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Component hiển thị kết quả đặt hàng thành công (Bước 3)
  const OrderComplete = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-bold mb-2">
              Đang xử lý đơn hàng của bạn
            </h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
          </div>
        ) : (
          <div className="py-8">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <FaCheckCircle className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Đặt hàng thành công!
            </h2>
            <p className="text-lg mb-2">Cảm ơn bạn đã mua sắm tại DreamyMart</p>
            <p className="text-gray-600 mb-6">
              Mã đơn hàng của bạn:{" "}
              <span className="font-bold text-gray-800">{orderId}</span>
            </p>

            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-2 text-left">Thông tin đơn hàng</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-bold">
                  {cartTotal.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span>
                  {paymentMethod === "cod" && "Thanh toán khi nhận hàng"}
                  {paymentMethod === "bank" && "Chuyển khoản ngân hàng"}
                  {paymentMethod === "card" && "Thẻ tín dụng/ghi nợ"}
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link to="/">
                <Button variant="outline">Tiếp tục mua sắm</Button>
              </Link>
              <Link to={`/orders/${orderId}`}>
                <Button variant="primary">Xem chi tiết đơn hàng</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Component hiển thị tóm tắt đơn hàng
  const OrderSummary = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
          Tóm tắt đơn hàng
        </h2>

        <div className="mb-4">
          <div className="max-h-60 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center py-2 border-b border-gray-100"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.price.toLocaleString()} đ
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span>{cartTotal.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá:</span>
            <span>0 đ</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Tổng cộng:</span>
            <span className="text-red-600">{cartTotal.toLocaleString()} đ</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" onClick={handleBack}>
            {currentStep === 1 ? (
              <>
                <FaArrowLeft className="mr-2" /> Giỏ hàng
              </>
            ) : (
              <>
                <FaArrowLeft className="mr-2" /> Quay lại
              </>
            )}
          </Button>

          {currentStep < 3 && (
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleContinue}
            >
              {currentStep === 1 ? (
                <>
                  Tiếp tục <FaArrowRight className="ml-2" />
                </>
              ) : (
                <>
                  Hoàn tất đơn hàng <FaCheck className="ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Thanh toán</h1>
            <div className="text-sm breadcrumbs text-gray-500">
              <ul className="flex">
                <li className="after:content-['/'] after:mx-2">
                  <Link to="/">Trang chủ</Link>
                </li>
                <li className="after:content-['/'] after:mx-2">
                  <Link to="/cart">Giỏ hàng</Link>
                </li>
                <li className="font-medium text-blue-600">Thanh toán</li>
              </ul>
            </div>
          </div>

          <CheckoutSteps />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content area */}
            <div className="lg:w-2/3">
              {currentStep === 1 && <ShippingForm />}
              {currentStep === 2 && <PaymentMethod />}
              {currentStep === 3 && <OrderComplete />}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:w-1/3">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
