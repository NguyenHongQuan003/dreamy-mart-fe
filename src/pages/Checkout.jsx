import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  removeFromCartAsync,
} from "../redux/slices/cartSlice";
import { placeOrder, checkToOrder, createMomoPayment } from "../services/orderService";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
  FaCheck,
  FaShoppingBag,
  FaCheckCircle,
  FaShoppingCart,
} from "react-icons/fa";
import ShippingForm from "../components/layout/ShippingForm";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const user = useSelector((state) => state.auth.user);
  const selectedItems = location.state?.selectedItems || [];
  const appliedPromotion = location.state?.appliedPromotion;
  const initialTotalAmount = location.state?.totalAmount;

  const [currentStep, setCurrentStep] = useState(1);
  const [totalAmount] = useState(initialTotalAmount);
  const [error, setError] = useState("");

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Lọc các sản phẩm được chọn
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

  const validateStep1 = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!shippingInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    setError(""); // Reset error message

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
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };



  const handlePlaceOrder = async () => {
    try {
      const response = await placeOrder(
        selectedItems,
        appliedPromotion?.result?.couponCode,
        shippingInfo
      );
      console.log("response place order ", response)
      return response.result; // { id: orderId, userId }
    } catch (error) {
      console.log(error)
      throw new Error(error || "Đặt hàng thất bại");
    }
  };

  const handleCheckInventory = async (orderId) => {
    try {
      const response = await checkToOrder(orderId);
      console.log("response check inventory ", response)
      if (!response.result) {
        throw new Error("Số lượng sản phẩm không đủ");
      }
    } catch (error) {
      console.log(error)
      throw new Error(error || "Kiểm tra tồn kho thất bại");
    }
  };

  const handleCreatePayment = async (orderId, userId, amount) => {
    try {
      const response = await createMomoPayment(orderId, userId, amount);
      console.log("response create payment ", response)
      if (response.code !== 1000) {
        throw new Error(response.message || "Tạo thanh toán thất bại");
      }
      return response.result.payUrl;
    } catch (error) {
      console.log(error)
      throw new Error(error || "Tạo thanh toán thất bại");
    }
  };

  const removePaidItemsFromCart = (items) => {
    items.forEach(itemId => {
      dispatch(removeFromCartAsync(itemId));
    });
  };

  const processOrder = async () => {
    setError("");

    try {
      const { id: orderId, userId } = await handlePlaceOrder();
      await handleCheckInventory(orderId);
      const payUrl = await handleCreatePayment(orderId, userId, totalAmount.total);
      removePaidItemsFromCart(selectedItems);

      // Redirect to MoMo payment
      window.location.href = payUrl;
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra trong quá trình đặt hàng");
      setCurrentStep(2);
      navigate("/cart");
    }
  };


  // Component hiển thị các bước thanh toán
  const CheckoutSteps = () => (
    <div className="flex items-center justify-center mb-8">
      <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          <FaShoppingBag />
        </div>
        <span className="mt-2 text-sm font-medium">Thông tin</span>
      </div>

      <div className={`w-20 h-1 mx-2 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>

      <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          <FaCreditCard />
        </div>
        <span className="mt-2 text-sm font-medium">Thanh toán</span>
      </div>

      <div className={`w-20 h-1 mx-2 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>

      <div className={`flex flex-col items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          <FaCheckCircle />
        </div>
        <span className="mt-2 text-sm font-medium">Hoàn tất</span>
      </div>
    </div>
  );

  // Component hiển thị phương thức thanh toán (Bước 2)
  const PaymentMethod = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
        Phương thức thanh toán
      </h2>

      <div className="space-y-4">
        <div className="border border-blue-500 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex items-center">
              <FaCreditCard className="text-blue-600 mr-2" />
              <span className="font-medium">Chuyển khoản MoMo</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  // Component hiển thị kết quả đặt hàng thành công (Bước 3)
  const OrderComplete = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-bold mb-2">
          Đang xử lý đơn hàng của bạn
        </h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
      </div>
    </div>
  );

  // Component hiển thị tóm tắt đơn hàng
  const OrderSummary = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
        Tóm tắt đơn hàng
      </h2>

      <div className="mb-4">
        <div className="max-h-60 overflow-y-auto mb-4">
          {selectedCartItems.map((item) => (
            <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
              <div className="relative">
                <img
                  src={item?.product?.images[0]?.fileUri}
                  alt={item?.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium line-clamp-1">
                  {item?.product?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item?.product?.sellingPrice.toLocaleString()} đ
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {(item?.product?.sellingPrice * item.quantity).toLocaleString()} đ
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span>{totalAmount.subtotal.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span>Miễn phí</span>
        </div>
        {appliedPromotion && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá {appliedPromotion.result.discountPercent > 0
              ? `(${appliedPromotion.result.discountPercent}%)`
              : `(${appliedPromotion.result.discountAmount.toLocaleString()}đ)`}:</span>
            <span className="text-red-600">-{totalAmount.discount.toLocaleString()} đ</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
          <span>Tổng cộng:</span>
          <span className="text-red-600">{totalAmount.total.toLocaleString()} đ</span>
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

  // Kiểm tra nếu không có sản phẩm nào được chọn
  if (selectedItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
                <FaShoppingCart className="text-gray-400 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Không có sản phẩm nào được chọn
              </h2>
              <p className="text-gray-600 mb-6">
                Vui lòng quay lại giỏ hàng và chọn ít nhất một sản phẩm để thanh toán.
              </p>
              <Link to="/cart">
                <Button variant="primary" icon={FaArrowLeft}>
                  Quay lại giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
            <div className="lg:w-2/3">
              {currentStep === 1 && <ShippingForm handleInputChange={handleInputChange} errors={errors} shippingInfo={shippingInfo} />}
              {currentStep === 2 && <PaymentMethod />}
              {currentStep === 3 && <OrderComplete />}
            </div>

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
