import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaHome,
  FaArrowLeft,
  FaPrint,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/app.constants";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tìm kiếm đơn hàng trong localStorage
    const fetchOrderDetails = () => {
      setLoading(true);
      try {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const foundOrder = orders.find((order) => order.id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        }

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
      month: "long",
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chi tiết đơn hàng #{order.id}
              </h1>
              <div className="text-sm breadcrumbs text-gray-500 mt-1">
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
              <Button variant="outline" icon={FaDownload}>
                Tải xuống PDF
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print:shadow-none">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Đơn hàng hoàn tất</h2>
                    <p className="text-sm text-gray-500">
                      Cảm ơn bạn đã mua hàng!
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium">{formatDate(order.date)}</p>
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
                    {order.shipping.fullName}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Email:</span>{" "}
                    {order.shipping.email}
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    {order.shipping.phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Địa chỉ giao hàng
                </h3>
                <div className="text-sm">
                  <p className="mb-1">{order.shipping.address}</p>
                  <p className="mb-1">
                    {order.shipping.ward}, {order.shipping.district}
                  </p>
                  <p>{order.shipping.city}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Phương thức thanh toán
                </h3>
                <div className="text-sm">
                  <p className="mb-1">
                    {order.payment.method === "cod" &&
                      "Thanh toán khi nhận hàng (COD)"}
                    {order.payment.method === "bank" &&
                      "Chuyển khoản ngân hàng"}
                    {order.payment.method === "card" &&
                      "Thanh toán thẻ tín dụng/ghi nợ"}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {order.payment.status || "Chưa thanh toán"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Ghi chú</h3>
                <p className="text-sm">
                  {order.shipping.notes || "Không có ghi chú"}
                </p>
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
                                src={item.image || APP_INFO.NO_IAMGE_AVAILABLE}
                                alt={item.productName}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Mã SP: {item.id}
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
                            {item.price.toLocaleString()} đ
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-gray-800">
                            {(item.price * item.quantity).toLocaleString()} đ
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
                    <span>{order.total.toLocaleString()} đ</span>
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
                      {order.total.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between print:hidden">
            <Link to="/profile">
              <Button variant="outline" icon={FaArrowLeft}>
                Quay lại
              </Button>
            </Link>
            <Link to="/">
              <Button variant="primary">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
