import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaHome,
  FaArrowLeft,
  FaPrint,
  // FaDownload,
  FaCheckCircle,
  FaRegClock,
  FaTimesCircle,
  FaClipboardList,
  FaShippingFast,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaRedo,
} from "react-icons/fa";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/app.constants";
import { getOrderDetailById } from "../services/orderService";
import { useSelector } from "react-redux";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userAuth = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Tìm kiếm đơn hàng trong localStorage
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await getOrderDetailById(orderId);
        setOrder(response.result);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Không tìm thấy đơn hàng
              </h2>
              <p className="text-gray-600 mb-6">
                Đơn hàng có mã <span className="font-semibold">{orderId}</span>{" "}
                không tồn tại hoặc đã bị xóa.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Link to="/">
                  <Button variant="outline" icon={FaHome}>
                    Về trang chủ
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="primary" icon={FaArrowLeft}>
                    Xem tất cả đơn hàng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getOrderStatusBadge = (status, size = "xs") => {
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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${size === "lg" ? "text-lg" : "text-xs"} font-medium ${color}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  return (
    <>
      <Header className="print:hidden" />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chi tiết đơn hàng #{order.id}
              </h1>
              <div className="print:hidden text-sm breadcrumbs text-gray-500 mt-1">
                <ul className="flex">
                  <li className="after:content-['/'] after:mx-2">
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li className="after:content-['/'] after:mx-2">
                    <Link to="/profile">Tài khoản</Link>
                  </li>
                  <li className="font-medium text-blue-600">
                    Đơn hàng #{order.id}
                  </li>
                </ul>
              </div>
            </div>
            <div className="hidden sm:flex space-x-2 print:hidden">
              <Button variant="outline" onClick={handlePrint} icon={FaPrint}>
                In hóa đơn
              </Button>
              {/* <Button variant="outline" icon={FaDownload}>
                Tải xuống PDF
              </Button> */}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print:shadow-none">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <div className="flex items-center">
                  {/* <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <FaCheckCircle />
                  </div> */}
                  <div>
                    <h2 className="text-lg font-semibold">{getOrderStatusBadge(order.status, "lg")}</h2>
                    {/* <p className="text-sm text-gray-500">
                      Cảm ơn bạn đã mua hàng!
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium">{formatDate(order.orderDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Thông tin khách hàng
                </h3>
                <div className="text-sm">
                  <p className="mb-1">
                    <span className="font-medium">Họ tên:</span>{" "}
                    {userAuth.fullName}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Email:</span>{" "}
                    {userAuth.email}
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    {userAuth.phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Địa chỉ giao hàng:
                </h3>
                <div className="text-sm">
                  <p className="mb-1">{order.shippingAddress}</p>

                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Phương thức thanh toán <span className="text-pink-500 font-medium mr-2">momo</span>
                </h3>
                {order.cancelReason !== null && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="font-medium mr-2">Lý do hủy đơn: </span>
                    {getOrderStatusBadge(order.cancelReason)}
                  </div>
                )}
                <div className="text-sm">
                  {/* <p className="mb-1">
                    {order.payment.method === "cod" &&
                      "Thanh toán khi nhận hàng (COD)"}
                    {order.payment.method === "bank" &&
                      "Chuyển khoản ngân hàng"}
                    {order.payment.method === "card" &&
                      "Thanh toán thẻ tín dụng/ghi nợ"}
                  </p> */}
                  {/* <p>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {getOrderStatusBadge(order.status)}
                  </p> */}
                </div>
              </div>
              <div>
                {/* <h3 className="font-medium text-gray-800 mb-2">Ghi chú</h3> */}
                {/* <p className="text-sm">
                  {order.shipping.notes || "Không có ghi chú"}
                </p> */}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Chi tiết sản phẩm
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Sản phẩm
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Số lượng
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                      >
                        Đơn giá
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                      >
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-12 h-12">
                              <img
                                className="w-full h-full object-cover rounded"
                                src={item?.product?.images[0].fileUri || APP_INFO.NO_IAMGE_AVAILABLE}
                                alt={item?.product?.name}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">
                                {item?.product?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Mã SP: {item?.product?.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm text-gray-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm text-gray-800">
                            {item?.product?.sellingPrice.toLocaleString()} đ
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-gray-800">
                            {(item?.product?.sellingPrice * item.quantity).toLocaleString()} đ
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{order.totalAmount.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span>0 đ</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {order.totalAmount.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between print:hidden">
            <Link to="/profile" state={{ tab: "orders" }}>
              <Button variant="outline" icon={FaArrowLeft}>
                Quay lại
              </Button>
            </Link>
            <Link to="/products/category/all">
              <Button variant="primary">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer className="print:hidden" />
    </>
  );
};

export default OrderDetail;
