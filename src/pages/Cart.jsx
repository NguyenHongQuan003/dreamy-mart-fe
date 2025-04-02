import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalAmount,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/slices/cartSlice";
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
import { APP_INFO } from "../constants/common.constants";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalAmount);

  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      dispatch(removeFromCart(id));
    }
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm?")) {
      dispatch(clearCart());
    }
  };

  // Xử lý chuyển đến trang thanh toán
  const handleCheckout = () => {
    navigate("/checkout");
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
              <Link to="/">
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
                <div className="p-4 border-b bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 font-medium text-gray-700">
                    <div className="col-span-6">Sản phẩm</div>
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
                        <div className="col-span-6">
                          <div className="flex items-center">
                            <div className="relative flex-shrink-0">
                              <img
                                src={item.image || APP_INFO.NO_IAMGE_AVAILABLE}
                                alt={item.productName}
                                className="w-20 h-20 object-cover rounded-md border border-gray-200"
                              />
                            </div>
                            <div className="ml-4">
                              <Link
                                to={`/products/${item.id}`}
                                className="text-blue-600 hover:underline line-clamp-2 font-medium"
                              >
                                {item.productName}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
                                Mã SP: {item.id}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="text-red-600 font-medium">
                            {item.price.toLocaleString()} đ
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
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
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-1 text-right">
                          <span className="text-red-600 font-medium">
                            {(item.price * item.quantity).toLocaleString()} đ
                          </span>
                        </div>

                        <div className="col-span-1 text-right">
                          <button
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Xóa sản phẩm"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t flex flex-wrap justify-between items-center gap-4 bg-gray-50">
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
                <h2 className="text-xl font-bold mb-4 pb-3 border-b text-gray-800">
                  Tổng tiền
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span>{cartTotal.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Giảm giá:</span>
                    <span>0 đ</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {cartTotal.toLocaleString()} đ
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
                  >
                    Tiến hành thanh toán
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Chúng tôi chấp nhận nhiều phương thức thanh toán an toàn
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="font-medium mb-2">Mã giảm giá</h3>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      className="block flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium rounded-r-md hover:bg-blue-200 transition-colors">
                      Áp dụng
                    </button>
                  </div>
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
