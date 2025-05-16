import { useCallback, useEffect, useState } from "react";
import { Table, Input, Space, Image, Select, InputNumber, Row, Col, Modal } from "antd";
import Button from "../../components/common/Button";
import { FaEdit, FaEye, FaPlus, FaTrash, FaFilter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts, getProductById, searchProducts, filterProducts } from "../../services/productService";
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    brand: null,
    minPrice: null,
    maxPrice: null,
    name: ""
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllProducts(currentPage, pageSize);
      setProducts(response.data);
      setTotalElements(response.totalElements);
      const uniqueCategories = [
        ...new Set(response.data.map((p) => p.category.name)),
      ];
      setCategories(uniqueCategories);
      const uniqueBrands = [...new Set(response.data.map((p) => p.brand))];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleSearch = async (value) => {
    try {
      setLoading(true);
      if (value.trim() === "") {
        await fetchProducts();
        return;
      }
      const response = await searchProducts(value, currentPage, pageSize);
      setProducts(response.data);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await filterProducts(
        filters.brand,
        filters.minPrice,
        filters.maxPrice,
        currentPage,
        pageSize,
        filters.name
      );
      console.log(response.result.data);
      setProducts(response.result.data);
      setTotalElements(response.result.totalElements);
    } catch (error) {
      console.error("Filter error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    <div className="min-h-screen flex">
      <AdminNavbar />
      <div className="flex-1 p-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <div className="flex gap-4">
            <Link
              to="/admin/products/add"
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Thêm sản phẩm
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            {/* Cột Search + Lọc bên trái */}
            <Col xs={24} sm={12} md={12}>
              <div className="flex items-center gap-2">
                <Search
                  placeholder="Nhập tên sản phẩm"
                  onSearch={handleSearch}
                  allowClear
                  className="flex-1"
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

            {/* Cột tổng sản phẩm bên phải */}
            <Col xs={24} sm={12} md={12} className="text-right">
              <p className="text-gray-600 text-sm sm:text-base">
                Tổng số: {totalElements} sản phẩm
              </p>
            </Col>
          </Row>

        </div>


        <div className="overflow-auto h-[calc(100vh-10rem)]">
          <Table
            columns={columns}
            dataSource={products}
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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
              responsive: true,
            }}
          />
        </div>


        <ProductDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          product={selectedProduct}
        />

        <Modal
          title={<span className="text-lg font-bold">Lọc sản phẩm</span>}
          open={isFilterModalVisible}
          onCancel={() => setIsFilterModalVisible(false)}
          footer={[
            <>
              <div className="flex justify-end gap-1">
                <Button
                  key="reset"
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      brand: null,
                      minPrice: null,
                      maxPrice: null,
                      name: ""
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
            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <Input
                placeholder="Nhập tên sản phẩm"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>

            {/* Thương hiệu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thương hiệu
              </label>
              <Select
                placeholder="Chọn thương hiệu"
                style={{ width: '100%' }}
                allowClear
                value={filters.brand}
                onChange={(value) => handleFilterChange('brand', value)}
                options={brands.map(brand => ({ label: brand, value: brand }))}
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
                  value={filters.minPrice}
                  onChange={(value) => handleFilterChange('minPrice', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
                <InputNumber
                  placeholder="Giá tối đa"
                  style={{ width: '100%' }}
                  value={filters.maxPrice}
                  onChange={(value) => handleFilterChange('maxPrice', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProductManagement;
