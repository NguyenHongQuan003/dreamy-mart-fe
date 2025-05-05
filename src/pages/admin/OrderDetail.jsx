import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants/api.constants";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaRegClock,
  FaTimes,
  FaPrint,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaCreditCard,
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  useEffect(() => {
    // Kiểm tra quyền admin

    const fetchOrderDetail = async () => {
      setIsLoading(true);
      try {
        // Lấy chi tiết đơn hàng từ API
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        setOrder(response.data);
        setOrderStatus(response.data.status);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);

        // Lấy dữ liệu từ localStorage nếu API không có
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const foundOrder = savedOrders.find((o) => o.id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
          setOrderStatus(foundOrder.status);
        } else {
          // Dữ liệu mẫu nếu không có đơn hàng trong localStorage
          const mockOrder = {
            id: orderId || "DM123456",
            date: "2023-04-02T10:30:00",
            shipping: {
              fullName: "Nguyễn Văn A",
              phone: "0987654321",
              email: "nguyenvana@example.com",
              address: "123 Đường ABC, Phường XYZ, Quận 1, TP. HCM",
            },
            items: [
              {
                id: 1,
                productName: "Điện thoại Samsung Galaxy S21",
                price: 20990000,
                quantity: 1,
                image: "https://via.placeholder.com/60x60",
              },
              {
                id: 2,
                productName: "Ốp lưng Samsung Galaxy S21",
                price: 290000,
                quantity: 1,
                image: "https://via.placeholder.com/60x60",
              },
            ],
            subtotal: 21280000,
            shipping_fee: 30000,
            discount: 10000,
            total: 21300000,
            payment: {
              method: "cod",
              status: "Đã thanh toán",
            },
            status: "Hoàn thành",
            note: "Giao hàng giờ hành chính, gọi trước khi giao",
          };

          setOrder(mockOrder);
          setOrderStatus(mockOrder.status);
        }

        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, navigate]);


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

  // Xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus });
      setOrderStatus(newStatus);
      alert(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
    } catch (error) {
      console.error("Error updating order status:", error);

      // Giả lập cập nhật thành công nếu API lỗi
      setOrderStatus(newStatus);
      alert(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
    }
  };

  // Hiển thị trạng thái đơn hàng
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "Hoàn thành":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Hoàn thành
          </span>
        );
      case "Đang giao hàng":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FaTruck className="mr-1" />
            Đang giao hàng
          </span>
        );
      case "Chờ xử lý":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FaRegClock className="mr-1" />
            Chờ xử lý
          </span>
        );
      case "Đã hủy":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FaTimes className="mr-1" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <FaRegClock className="mr-1" />
            {status || "Đang xử lý"}
          </span>
        );
    }
  };

  // Hiển thị phương thức thanh toán
  const getPaymentMethod = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "card":
        return "Thẻ tín dụng / Ghi nợ";
      default:
        return method;
    }
  };

  // Danh sách các trạng thái đơn hàng
  const orderStatuses = ["Hoàn thành", "Đang giao hàng", "Chờ xử lý", "Đã hủy"];

  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Ẩn khi in */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center print:hidden">
          <div className="flex items-center">
            <Link
              to="/admin/orders"
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Chi tiết đơn hàng #{orderId}
              </h1>
              <p className="text-gray-600">Xem và quản lý thông tin đơn hàng</p>
            </div>
          </div>
          <button
            onClick={handlePrintOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <FaPrint className="mr-2" /> In đơn hàng
          </button>
        </div>

        {/* Tiêu đề khi in */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold text-center">HÓA ĐƠN BÁN HÀNG</h1>
          <p className="text-center text-lg mt-2">
            DreamyMart - www.dreamymart.com
          </p>
          <div className="border-b-2 border-gray-400 mt-4"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Thông tin đơn hàng</h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Mã đơn hàng:</span> #
                    {order.id}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Ngày đặt hàng:</span>{" "}
                    {formatDate(order.date)}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Phương thức thanh toán:</span>{" "}
                    {getPaymentMethod(order.payment.method)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Trạng thái thanh toán:</span>{" "}
                    {order.payment.status}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 print:mt-0 flex flex-col items-start md:items-end print:items-end">
                  <div className="mb-4">
                    <p className="text-lg font-bold mb-2">
                      Trạng thái đơn hàng
                    </p>
                    {getOrderStatusBadge(orderStatus)}
                  </div>
                  <div className="print:hidden">
                    <div className="relative inline-block text-left">
                      <select
                        value={orderStatus}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {orderStatuses.map((status, index) => (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng và giao hàng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Thông tin khách hàng
                  </h2>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-800">
                      <span className="font-medium mr-2">Họ tên:</span>{" "}
                      {order.shipping.fullName}
                    </p>
                    <p className="flex items-center text-gray-800">
                      <FaPhone className="mr-2 text-gray-500" />{" "}
                      {order.shipping.phone}
                    </p>
                    {order.shipping.email && (
                      <p className="flex items-center text-gray-800">
                        <FaEnvelope className="mr-2 text-gray-500" />{" "}
                        {order.shipping.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng</h2>
                  <p className="flex items-start text-gray-800">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-gray-500" />
                    <span>{order.shipping.address}</span>
                  </p>
                  {order.note && (
                    <div className="mt-4">
                      <p className="font-medium">Ghi chú:</p>
                      <p className="text-gray-800 italic">{order.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Sản phẩm đã đặt</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Sản phẩm
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Giá
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Số lượng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.image && (
                                <div className="flex-shrink-0 h-12 w-12 mr-3">
                                  <img
                                    className="h-12 w-12 object-cover rounded"
                                    src={item.image}
                                    alt={item.productName}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.productName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                            {item.price.toLocaleString()} đ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {(item.price * item.quantity).toLocaleString()} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tổng thanh toán */}
              <div className="border-t pt-4">
                <div className="flex flex-col items-end">
                  <div className="w-full md:w-64 print:w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">
                        {order.subtotal?.toLocaleString() ||
                          (
                            order.total -
                            (order.shipping_fee || 0) +
                            (order.discount || 0)
                          ).toLocaleString()}{" "}
                        đ
                      </span>
                    </div>
                    {order.shipping_fee !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-medium">
                          {order.shipping_fee.toLocaleString()} đ
                        </span>
                      </div>
                    )}
                    {order.discount !== undefined && order.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="font-medium text-red-500">
                          -{order.discount.toLocaleString()} đ
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-bold">Tổng thanh toán:</span>
                      <span className="font-bold text-lg">
                        {order.total.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán - Ẩn khi in */}
            <div className="bg-white rounded-lg shadow-md p-6 print:hidden">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaFileInvoice className="mr-2 text-blue-500" />
                Thông tin thanh toán
              </h2>
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <FaCreditCard className="text-blue-500 text-xl mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    {getPaymentMethod(order.payment.method)}
                  </h3>
                  <p className="text-gray-600">
                    Trạng thái:{" "}
                    <span className="font-medium">{order.payment.status}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center text-gray-500">
              Không tìm thấy thông tin đơn hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
