import { useEffect, useState } from "react";
import { Table, Input, Space } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { getAllPromotions } from "../../services/promotionService";
import { toast } from "react-toastify";
const { Search } = Input;

const PromotionManagement = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // const [selectedPromotion, setSelectedPromotion] = useState(null);
    // const [modalVisible, setModalVisible] = useState(false);

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
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                toast.success(`Xóa khuyến mãi ${id} thành công`);
                // await deleteProduct(id);
                // setPromotions(promotions.filter((p) => p.id !== id));
            } catch {
                // setPromotions(promotions.filter((p) => p.id !== id));
            }
        }
    };


    const filtered = promotions.filter(
        (p) =>
            p.promotionName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            render: (couponCode) => couponCode,
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
                        variant="outline"
                        size="mini"
                        icon={FaEdit}
                        onClick={() => navigate(`/admin/products/edit/${record.id}`)}
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
                        to="/admin/products/add"
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
                    pagination={{ pageSize: 7 }}
                />

                {/* <ProductDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    product={selectedProduct}
                /> */}
            </div>
        </div>
    );
};

export default PromotionManagement;
