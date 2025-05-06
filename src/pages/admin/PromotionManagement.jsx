import { useEffect, useState } from "react";
import { Table, Input, Space, Modal } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { getAllPromotions, getPromotionById } from "../../services/promotionService";
import { toast } from "react-toastify";
const { Search } = Input;

const PromotionManagement = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const user = useSelector((state) => state.auth.user);
    useCheckAdminAuth(user);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await getAllPromotions();
                console.log(response.result);
                setPromotions(response.result);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchPromotions();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
            try {
                toast.success(`Xóa khuyến mãi ${id} thành công`);
                // await deleteProduct(id);
                // setPromotions(promotions.filter((p) => p.id !== id));
            } catch {
                // setPromotions(promotions.filter((p) => p.id !== id));
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

    const filtered = promotions.filter(
        (p) =>
            p.promotionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id.localeCompare(b.id),
            render: (id) => id,
        },
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
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            sorter: (a, b) => a.description.localeCompare(b.description),
            render: (description) => (
                <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px'
                }}
                    title={description}
                >
                    {description}
                </div>
            ),
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
            title: "Giá trị đơn hàng tối thiểu",
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
            sorter: (a, b) => a.startDate - b.startDate,
            render: (startDate) => formatDate(startDate),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            sorter: (a, b) => a.endDate - b.endDate,
            render: (endDate) => formatDate(endDate),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            sorter: (a, b) => a.isActive.localeCompare(b.isActive),
            render: (isActive) => isActive ? "Hoạt động" : "Không hoạt động",
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
                        onClick={() => handleDelete(record.couponCode)}
                        icon={FaTrash}
                    >
                        {""}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminNavbar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
                    </div>
                    <Link
                        to="/admin/promotions/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    >
                        <FaPlus className="mr-2" /> Thêm khuyến mãi
                    </Link>
                </div>

                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <Search
                        placeholder="Nhập tên khuyến mãi để tìm kiếm"
                        onSearch={(value) => setSearchTerm(value)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: 300 }}
                        allowClear
                    />
                    <p className="text-gray-600 ml-auto">Tổng số: {filtered.length} khuyến mãi</p>
                </div>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 9 }}
                />

                <Modal
                    title="🎁 Chi tiết khuyến mãi"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={700}
                >
                    {selectedPromotion && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-2 gap-4">
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
