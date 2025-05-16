import { useEffect, useState } from "react";
import { Table, Input, Space, Modal, DatePicker, Select, Row, Col, InputNumber } from "antd";
import Button from "../../components/common/Button";
import { FaCheckCircle, FaClipboardCheck, FaClipboardList, FaExclamationTriangle, FaEye, FaFilter, FaRedo, FaRegClock, FaShippingFast, FaTimesCircle } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { getAllOrders, searchOrders, filterOrders } from "../../services/orderService";
const { Search } = Input;
const { RangePicker } = DatePicker;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterParams, setFilterParams] = useState({
    customerName: null,
    customerPhone: null,
    customerEmail: null,
    orderStatus: null,
    minTotalPrice: null,
    maxTotalPrice: null,
    startDate: null,
    endDate: null
  });

  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // nếu có ô tìm kiếm


  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders(currentPage, pageSize);
      // console.log(response);
      if (response.code === 1000) {
        setOrders(response.result.data);
        setTotalElements(response.result.totalElements);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      setIsSearching(true);
      setIsFiltering(false);
      setSearchKeyword(value);

      if (value.trim() === "") {
        setIsSearching(false);
        await fetchOrders();
        return;
      }

      const response = await searchOrders(value, currentPage, pageSize);
      if (response.code === 1000) {
        setOrders(response.result.data);
        setTotalElements(response.result.totalElements);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      setIsFiltering(true);
      setIsSearching(false);
      setSearchKeyword(""); // reset nếu cần

      const response = await filterOrders(
        filterParams.customerName,
        filterParams.customerPhone,
        filterParams.customerEmail,
        currentPage,
        pageSize,
        filterParams.orderStatus,
        filterParams.minTotalPrice,
        filterParams.maxTotalPrice,
        filterParams.startDate,
        filterParams.endDate
      );

      if (response.code === 1000) {
        setOrders(response.result.data);
        setTotalElements(response.result.totalElements);
      }
    } catch (error) {
      console.error("Filter error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching) {
      handleSearch(searchKeyword);
    } else if (isFiltering) {
      handleFilter();
    } else {
      fetchOrders();
    }
  }, [currentPage, pageSize]);

  const handleFilterChange = (key, value) => {
    setFilterParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFilterParams(prev => ({
        ...prev,
        startDate: dates[0]?.format('YYYY-MM-DD'),
        endDate: dates[1]?.format('YYYY-MM-DD')
      }));
    } else {
      setFilterParams(prev => ({
        ...prev,
        startDate: null,
        endDate: null
      }));
    }
  };


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
    { value: 'INVENTORY_COMPLETED', label: 'Đã xuất kho' },
    { value: 'INVENTORY_FAILED', label: 'Lỗi xuất kho' },
    { value: 'INVENTORY_PROCESSING', label: 'Đang xuất kho' },
    { value: 'ORDER_CANCELLED', label: 'Đơn bị hủy' },
    { value: 'ORDER_COMPLETED', label: 'Đơn hoàn tất' },
    { value: 'ORDER_CREATED', label: 'Đơn mới' },
    { value: 'PAYMENT_COMPLETED', label: 'Đã thanh toán' },
    { value: 'PAYMENT_FAILED', label: 'Thanh toán thất bại' },
    { value: 'PAYMENT_PROCESSING', label: 'Đang thanh toán' },
    { value: 'PAYMENT_REFUND_COMPLETED', label: 'Đã hoàn tiền' },
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
        label: "Đang kiểm kho",
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
      render: (id) => id
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["user", "fullName"],
      key: "user",
      sorter: (a, b) => a.user.fullName.localeCompare(b.user.fullName),
      render: (_, record) => (
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }}
          title={record.user.fullName}
        >
          {record.user.fullName}
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: ["user", "phone"],
      key: "phone",
      align: "right",
      sorter: (a, b) => a.user.phone.localeCompare(b.user.phone),
      render: (_, record) => record.user.phone
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      align: "right",
      sorter: (a, b) => a.user.email.localeCompare(b.user.email),
      render: (_, record) => record.user.email
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      sorter: (a, b) => a.shippingAddress.localeCompare(b.shippingAddress),
      render: (address) => (
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '350px'
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
      align: "right",
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
      align: "center",
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

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />
      <div className="flex-1 p-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          </div>
        </div>

        <div className="mb-4 space-y-4">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <div className="flex items-center gap-2">
                <Search
                  placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại"
                  onSearch={handleSearch}
                  className="flex-1"
                  allowClear
                />
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => setIsFilterModalVisible(true)}
                  className="flex items-center"
                >
                  <FaFilter className="mr-2" /> Lọc
                </Button>
              </div>
            </Col>

            <Col xs={24} md={12} className="text-right">
              <p className="text-gray-600 text-sm sm:text-base">
                Tổng số: {totalElements} đơn hàng
              </p>
            </Col>
          </Row>

        </div>

        <div className="overflow-auto h-[calc(100vh-12rem)]">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalElements,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
              responsive: true,
            }}
          />
        </div>

        <Modal
          title={<span className="text-lg font-bold">Chi tiết đơn hàng</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width="90%"
          style={{ maxWidth: '800px' }}
        >
          {selectedOrder && (
            <div className="space-y-6 text-sm text-gray-700">
              {/* Thông tin đơn hàng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-gray-500 font-medium">Mã đơn hàng:</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Ngày đặt:</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedOrder.orderDate)}</p>
                </div>
              </div>

              {/* Thông tin người đặt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-gray-500 font-medium">Tên khách hàng:</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.user.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Số điện thoại:</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.user.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Email:</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Giới tính:</p>
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.user.gender ? "Nam" : "Nữ"}
                  </p>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 font-medium">Địa chỉ giao hàng:</p>
                <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-500 font-medium mb-2">Sản phẩm:</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b pb-2">
                      <img
                        src={item.product.images[0]?.fileUri}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                        <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p>
                        <p className="text-gray-500 text-sm">Đơn giá: {item.price.toLocaleString("vi-VN")} đ</p>
                      </div>
                      <div className="text-right font-semibold text-gray-800">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền & Trạng thái */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-gray-500 font-medium">Tổng tiền:</p>
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.totalAmount.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Trạng thái:</p>
                  <div className="mt-1">{getOrderStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title={<span className="text-lg font-bold">Lọc đơn hàng</span>}
          open={isFilterModalVisible}
          onCancel={() => setIsFilterModalVisible(false)}
          footer={[
            <>
              <div className="flex justify-end gap-1">
                <Button
                  key="reset"
                  variant="outline"
                  onClick={() => {
                    setFilterParams({
                      customerName: null,
                      customerPhone: null,
                      customerEmail: null,
                      orderStatus: null,
                      minTotalPrice: null,
                      maxTotalPrice: null,
                      startDate: null,
                      endDate: null
                    });
                  }}
                >
                  Đặt lại
                </Button>
                <Button
                  key="cancel"
                  variant="outline"
                  onClick={() => setIsFilterModalVisible(false)}
                >
                  Hủy
                </Button>
                <Button
                  key="submit"
                  variant="primary"
                  onClick={() => {
                    handleFilter();
                    setIsFilterModalVisible(false);
                  }}
                  className="bg-blue-600 text-white"
                >
                  Áp dụng
                </Button>
              </div>
            </>
          ]}
          width="90%"
          style={{ maxWidth: '600px' }}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên khách hàng
              </label>
              <Input
                placeholder="Tìm kiếm theo tên khách hàng"
                value={filterParams.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <Input
                placeholder="Tìm kiếm theo số điện thoại"
                value={filterParams.customerPhone}
                onChange={(e) => handleFilterChange('customerPhone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                placeholder="Tìm kiếm theo email"
                value={filterParams.customerEmail}
                onChange={(e) => handleFilterChange('customerEmail', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái đơn hàng
              </label>
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: '100%' }}
                allowClear
                value={filterParams.orderStatus}
                onChange={(value) => handleFilterChange('orderStatus', value)}
                options={deliveryStatusOptions.map(option => ({ label: option.label, value: option.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá
              </label>
              <div className="grid grid-cols-2 gap-4">
                <InputNumber
                  placeholder="Giá tối thiểu"
                  style={{ width: '100%' }}
                  value={filterParams.minTotalPrice}
                  onChange={(value) => handleFilterChange('minTotalPrice', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  allowClear
                />
                <InputNumber
                  placeholder="Giá tối đa"
                  style={{ width: '100%' }}
                  value={filterParams.maxTotalPrice}
                  onChange={(value) => handleFilterChange('maxTotalPrice', value)}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  allowClear
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng thời gian
              </label>
              <RangePicker
                onChange={handleDateRangeChange}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default OrderManagement;
