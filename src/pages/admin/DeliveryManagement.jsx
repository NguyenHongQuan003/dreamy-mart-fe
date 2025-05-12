import { useEffect, useState } from "react";
import { Table, Input, Space, Modal, Select } from "antd";
import Button from "../../components/common/Button";
import { FaCheckCircle, FaClipboardCheck, FaClipboardList, FaExclamationTriangle, FaEye, FaRedo, FaRegClock, FaShippingFast, FaTimesCircle } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { getAllDelivery, getDeliveryById, updateDeliveryStatus } from "../../services/deliveryService";
import { toast } from "react-toastify";
const { Search } = Input;

const DeliveryManagement = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const user = useSelector((state) => state.auth.user);
    useCheckAdminAuth(user);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const response = await getAllDelivery();
                setDeliveries(response.result);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchDeliveries();
    }, []);

    const handleViewDelivery = async (id) => {
        try {
            const response = await getDeliveryById(id);
            setSelectedDelivery(response.result);
            setIsModalVisible(true);
        } catch (error) {
            toast.error("Không thể tải thông tin giao hàng!");
            console.error(error);
        }
    };

    const handleStatusChange = async (id, newStatus, orderId) => {
        try {
            if (window.confirm("Bạn có chắc chắn muốn cập nhật trạng thái giao hàng?")) {
                await updateDeliveryStatus(id, newStatus, orderId);
                toast.success("Cập nhật trạng thái thành công");
                setDeliveries(deliveries.map(d =>
                    d.id === id ? { ...d, shippingStatus: newStatus } : d
                ));
            }
        } catch (error) {
            console.error("Update status error:", error);
            toast.error("Không thể cập nhật trạng thái!");
        }
    };

    const formatDateFull = (dateString) => {
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("vi-VN", options);
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("vi-VN", options);
    };


    const deliveryStatusOptions = [
        { value: 'DELIVERY_COMPLETED', label: 'Giao thành công' },
        { value: 'DELIVERY_FAILED', label: 'Giao thất bại' },
        { value: 'DELIVERY_PROCESSING', label: 'Đang giao' },
        // { value: 'INVENTORY_CHECKED', label: 'Đã kiểm kho' },
        // { value: 'INVENTORY_COMPLETED', label: 'Hoàn tất kho' },
        // { value: 'INVENTORY_FAILED', label: 'Lỗi kho' },
        // { value: 'INVENTORY_PROCESSING', label: 'Đang kiểm kho' },
        // { value: 'ORDER_CANCELLED', label: 'Đơn bị hủy' },
        // { value: 'ORDER_COMPLETED', label: 'Hoàn tất đơn' },
        // { value: 'ORDER_CREATED', label: 'Tạo đơn' },
        // { value: 'PAYMENT_COMPLETED', label: 'Thanh toán thành công' },
        // { value: 'PAYMENT_FAILED', label: 'Thanh toán thất bại' },
        // { value: 'PAYMENT_PROCESSING', label: 'Đang thanh toán' },
        // { value: 'PAYMENT_REFUND_COMPLETED', label: 'Hoàn tiền thành công' },
        // { value: 'PAYMENT_REFUND_FAILED', label: 'Hoàn tiền thất bại' },
        // { value: 'PAYMENT_REFUND_PROCESSING', label: 'Đang hoàn tiền' },
    ];

    const getStatusText = (status) => {
        const map = {
            DELIVERY_COMPLETED: 'Giao thành công',
            DELIVERY_FAILED: 'Giao thất bại',
            DELIVERY_PROCESSING: 'Đang giao',
            INVENTORY_CHECKED: 'Đã kiểm kho',
            INVENTORY_COMPLETED: 'Hoàn tất kho',
            INVENTORY_FAILED: 'Lỗi kho',
            INVENTORY_PROCESSING: 'Đang kiểm kho',
            ORDER_CANCELLED: 'Đơn bị hủy',
            ORDER_COMPLETED: 'Hoàn tất đơn',
            ORDER_CREATED: 'Tạo đơn',
            PAYMENT_COMPLETED: 'Thanh toán thành công',
            PAYMENT_FAILED: 'Thanh toán thất bại',
            PAYMENT_PROCESSING: 'Đang thanh toán',
            PAYMENT_REFUND_COMPLETED: 'Hoàn tiền thành công',
            PAYMENT_REFUND_FAILED: 'Hoàn tiền thất bại',
            PAYMENT_REFUND_PROCESSING: 'Đang hoàn tiền',
        };
        return map[status] || status;
    };


    const filtered = deliveries.filter(
        (d) =>
            d.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "orderId",
            key: "orderId",
            sorter: (a, b) => a.orderId.localeCompare(b.orderId),
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
                    maxWidth: '200px'
                }}
                    title={address}
                >
                    {address}
                </div>
            ),
        },
        {
            title: "Phương thức",
            dataIndex: "shippingMethod",
            key: "shippingMethod",
            filters: [
                { text: 'Tiêu chuẩn', value: 'STANDARD' },
                { text: 'Nhanh', value: 'FAST' },
            ],
            onFilter: (value, record) => record.shippingMethod === value,
            render: (method) => method === 'STANDARD' ? 'Tiêu chuẩn' : method,
        },
        {
            title: "Ngày giao",
            dataIndex: "shippingDate",
            key: "shippingDate",
            sorter: (a, b) => new Date(a.shippingDate) - new Date(b.shippingDate),
            render: (date) => formatDate(date),
        },
        {
            title: "Trạng thái",
            dataIndex: "shippingStatus",
            key: "shippingStatus",
            filters: deliveryStatusOptions.map(status => ({
                text: getStatusText(status.value),
                value: status.value,
            })),
            onFilter: (value, record) => record.shippingStatus === value,
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 200 }}
                    onChange={(value) => handleStatusChange(record.id, value, record.orderId)}
                    options={deliveryStatusOptions}
                />
            ),
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
                        onClick={() => handleViewDelivery(record.id)}
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
                <div className="flex justify-between items-center mb-2">

                    <h1 className="text-3xl font-bold text-gray-800">Quản lý giao hàng</h1>

                </div>

                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <Search
                        placeholder="Tìm kiếm theo mã đơn hàng"
                        onSearch={(value) => setSearchTerm(value)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: 300 }}
                        allowClear
                    />
                    <p className="text-gray-600 text-sm sm:text-base ml-auto">Tổng số: {filtered.length} đơn giao hàng</p>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-10rem)]">
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn giao hàng`,
                            responsive: true,
                        }}
                    />
                </div>
                <Modal
                    title={<span className="text-lg font-bold">📦 Chi tiết đơn giao hàng</span>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={720}
                >
                    {selectedDelivery && (
                        <div className="space-y-6 text-sm text-gray-700">
                            {/* Thông tin đơn hàng */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div>
                                    <p className="text-gray-500 font-medium">Mã đơn hàng:</p>
                                    <p className="font-semibold text-gray-800">{selectedDelivery.orderId}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-gray-500 font-medium">ID giao hàng:</p>
                                    <p className="ml-1 font-semibold text-gray-800">{selectedDelivery.id}</p>
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-500 font-medium">Địa chỉ giao hàng:</p>
                                <p className="font-semibold text-gray-800">{selectedDelivery.shippingAddress}</p>
                            </div>

                            {/* Phương thức & Trạng thái */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div>
                                    <p className="text-gray-500 font-medium">Phương thức giao hàng:</p>
                                    <p className="font-semibold text-gray-800">
                                        {selectedDelivery.shippingMethod === 'STANDARD' ? 'Tiêu chuẩn' : selectedDelivery.shippingMethod}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">Trạng thái:</p>
                                    <span className="flex items-center rounded-full text-xs">
                                        {getOrderStatusBadge(selectedDelivery.shippingStatus)}
                                    </span>
                                </div>
                            </div>

                            {/* Ngày giờ */}
                            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div>
                                    <p className="text-gray-500 font-medium">Ngày giao:</p>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedDelivery.shippingDate)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">Ngày tạo:</p>
                                    <p className="font-semibold text-gray-800">{formatDateFull(selectedDelivery.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">Ngày cập nhật:</p>
                                    <p className="font-semibold text-gray-800">{formatDateFull(selectedDelivery.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

            </div>
        </div>
    );
};

export default DeliveryManagement; 