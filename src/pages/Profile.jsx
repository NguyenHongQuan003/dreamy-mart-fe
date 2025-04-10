import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaEnvelope,
  FaPlus,
  FaTrash,
  FaShoppingBag,
  FaEye,
  FaRegClock,
  FaCheckCircle,
  FaTruck,
  FaCalendar,
} from "react-icons/fa";
import { useAuth } from "../utils/authUtils";
import { isValidImageUrl } from "../utils/validate";
import { APP_INFO } from "../constants/app.constants";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    avatar: user?.avatar || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender.toString() || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  useEffect(() => {
    // Lấy danh sách đơn hàng từ localStorage
    const fetchOrders = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        // Sắp xếp theo thời gian mới nhất
        const sortedOrders = savedOrders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement update profile logic
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
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
    switch (status) {
      case "Đã thanh toán":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Đã thanh toán
          </span>
        );
      case "Đang giao hàng":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaTruck className="mr-1" />
            Đang giao hàng
          </span>
        );
      case "Chờ xử lý":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaRegClock className="mr-1" />
            Chờ xử lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FaRegClock className="mr-1" />
            Đang xử lý
          </span>
        );
    }
  };

  // Component hiển thị danh sách đơn hàng
  const OrdersHistory = () => {
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
          <Link to="/">
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
                <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(order.date)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {getOrderStatusBadge(order.payment.status)}
                <Link to={`/orders/${order.id}`}>
                  <Button
                    variant="outline"
                    size="small"
                    className="ml-2"
                    icon={FaEye}
                  >
                    Chi tiết
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
                                    src={item.image}
                                    alt={item.productName}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {item.productName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                              {item.price.toLocaleString()} đ
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                              {(item.price * item.quantity).toLocaleString()} đ
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
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium mr-2">
                    Phương thức thanh toán:
                  </span>
                  <span>
                    {order.payment.method === "cod" &&
                      "Thanh toán khi nhận hàng (COD)"}
                    {order.payment.method === "bank" &&
                      "Chuyển khoản ngân hàng"}
                    {order.payment.method === "card" && "Thẻ tín dụng/ghi nợ"}
                  </span>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <span className="text-gray-600 font-medium mr-2">
                    Tổng cộng:
                  </span>
                  <span className="text-red-600 font-bold text-lg">
                    {order.total.toLocaleString()} đ
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
                <div className="flex items-center justify-center rounded-ful">
                  {/* <FaUser className="text-white text-3xl" /> */}
                  <img
                    src={
                      isValidImageUrl(user?.avatar)
                        ? user?.avatar
                        : APP_INFO.DEFAULT_AVATAR
                    }
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
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
                  onClick={() => setIsEditing(!isEditing)}
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
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === "profile"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser className="inline mr-2" />
                Thông tin cá nhân
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === "orders"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <FaShoppingBag className="inline mr-2" />
                Đơn hàng của tôi
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === "addresses"
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={FaUser}
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
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={FaEnvelope}
                  />
                  <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={FaPhone}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <Button type="submit" variant="primary" fullWidth>
                      Lưu thay đổi
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Địa chỉ nhận hàng
                </h2>
                <Button variant="outline" icon={FaPlus}>
                  Thêm địa chỉ mới
                </Button>
              </div>

              {/* Address List */}
              <div className="space-y-4">
                {/* Default Address */}
                <div className="border border-[#0078E8] rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-gray-600" />
                        <span className="font-medium">Nguyễn Văn A</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <FaPhone className="text-gray-600" />
                        <span>0123456789</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <FaMapMarkerAlt className="text-gray-600" />
                        <span>123 Đường ABC, Quận 1, TP.HCM</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="small" icon={FaEdit}>
                        Sửa
                      </Button>
                      <Button variant="danger" size="small" icon={FaTrash}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Địa chỉ mặc định
                    </span>
                  </div>
                </div>

                {/* Other Address */}
                <div className="border border-[#0078E8] rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-gray-600" />
                        <span className="font-medium">Nguyễn Văn B</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <FaPhone className="text-gray-600" />
                        <span>0987654321</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <FaMapMarkerAlt className="text-gray-600" />
                        <span>456 Đường XYZ, Quận 2, TP.HCM</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="small" icon={FaEdit}>
                        Sửa
                      </Button>
                      <Button variant="danger" size="small" icon={FaTrash}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
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
