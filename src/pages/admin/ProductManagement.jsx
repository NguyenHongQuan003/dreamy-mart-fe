import { useEffect, useState } from "react";
import { Table, Input, Space, Image } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts, getProductById } from "../../services/productService";
import AdminNavbar from "./AdminNavbar";
import ProductDetailModal from "../../components/ProductDetailModal";

const { Search } = Input;

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo) navigate("/admin/login");
    };

    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data);
        const uniqueCategories = [
          ...new Set(response.data.map((p) => p.category.name)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    checkAdminAuth();
    fetchProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch {
        setProducts(products.filter((p) => p.id !== id));
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
      render: (_, record) => (
        <Space>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleViewProduct(record.id)}
            icon={FaEye}
          >
            {""}
          </Button>

          <Button
            variant="outline"
            size="small"
            icon={FaEdit}
            onClick={() => navigate(`/admin/products/edit/${record.id}`)}
          >
            {""}
          </Button>

          <Button
            variant="danger"
            size="small"
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
            <p className="text-gray-600">Tổng số: {filtered.length} sản phẩm</p>
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
            placeholder="Tìm kiếm sản phẩm"
            onSearch={(value) => setSearchTerm(value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 300 }}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />

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
