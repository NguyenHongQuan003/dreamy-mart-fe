import { useEffect, useState } from "react";
import { Table, Input, Space, Modal, Select } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { deletePromotion, getAllPromotions, getPromotionById, searchPromotion } from "../../services/promotionService";
import { toast } from "react-toastify";
const { Search } = Input;

const PromotionManagement = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState(null);

    const user = useSelector((state) => state.auth.user);
    useCheckAdminAuth(user);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const response = await getAllPromotions(currentPage, pageSize);
            if (response.code === 1000) {
                setPromotions(response.result.data);
                setTotalElements(response.result.totalElements);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setPromotions([]);
            toast.error("Không thể tải danh sách khuyến mãi!");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (value) => {
        try {
            setLoading(true);
            if (value.trim() === "") {
                await fetchPromotions();
                return;
            }
            const response = await searchPromotion(value, currentPage, pageSize);
            if (response.code === 1000) {
                setPromotions(response.result.data);
                setTotalElements(response.result.totalElements);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Tìm kiếm khuyến mãi thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (value) => {
        setFilterStatus(value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchPromotions();
    }, [currentPage, pageSize]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
            try {
                await deletePromotion(id);
                toast.success(`Xóa khuyến mãi ${id} thành công`);
                setPromotions(promotions.filter((p) => p.id !== id));
            } catch {
                toast.error("Xóa khuyến mãi thất bại");
            }
        }
    };

    const handleViewPromotion = async (id) => {
        try {
            const response = await getPromotionById(id);
            setSelectedPromotion(response.result);
            setIsModalVisible(true);
        } catch (error) {
            toast.error("Không thể tải thông tin khuyến mãi!");
            console.error(error);
        }
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

    const formatCurrency = (amount) => {
        return amount.toLocaleString() + " đ";
    };

    const columns = [
        {
            title: "Mã khuyến mãi",
            dataIndex: "couponCode",
            key: "couponCode",
            sorter: (a, b) => a.couponCode.localeCompare(b.couponCode),
            align: "right",
            render: (couponCode, record) => (
                <div
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: record.isActive ? '#d4edda' : '#f8d7da',
                        color: record.isActive ? '#155724' : '#721c24',
                        display: 'inline-block',
                        fontWeight: 'bold'
                    }}
                >
                    {couponCode}
                </div>
            ),
        },
        {
            title: "Tên khuyến mãi",
            dataIndex: "promotionName",
            key: "promotionName",
            sorter: (a, b) => a.promotionName.localeCompare(b.promotionName),
        },
        {
            title: "Tỷ lệ giảm",
            dataIndex: "discountPercent",
            key: "discountPercent",
            align: "right",
            sorter: (a, b) => a.discountPercent - b.discountPercent,
            render: (discountPercent) => `${discountPercent}%`,
        },
        {
            title: "Giá trị giảm",
            dataIndex: "discountAmount",
            key: "discountAmount",
            align: "right",
            sorter: (a, b) => a.discountAmount - b.discountAmount,
            render: (discountAmount) => `${discountAmount.toLocaleString()} đ`,
        },
        {
            title: "Giá tối thiểu",
            dataIndex: "minimumOrderValue",
            key: "minimumOrderValue",
            align: "right",
            sorter: (a, b) => a.minimumOrderValue - b.minimumOrderValue,
            render: (minimumOrderValue) => `${minimumOrderValue.toLocaleString()} đ`,
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            render: (startDate) => formatDate(startDate),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
            render: (endDate) => formatDate(endDate),
        },
        {
            title: "Phạm vi áp dụng",
            dataIndex: "isGlobal",
            key: "isGlobal",
            render: (isGlobal) => (
                <span className={`inline-flex items-center gap-1 rounded-full  px-3 py-1 text-xs font-semibold 
                    ${isGlobal ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {isGlobal ? "🌍 Toàn bộ" : "👤 Cá nhân"}
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => (
                <span className={`inline-flex items-center  gap-1 rounded-full px-3 py-1 text-xs font-semibold 
                    ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {isActive ? "✅ Hoạt động" : "❌ Không hoạt động"}
                </span>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        variant="secondary"
                        size="mini"
                        onClick={() => handleViewPromotion(record.id)}
                        icon={FaEye}
                    >
                        {""}
                    </Button>
                    <Button
                        variant="outline"
                        size="mini"
                        icon={FaEdit}
                        onClick={() => navigate(`/admin/promotions/edit/${record.id}`)}
                    >
                        {""}
                    </Button>
                    <Button
                        variant="danger"
                        size="mini"
                        onClick={() => handleDelete(record.id)}
                        icon={FaTrash}
                    >
                        {""}
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredPromotions = filterStatus !== null
        ? promotions.filter(p => p.isActive === filterStatus)
        : promotions;

    return (
        <div className="min-h-screen flex">
            <AdminNavbar />
            <div className="flex-1 p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
                    <Link
                        to="/admin/promotions/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center w-full md:w-auto"
                    >
                        <FaPlus className="mr-2" /> Thêm khuyến mãi
                    </Link>
                </div>

                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <Search
                            placeholder="Tìm kiếm theo tên khuyến mãi hoặc mã khuyến mãi"
                            onSearch={handleSearch}
                            style={{ width: '100%', maxWidth: '300px' }}
                            allowClear
                        />
                        <Select
                            placeholder="Lọc theo trạng thái"
                            style={{ width: '100%', maxWidth: '200px' }}
                            allowClear
                            onChange={handleStatusChange}
                            options={[
                                { value: true, label: "Hoạt động" },
                                { value: false, label: "Không hoạt động" }
                            ]}
                        />
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Tổng số: {totalElements} khuyến mãi</p>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredPromotions}
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
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khuyến mãi`,
                        responsive: true,
                    }}
                />

                <Modal
                    title={<span className="text-lg font-bold">🎁 Chi tiết khuyến mãi</span>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width="90%"
                    style={{ maxWidth: '700px' }}
                >
                    {selectedPromotion && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 font-medium">Tên khuyến mãi:</p>
                                    <p className="font-semibold text-base text-blue-600">{selectedPromotion.promotionName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">Mã khuyến mãi:</p>
                                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                        ${selectedPromotion.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {selectedPromotion.couponCode}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 font-medium">Mô tả:</p>
                                <p className="whitespace-pre-wrap text-gray-800">{selectedPromotion.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 font-medium">Tỷ lệ giảm giá:</p>
                                    <p className="text-blue-700 font-semibold">{selectedPromotion.discountPercent}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">Số tiền giảm:</p>
                                    <p className="text-blue-700 font-semibold">{formatCurrency(selectedPromotion.discountAmount)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 font-medium">Giá trị đơn hàng tối thiểu:</p>
                                <p className="text-blue-700 font-semibold">{formatCurrency(selectedPromotion.minimumOrderValue)}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 font-medium">Ngày bắt đầu:</p>
                                    <p>{formatDate(selectedPromotion.startDate)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">Ngày kết thúc:</p>
                                    <p>{formatDate(selectedPromotion.endDate)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 font-medium">Trạng thái:</p>
                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold 
                    ${selectedPromotion.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {selectedPromotion.isActive ? "✅ Hoạt động" : "❌ Không hoạt động"}
                                </span>
                            </div>
                        </div>
                    )}
                </Modal>

            </div>
        </div>
    );
};

export default PromotionManagement;
