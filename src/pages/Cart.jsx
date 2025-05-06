import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
import { useState } from "react";
import {
  selectCartItems,
  removeFromCartAsync,
  updateQuantityAsync,
  clearCartAsync,
} from "../redux/slices/cartSlice";
import { getPromotionByCode } from "../services/promotionService";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaCreditCard,
} from "react-icons/fa";
import { APP_INFO } from "../constants/app.constants";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const [promotionCode, setPromotionCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [promotionError, setPromotionError] = useState("");


  const handleRemoveItem = (id) => {
    dispatch(removeFromCartAsync(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantityAsync({ productId: id, quantity }));

    // Kiểm tra lại điều kiện mã giảm giá sau khi thay đổi số lượng
    if (appliedPromotion) {
      const subtotal = cartItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((total, item) => {
          const itemQuantity = item.id === id ? quantity : item.quantity;
          return total + (item.product.sellingPrice * itemQuantity);
        }, 0);

      if (subtotal < appliedPromotion.result.minimumOrderValue) {
        setAppliedPromotion(null);
        setPromotionCode("");
        setPromotionError(`Đơn hàng tối thiểu ${appliedPromotion.result.minimumOrderValue.toLocaleString()}đ để áp dụng mã`);
      }
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm?")) {
      dispatch(clearCartAsync());
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      const newSelectedItems = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];

      // Kiểm tra lại điều kiện mã giảm giá sau khi thay đổi sản phẩm được chọn
      if (appliedPromotion) {
        const subtotal = cartItems
          .filter(item => newSelectedItems.includes(item.id))
          .reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);

        if (subtotal < appliedPromotion.result.minimumOrderValue) {
          setAppliedPromotion(null);
          setPromotionCode("");
          setPromotionError(`Đơn hàng tối thiểu ${appliedPromotion.result.minimumOrderValue.toLocaleString()}đ để áp dụng mã`);
        }
      }

      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    setSelectedItems(prev => {
      const newSelectedItems = prev.length === cartItems.length
        ? []
        : cartItems.map(item => item.id);

      // Kiểm tra lại điều kiện mã giảm giá sau khi thay đổi sản phẩm được chọn
      if (appliedPromotion) {
        const subtotal = cartItems
          .filter(item => newSelectedItems.includes(item.id))
          .reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);

        if (subtotal < appliedPromotion.result.minimumOrderValue) {
          setAppliedPromotion(null);
          setPromotionCode("");
          setPromotionError(`Đơn hàng tối thiểu ${appliedPromotion.result.minimumOrderValue.toLocaleString()}đ để áp dụng mã`);
        }
      }

      return newSelectedItems;
    });
  };

  const calculateSelectedTotal = () => {
    const subtotal = cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);

    if (appliedPromotion) {
      let discountAmount = 0;
      let discountType = '';

      // Tính giảm giá theo phần trăm
      const percentDiscount = (subtotal * appliedPromotion.result.discountPercent) / 100;

      // Tính giảm giá cố định
      const fixedDiscount = appliedPromotion.result.discountAmount;

      // So sánh và chọn loại giảm giá có lợi nhất
      if (percentDiscount > fixedDiscount) {
        discountAmount = percentDiscount;
        discountType = 'percent';
      } else {
        discountAmount = fixedDiscount;
        discountType = 'fixed';
      }

      // Đảm bảo số tiền giảm không vượt quá tổng tiền
      discountAmount = Math.min(discountAmount, subtotal);

      return {
        subtotal,
        discount: discountAmount,
        total: subtotal - discountAmount,
        discountType
      };
    }

    return {
      subtotal,
      discount: 0,
      total: subtotal,
      discountType: null
    };
  };

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) {
      setPromotionError("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const response = await getPromotionByCode(promotionCode);
      const promotion = response.result;

      // Kiểm tra điều kiện áp dụng mã
      if (!promotion.isActive) {
        setPromotionError("Mã giảm giá không còn hiệu lực");
        return;
      }

      const currentDate = new Date();
      const startDate = new Date(promotion.startDate);
      const endDate = new Date(promotion.endDate);

      if (currentDate < startDate || currentDate > endDate) {
        setPromotionError("Mã giảm giá không còn hiệu lực");
        return;
      }

      const subtotal = calculateSelectedTotal().subtotal;
      if (subtotal < promotion.minimumOrderValue) {
        setPromotionError(`Đơn hàng tối thiểu ${promotion.minimumOrderValue.toLocaleString()}đ để áp dụng mã`);
        return;
      }

      setAppliedPromotion(response);
      setPromotionError("");
    } catch (error) {
      switch (error.response.data.message) {
        case "Promotion not active":
          setPromotionError("Mã giảm giá không còn hiệu lực");
          break;
        case "Promotion not found":
          setPromotionError("Mã giảm giá không tồn tại");
          break;
        default:
          setPromotionError("Mã giảm giá không hợp lệ");
          break;
      }
    }
  };

  const handleRemovePromotion = () => {
    setAppliedPromotion(null);
    setPromotionCode("");
    setPromotionError("");
  };

  // Xử lý chuyển đến trang thanh toán
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    navigate("/checkout", {
      state: {
        selectedItems,
        appliedPromotion,
        totalAmount: calculateSelectedTotal()
      }
    });
  };

  if (cartItems.length === 0) {
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
                Giỏ hàng trống
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn chưa có sản phẩm nào trong giỏ hàng.
              </p>
              <Link to="/products/category/all">
                <Button variant="primary" icon={FaArrowLeft}>
                  Tiếp tục mua sắm
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
            <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng</h1>
            <div className="text-sm breadcrumbs text-gray-500">
              <ul className="flex">
                <li className="after:content-['/'] after:mx-2">
                  <Link to="/">Trang chủ</Link>
                </li>
                <li className="font-medium text-blue-600">Giỏ hàng</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 border-b border-gray-300 bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 font-medium text-gray-700">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === cartItems.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-4">Sản phẩm</div>
                    <div className="col-span-2 text-center">Đơn giá</div>
                    <div className="col-span-2 text-center">Số lượng</div>
                    <div className="col-span-2 text-right">Thành tiền</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-4">
                          <div className="flex items-center">
                            <div className="relative flex-shrink-0">
                              <img
                                src={item?.product?.images[0]?.fileUri || APP_INFO.NO_IAMGE_AVAILABLE}
                                alt={item?.product?.name}
                                className="w-20 h-20 object-cover rounded-md border border-gray-200"
                              />
                            </div>
                            <div className="ml-4">
                              <Link
                                to={`/products/${item?.product?.id}`}
                                className="text-blue-600 hover:underline line-clamp-2 font-medium"
                              >
                                {item?.product?.name}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
                                Mã SP: {item?.product?.id}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="text-red-600 font-medium">
                            {item?.product?.sellingPrice.toLocaleString()} đ
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                handleUpdateQuantity(item?.product?.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="px-3 py-1 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                handleUpdateQuantity(item?.product?.id, item.quantity + 1)
                              }
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-right">
                          <span className="text-red-600 font-medium">
                            {(item?.product?.sellingPrice * item.quantity).toLocaleString()} đ
                          </span>
                        </div>

                        <div className="col-span-1 text-right">
                          <button
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            onClick={() => handleRemoveItem(item?.product?.id)}
                            title="Xóa sản phẩm"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-300 flex flex-wrap justify-between items-center gap-4 bg-gray-50">
                  <Link
                    to="/"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <FaArrowLeft className="mr-2" /> Tiếp tục mua sắm
                  </Link>

                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleClearCart}
                  >
                    <FaTrash className="mr-2" /> Xóa tất cả
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-300 text-gray-800">
                  Tổng tiền
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span>{calculateSelectedTotal().subtotal.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  {appliedPromotion && (
                    <div className="flex justify-between text-gray-700">
                      <span>Giảm giá {calculateSelectedTotal().discountType === 'percent'
                        ? `(${appliedPromotion.result.discountPercent}%)`
                        : `(${appliedPromotion.result.discountAmount.toLocaleString()}đ)`}:</span>
                      <span className="text-red-600">-{calculateSelectedTotal().discount.toLocaleString()} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {calculateSelectedTotal().total.toLocaleString()} đ
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleCheckout}
                    icon={FaCreditCard}
                    className="py-3"
                    disabled={selectedItems.length === 0}
                  >
                    Tiến hành thanh toán ({selectedItems.length} sản phẩm)
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="font-medium mb-2">Mã giảm giá</h3>
                  {appliedPromotion ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-green-800">{appliedPromotion.result.promotionName}</p>
                          <p className="text-sm text-green-600">{appliedPromotion.result.description}</p>
                        </div>
                        <button
                          onClick={handleRemovePromotion}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <input
                        type="text"
                        value={promotionCode}
                        onChange={(e) => setPromotionCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="block flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleApplyPromotion}
                        className="bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium rounded-r-md hover:bg-blue-200 transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                  )}
                  {promotionError && (
                    <p className="text-red-500 text-sm mt-2">{promotionError}</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Giao hàng nhanh
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Thanh toán an toàn
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
