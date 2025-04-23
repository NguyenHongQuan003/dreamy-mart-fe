import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,

} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../constants/api.constants";
import AdminNavbar from "./AdminNavbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra quyền admin
    const checkAdminAuth = () => {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo) {
        navigate("/admin/login");
      }
    };

    // const fetchProducts = async () => {

    //   try {
    //     const response = await getAllProducts();
    //     console.log("Fetched products:", response);
    //     setProducts(response.data);
    //     setFilteredProducts(response.data);
    //   } catch (error) {
    //     console.error("Failed to fetch products", error);
    //   }
    // };
    // fetchProducts();

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Lấy thông tin users
        const usersResponse = await axios.get(`${API_URL}/users`);

        // Lấy thông tin products
        const productsResponse = await axios.get(`${API_URL}/products`);

        // Lấy thông tin orders
        const ordersResponse = await axios.get(`${API_URL}/orders`);

        // Tính tổng doanh thu
        let totalRevenue = 0;
        if (ordersResponse.data && ordersResponse.data.length > 0) {
          totalRevenue = ordersResponse.data.reduce((sum, order) => {
            return sum + (parseFloat(order.total) || 0);
          }, 0);
        } else {
          // Giả lập dữ liệu nếu không có đơn hàng
          const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
          totalRevenue = savedOrders.reduce((sum, order) => {
            return sum + (parseFloat(order.total) || 0);
          }, 0);
        }

        setStats({
          users: usersResponse.data.length,
          products: productsResponse.data.length,
          orders:
            ordersResponse.data.length ||
            JSON.parse(localStorage.getItem("orders"))?.length ||
            0,
          revenue: totalRevenue,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Dữ liệu mẫu nếu API lỗi
        setStats({
          users: 20,
          products: 150,
          orders: 75,
          revenue: 50000000,
        });
        setIsLoading(false);
      }
    };

    checkAdminAuth();
    fetchStats();
  }, [navigate]);


  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h1>
          <p className="text-gray-600">
            Chào mừng bạn đến với trang quản trị DreamyMart
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">
                      Người dùng
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats.users}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaShoppingBag className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">
                      Sản phẩm
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats.products}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaClipboardList className="text-purple-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">
                      Đơn hàng
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats.orders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full">
                    <FaChartLine className="text-red-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-gray-500">
                      Doanh thu
                    </h2>
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats.revenue.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hoạt động
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4">Đặt hàng #DM123456</td>
                      <td className="py-3 px-4">Nguyễn Văn A</td>
                      <td className="py-3 px-4">10:30 AM, 02/04/2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hoàn thành
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Đăng ký tài khoản mới</td>
                      <td className="py-3 px-4">Trần Thị B</td>
                      <td className="py-3 px-4">09:45 AM, 02/04/2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Mới
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Cập nhật sản phẩm</td>
                      <td className="py-3 px-4">Admin</td>
                      <td className="py-3 px-4">08:15 AM, 02/04/2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hoàn thành
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">
                        Đang xử lý đơn hàng #DM123455
                      </td>
                      <td className="py-3 px-4">Lê Văn C</td>
                      <td className="py-3 px-4">16:20 PM, 01/04/2023</td>
                      <td className="py-3 px-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Đang xử lý
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
