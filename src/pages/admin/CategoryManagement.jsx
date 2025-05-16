import { useEffect, useState } from "react";
import { Table, Input, Space, Modal } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaPlus } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { getCategories, createCategory, updateCategory } from "../../services/categoryService";
import { toast } from "react-toastify";

const { Search } = Input;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formName, setFormName] = useState("");

    const user = useSelector((state) => state.auth.user);
    useCheckAdminAuth(user);

    useEffect(() => {
        fetchCategories();
    }, [currentPage, pageSize]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response);
            setTotalElements(response.length);
        } catch (error) {
            console.error("Fetch error:", error);
            setCategories([]);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormName(category.name);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setFormName("");
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        if (!formName.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formName);
                toast.success("Cập nhật danh mục thành công");
            } else {
                await createCategory(formName);
                toast.success("Thêm danh mục thành công");
            }
            setIsModalVisible(false);
            fetchCategories();
        } catch {
            toast.error("Có lỗi xảy ra");
        }
    };

    const filtered = categories.filter(
        (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Hành động",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button
                        variant="outline"
                        size="mini"
                        icon={FaEdit}
                        onClick={() => handleEdit(record)}
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý danh mục sản phẩm</h1>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        icon={FaPlus}
                        className="w-full md:w-auto"
                    >
                        Thêm danh mục
                    </Button>
                </div>

                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <Search
                        placeholder="Nhập tên danh mục để tìm kiếm"
                        onSearch={(value) => setSearchTerm(value)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', maxWidth: '300px' }}
                        allowClear
                    />
                    <p className="text-gray-600 text-sm sm:text-base ml-auto">Tổng số: {totalElements} danh mục</p>
                </div>
                <div className="overflow-auto h-[calc(100vh-10rem)]">
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
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
                            responsive: true,
                        }}
                    />
                </div>

                <Modal
                    title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={() => setIsModalVisible(false)}
                    width="90%"
                    style={{ maxWidth: '500px' }}
                >
                    <Input
                        placeholder="Nhập tên danh mục"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        size="large"
                    />
                </Modal>
            </div>
        </div>
    );
};

export default CategoryManagement; 