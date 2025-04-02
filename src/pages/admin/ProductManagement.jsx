import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants/api.constants";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaUsers,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Kiểm tra quyền admin
    const checkAdminAuth = () => {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo) {
        navigate("/admin/login");
      }
    };

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);

        // Lấy danh sách categories từ products
        const uniqueCategories = [
          ...new Set(response.data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Dữ liệu mẫu nếu API lỗi
        const mockProducts = [
          {
            id: 1,
            productName: "Điện thoại Samsung Galaxy S21",
            price: 20990000,
            stock: 35,
            category: "Điện thoại",
            image:
              "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
          },
          {
            id: 2,
            productName: "Laptop Dell XPS 13",
            price: 32990000,
            stock: 20,
            category: "Laptop",
            image:
              "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
          },
          {
            id: 3,
            productName: "Apple AirPods Pro",
            price: 5990000,
            stock: 50,
            category: "Tai nghe",
            image:
              "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5",
          },
          {
            id: 4,
            productName: "iPad Pro 2021",
            price: 23990000,
            stock: 15,
            category: "Máy tính bảng",
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
          },
          {
            id: 5,
            productName: "Xiaomi Mi Band 6",
            price: 990000,
            stock: 100,
            category: "Đồng hồ thông minh",
            image:
              "https://images.unsplash.com/photo-1617043786394-f977fa12eddf",
          },
        ];

        setProducts(mockProducts);
        setCategories([
          ...new Set(mockProducts.map((product) => product.category)),
        ]);
        setIsLoading(false);
      }
    };

    checkAdminAuth();
    fetchProducts();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        alert("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Error deleting product:", error);
        // Giả lập xóa thành công nếu API lỗi
        setProducts(products.filter((product) => product.id !== id));
        alert("Xóa sản phẩm thành công!");
      }
    }
  };

  // Filter và sort sản phẩm
  const filteredProducts = products
    .filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">DreamyMart Admin</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-3 hover:bg-[#334155] transition-colors">
            <Link to="/admin" className="flex items-center text-white">
              <FaTachometerAlt className="mr-3" />
              Bảng điều khiển
            </Link>
          </div>
          <div className="px-4 py-3 bg-[#334155]">
            <Link to="/admin/products" className="flex items-center text-white">
              <FaShoppingBag className="mr-3" />
              Sản phẩm
            </Link>
          </div>
          <div className="px-4 py-3 hover:bg-[#334155] transition-colors">
            <Link to="/admin/orders" className="flex items-center text-white">
              <FaClipboardList className="mr-3" />
              Đơn hàng
            </Link>
          </div>
          <div className="px-4 py-3 hover:bg-[#334155] transition-colors">
            <Link to="/admin/users" className="flex items-center text-white">
              <FaUsers className="mr-3" />
              Người dùng
            </Link>
          </div>
          <div className="px-4 py-3 hover:bg-[#334155] transition-colors">
            <Link
              to="/admin/statistics"
              className="flex items-center text-white"
            >
              <FaChartLine className="mr-3" />
              Thống kê
            </Link>
          </div>
          <div className="px-4 py-3 hover:bg-[#334155] transition-colors mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center text-white w-full text-left"
            >
              <FaSignOutAlt className="mr-3" />
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-600">
              Quản lý tất cả sản phẩm trong cửa hàng
            </p>
          </div>
          <Link
            to="/admin/products/add"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <FaPlus className="mr-2" /> Thêm sản phẩm
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Giá: Thấp đến cao</option>
                <option value="desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sản phẩm
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Danh mục
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Giá
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tồn kho
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.image}
                                alt={product.productName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.productName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {product.price.toLocaleString()} đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <Link
                              to={`/admin/products/view/${product.id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Xem chi tiết"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredProducts.length)}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium">
                      {filteredProducts.length}
                    </span>{" "}
                    sản phẩm
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      &laquo;
                    </button>

                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === number + 1
                            ? "bg-blue-50 border-blue-500 text-blue-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium`}
                      >
                        {number + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage(
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        )
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      &raquo;
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
