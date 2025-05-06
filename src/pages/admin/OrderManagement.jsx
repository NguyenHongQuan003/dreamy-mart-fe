import { useEffect, useState } from "react";
import { Table, Input, Space, Modal } from "antd";
import Button from "../../components/common/Button";
import { FaCheckCircle, FaClipboardCheck, FaClipboardList, FaExclamationTriangle, FaEye, FaRedo, FaRegClock, FaShippingFast, FaTimesCircle } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { getAllOrders } from "../../services/orderService";
const { Search } = Input;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders(currentPage, pageSize);
        setOrders(response.result.data);
        setTotalElements(response.result.totalElements);
      } catch (error) {
        console.error("Fetch error:", error);
        // toast.error("Không thể tải danh sách đơn hàng!");
      }
    };

    fetchOrders();
  }, [currentPage, pageSize]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

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

  const deliveryStatusOptions = [
    { value: 'DELIVERY_COMPLETED', label: 'Giao thành công' },
    { value: 'DELIVERY_FAILED', label: 'Giao thất bại' },
    { value: 'DELIVERY_PROCESSING', label: 'Đang giao' },
    { value: 'INVENTORY_CHECKED', label: 'Đã kiểm kho' },
    { value: 'INVENTORY_COMPLETED', label: 'Hoàn tất kho' },
    { value: 'INVENTORY_FAILED', label: 'Lỗi kho' },
    { value: 'INVENTORY_PROCESSING', label: 'Đang kiểm kho' },
    { value: 'ORDER_CANCELLED', label: 'Đơn bị hủy' },
    { value: 'ORDER_COMPLETED', label: 'Hoàn tất đơn' },
    { value: 'ORDER_CREATED', label: 'Tạo đơn' },
    { value: 'PAYMENT_COMPLETED', label: 'Thanh toán thành công' },
    { value: 'PAYMENT_FAILED', label: 'Thanh toán thất bại' },
    { value: 'PAYMENT_PROCESSING', label: 'Đang thanh toán' },
    { value: 'PAYMENT_REFUND_COMPLETED', label: 'Hoàn tiền thành công' },
    { value: 'PAYMENT_REFUND_FAILED', label: 'Hoàn tiền thất bại' },
    { value: 'PAYMENT_REFUND_PROCESSING', label: 'Đang hoàn tiền' },
  ];

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
        label: "Đang xử lý thanh toán",
        icon: <FaRegClock className="mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
      },
      PAYMENT_REFUND_COMPLETED: {
        label: "Hoàn tiền thành công",
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
        label: "Xuất kho hoàn tất",
        icon: <FaClipboardList className="mr-1" />,
        color: "bg-blue-100 text-blue-800",
      },
      INVENTORY_FAILED: {
        label: "Lỗi kiểm kho",
        icon: <FaExclamationTriangle className="mr-1" />,
        color: "bg-red-100 text-red-800",
      },
      INVENTORY_PROCESSING: {
        label: "Đang xử lý kho",
        icon: <FaRegClock className="mr-1" />,
        color: "bg-gray-100 text-gray-800",
      },

      // Delivery
      DELIVERY_PROCESSING: {
        label: "Đang giao hàng",
        icon: <FaShippingFast className="mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
      },
      DELIVERY_COMPLETED: {
        label: "Giao hàng thành công",
        icon: <FaCheckCircle className="mr-1" />,
        color: "bg-green-100 text-green-800",
      },
      DELIVERY_FAILED: {
        label: "Giao hàng thất bại",
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
        label: "Hoàn tất đơn hàng",
        icon: <FaCheckCircle className="mr-1" />,
        color: "bg-green-100 text-green-800",
      },
      ORDER_CANCELLED: {
        label: "Đã hủy đơn hàng",
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

  const columns = [
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      render: (date) => formatDate(date),
      width: 170,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 200,
      render: (id) => (
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }}
          title={id}
        >
          {id}
        </div>
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId.localeCompare(b.userId),
      width: 200,
      render: (userId) => (
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }}
          title={userId}
        >
          {userId}
        </div>
      ),
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      sorter: (a, b) => a.shippingAddress.localeCompare(b.shippingAddress),
      width: 200,
      render: (address) => (
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }}
          title={address}
        >
          {address}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => amount.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getOrderStatusBadge(status),
      filters: deliveryStatusOptions.map(option => ({
        text: option.label,
        value: option.value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            variant="secondary"
            size="mini"
            onClick={() => handleViewOrder(record)}
            icon={FaEye}
          >
            {""}
          </Button>
        </Space>
      ),
    },
  ];

  const filtered = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminNavbar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo mã đơn hàng"
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
          <p className="text-gray-600 ml-auto">Tổng số: {totalElements} đơn hàng</p>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalElements,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />

        <Modal
          title={<span className="text-lg font-bold">📦 Chi tiết đơn hàng</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={720}
        >
          {selectedOrder && (
            <div className="space-y-6 text-sm text-gray-700">
              {/* Thông tin đơn hàng */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-gray-500 font-medium">Mã đơn hàng:</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Ngày đặt:</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedOrder.orderDate)}</p>
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 font-medium">Địa chỉ giao hàng:</p>
                <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Sản phẩm */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 font-medium mb-2">Sản phẩm:</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                        <p className="text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền và trạng thái */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-gray-500 font-medium">Tổng tiền:</p>
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.totalAmount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Trạng thái:</p>
                  <span className="flex items-center rounded-full text-xs">
                    {getOrderStatusBadge(selectedOrder.status)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrderManagement;
