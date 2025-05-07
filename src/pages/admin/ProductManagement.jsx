import { useEffect, useState } from "react";
import { Table, Input, Space, Image } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts, getProductById } from "../../services/productService";
import AdminNavbar from "./AdminNavbar";
import ProductDetailModal from "../../components/ProductDetailModal";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Search } = Input;

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalElements, setTotalElements] = useState(0);

  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(currentPage, pageSize);
        setProducts(response.data);
        setTotalElements(response.totalElements);
        const uniqueCategories = [
          ...new Set(response.data.map((p) => p.category.name)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        toast.success("Xóa sản phẩm thành công");
        setProducts(products.filter((p) => p.id !== id));
      } catch {
        toast.error("Xóa sản phẩm thất bại");
      }
    }
  };

  const handleViewProduct = async (id) => {
    try {
      const response = await getProductById(id);
      setSelectedProduct(response);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || p.category.name === selectedCategory)
  );

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={record.images?.[0]?.fileUri}
              alt={text}
              preview={true}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          </div>

          <span>
            <div className="font-semibold">{text}</div>
            <div className="text-gray-500 text-sm">ID: {record.id}</div>
          </span>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      key: "category",
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category.name === value,
    },
    {
      title: "Giá bán",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      sorter: (a, b) => a.sellingPrice - b.sellingPrice,
      align: "right",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Giá gốc",
      dataIndex: "costPrice",
      key: "costPrice",
      sorter: (a, b) => a.costPrice - b.costPrice,
      align: "right",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      sorter: (a, b) => a.quantity - b.quantity,
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
            onClick={() => handleViewProduct(record.id)}
            icon={FaEye}
          >
            {""}
          </Button>

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
            onClick={() => handleDelete(record.id)}
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
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          </div>
          <Link
            to="/admin/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Thêm sản phẩm
          </Link>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Nhập tên sản phẩm để tìm kiếm"
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
          <p className="text-gray-600 ml-auto">Tổng số: {totalElements} sản phẩm</p>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-12rem)]">
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
        </div>

        <ProductDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
