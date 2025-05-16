import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaShoppingBag,
  FaEye,
  FaRegClock,
  FaCheckCircle,
  FaCalendar,
  FaCamera,
  FaTimesCircle,
  FaRedo,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaClipboardList,
  FaShippingFast,
} from "react-icons/fa";
import { APP_INFO } from "../constants/app.constants";
import { validateDayOfBirth, validateFullName, validatePhone } from "../utils/validate";
import { updateProfile } from "../services/userService";
import { updateUser } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import Loading from "../components/common/Loading";
import Address from "../components/layout/Address";
import { getOrderDetail } from "../services/orderService";
import { useLocation } from "react-router-dom";


const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab === "orders") {
      setActiveTab("orders");
    }
  }, [location.state]);


  const [formData, setFormData] = useState({
    avatar: user?.avatar || null,
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender.toString() || "",
    dateOfBirth: user?.dateOfBirth || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  // useEffect(() => {
  //   console.log("avatarPreview", avatarPreview);
  // }, [avatarPreview]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      avatar: user?.avatar || null,
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender.toString() || "",
      dateOfBirth: user?.dateOfBirth || "",
    }));
    setAvatarPreview(user?.avatar);
  }, [user]);

  const handleCancelEdit = () => {
    setFormData({
      ...user,
      gender: user?.gender.toString() || "",
    });
    setAvatarPreview(user?.avatar);
    setErrors({});
    setIsEditing(false);
  };

  useEffect(() => {
    // Lấy danh sách đơn hàng từ localStorage
    const fetchOrders = async () => {
      setIsLoadingOrder(true);
      try {
        const savedOrders = await getOrderDetail();
        // console.log("savedOrders", savedOrders);
        // Sắp xếp theo thời gian mới nhất
        const sortedOrders = savedOrders.result.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "fullName":
        setErrors((prev) => ({
          ...prev,
          fullName: validateFullName(value),
        }));
        break;
      case "phone":
        setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
        break;
      case "dateOfBirth":
        setErrors((prev) => ({
          ...prev,
          dateOfBirth: validateDayOfBirth(value),
        }));
        break;
      default:
        break;
    }
  };

  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prev) => ({ ...prev, avatar: selectedFile }));
    setAvatarPreview(URL.createObjectURL(selectedFile));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateProfile(formData);
      if (response) {
        dispatch(updateUser(response));
        toast.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        toast.error(response.message || "Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Hiển thị trạng thái đơn hàng
  const getOrderStatusBadge = (status) => {
    const statusMap = {
      // Payment
      PAYMENT_COMPLETED: {
        label: "Đã thanh toán",
        icon: <FaCheckCircle className="mr-1" />,
        color: "bg-green-100 text-green-800",
      },
      PAYMENT_FAILED: {
        label: "Thanh toán thất bại",
        icon: <FaTimesCircle className="mr-1" />,
        color: "bg-red-100 text-red-800",
      },
      PAYMENT_PROCESSING: {
        label: "Đang thanh toán",
        icon: <FaRegClock className="mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
      },
      PAYMENT_REFUND_COMPLETED: {
        label: "Đã hoàn tiền",
        icon: <FaRedo className="mr-1" />,
        color: "bg-blue-100 text-blue-800",
      },
      PAYMENT_REFUND_FAILED: {
        label: "Hoàn tiền thất bại",
        icon: <FaExclamationTriangle className="mr-1" />,
        color: "bg-red-100 text-red-800",
      },
      PAYMENT_REFUND_PROCESSING: {
        label: "Đang hoàn tiền",
        icon: <FaRegClock className="mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
      },

      // Inventory
      INVENTORY_CHECKED: {
        label: "Đã kiểm kho",
        icon: <FaClipboardCheck className="mr-1" />,
        color: "bg-green-100 text-green-800",
      },
      INVENTORY_COMPLETED: {
        label: "Đã xuất kho",
        icon: <FaClipboardList className="mr-1" />,
        color: "bg-blue-100 text-blue-800",
      },
      INVENTORY_FAILED: {
        label: "Lỗi xuất kho",
        icon: <FaExclamationTriangle className="mr-1" />,
        color: "bg-red-100 text-red-800",
      },
      INVENTORY_PROCESSING: {
        label: "Đang xuất kho",
        icon: <FaRegClock className="mr-1" />,
        color: "bg-gray-100 text-gray-800",
      },

      // Delivery
      DELIVERY_PROCESSING: {
        label: "Đang giao",
        icon: <FaShippingFast className="mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
      },
      DELIVERY_COMPLETED: {
        label: "Giao thành công",
        icon: <FaCheckCircle className="mr-1" />,
        color: "bg-green-100 text-green-800",
      },
      DELIVERY_FAILED: {
        label: "Giao thất bại",
        icon: <FaTimesCircle className="mr-1" />,
        color: "bg-red-100 text-red-800",
      },

      // Order
      ORDER_CREATED: {
        label: "Đơn hàng mới",
        icon: <FaClipboardList className="mr-1" />,
        color: "bg-blue-100 text-blue-800",
      },
      ORDER_COMPLETED: {
        label: "Đơn hoàn tất",
        icon: <FaCheckCircle className="mr-1" />,
        color: "bg-green-100 text-green-800",
      },
      ORDER_CANCELLED: {
        label: "Đơn bị hủy",
        icon: <FaTimesCircle className="mr-1" />,
        color: "bg-red-100 text-red-800",
      },
    };

    const { label, icon, color } = statusMap[status] || {
      label: "Không xác định",
      icon: <FaRegClock className="mr-1" />,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  // Component hiển thị danh sách đơn hàng
  const OrdersHistory = () => {
    if (isLoadingOrder) {
      return (
        <>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <FaShoppingBag className="text-3xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Bạn chưa có đơn hàng nào
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy tiếp tục mua sắm để đặt đơn hàng đầu tiên của bạn
          </p>
          <Link to="/products/category/all">
            <Button variant="primary">Mua sắm ngay</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg overflow-hidden bg-white"
          >
            <div className="bg-gray-50 px-4 py-3 border-b flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-[14px]">Đơn hàng #{order.id}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(order.orderDate)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {getOrderStatusBadge(order.status)}
                <Link to={`/orders/${order.id}`} state={{ fromOrdersTab: true }}>
                  <Button
                    variant="outline"
                    size="small"
                    className="ml-2"
                    icon={FaEye}
                  >
                    Xem
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Sản phẩm
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Số lượng
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Đơn giá
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.slice(0, 3).map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded object-cover"
                                    src={item?.product?.images[0].fileUri}
                                    alt={item?.product?.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {item?.product?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                              {item?.product?.sellingPrice.toLocaleString()} đ
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                              {(item?.product?.sellingPrice * item.quantity).toLocaleString()} đ
                            </td>
                          </tr>
                        ))}

                        {order.items.length > 3 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-3 py-3 text-sm text-center text-gray-500"
                            >
                              <Link
                                to={`/orders/${order.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                + {order.items.length - 3} sản phẩm khác
                              </Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-between items-center border-t pt-4">
                {order.cancelReason !== null && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="font-medium mr-2">Lý do hủy đơn: </span>
                    {getOrderStatusBadge(order.cancelReason)}
                  </div>
                )}

                <div className="flex items-center">
                  <span className="text-gray-600 font-medium mr-2">
                    Phương thức thanh toán:
                  </span>
                  {/* <span>
                    {order.payment.method === "cod" &&
                      "Thanh toán khi nhận hàng (COD)"}
                    {order.payment.method === "bank" &&
                      "Chuyển khoản ngân hàng"}
                    {order.payment.method === "card" && "Thẻ tín dụng/ghi nợ"}
                  </span> */}
                  <span className="text-pink-500 font-medium mr-2">
                    momo
                  </span>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <span className="text-gray-600 font-medium mr-2">
                    Tổng cộng:
                  </span>
                  <span className="text-red-600 font-bold text-lg">
                    {order.totalAmount.toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={avatarPreview || APP_INFO.DEFAULT_AVATAR}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#0078E8]"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg cursor-pointer">
                      <FaCamera />
                      <input
                        type="file"
                        name="avatar"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.fullName || "Chưa cập nhật"}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              {activeTab === "profile" && (
                <Button
                  variant="outline"
                  onClick={() =>
                    isEditing ? handleCancelEdit() : setIsEditing(true)
                  }
                  icon={FaEdit}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-md p-2 mb-6">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser className="inline mr-2" />
                Thông tin cá nhân
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === "orders"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingBag className="inline mr-2" />
                Đơn hàng của tôi
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === "addresses"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab("addresses")}
              >
                <FaMapMarkerAlt className="inline mr-2" />
                Địa chỉ giao hàng
              </button>
            </div>
          </div>

          {/* Profile Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={FaUser}
                    error={errors.fullName}
                  />

                  {/* Gender Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Giới tính
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="true"
                          checked={formData.gender === "true"}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Nam</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="false"
                          checked={formData.gender === "false"}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Nữ</span>
                      </label>
                    </div>
                  </div>
                  <Input
                    label="Ngày sinh"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={FaCalendar}
                    error={errors.dateOfBirth}
                  />

                  <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={FaPhone}
                    error={errors.phone}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loading size="sm" />
                          <span>Đang xử lý...</span>
                        </div>
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Orders History */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Đơn hàng của tôi
                </h2>
              </div>
              <OrdersHistory />
            </div>
          )}

          {/* Delivery Addresses */}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-lg shadow-md p-6">


              {/* Address List */}
              <div className="space-y-4">
                {/* Default Address */}
                <Address />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
