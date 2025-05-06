import { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";
import useCheckAdminAuth from "../../hook/useCheckAdminAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  // Dữ liệu mẫu cho biểu đồ doanh thu theo thời gian
  const revenueData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Doanh thu (triệu đồng)',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
      },
    ],
  };

  // Dữ liệu mẫu cho biểu đồ doanh thu theo danh mục
  const categoryRevenueData = {
    labels: ['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện', 'Khác'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu mẫu cho biểu đồ người dùng đăng ký theo tháng
  const userRegistrationData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        data: [150, 200, 180, 250, 220, 300, 280, 350, 320, 400, 380, 450],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(40, 159, 64, 0.8)',
          'rgba(210, 199, 199, 0.8)',
          'rgba(78, 52, 199, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(40, 159, 64, 1)',
          'rgba(210, 199, 199, 1)',
          'rgba(78, 52, 199, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu mẫu cho top sản phẩm bán chạy
  const topProducts = [
    { id: 1, name: 'iPhone 14 Pro Max', category: 'Điện thoại', sales: 150, revenue: 1500000000 },
    { id: 2, name: 'MacBook Pro M2', category: 'Laptop', sales: 120, revenue: 1200000000 },
    { id: 3, name: 'iPad Pro 12.9', category: 'Máy tính bảng', sales: 100, revenue: 1000000000 },
    { id: 4, name: 'AirPods Pro 2', category: 'Phụ kiện', sales: 200, revenue: 500000000 },
    { id: 5, name: 'Samsung Galaxy S23', category: 'Điện thoại', sales: 80, revenue: 800000000 },
  ];

  useEffect(() => {
    // Dữ liệu mẫu
    setStats({
      users: 20,
      products: 150,
      orders: 75,
      revenue: 50000000,
    });
    setIsLoading(false);
  }, []);

  return (
    // fix chiều cao mặc định
    <div className="bg-gray-100 flex">
      <AdminNavbar />

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
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
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
                    <div className="flex items-center text-green-500 text-sm mt-1">
                      <FaArrowUp className="mr-1" />
                      <span>12% so với tháng trước</span>
                    </div>
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
                    <div className="flex items-center text-green-500 text-sm mt-1">
                      <FaArrowUp className="mr-1" />
                      <span>8% so với tháng trước</span>
                    </div>
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
                    <div className="flex items-center text-red-500 text-sm mt-1">
                      <FaArrowDown className="mr-1" />
                      <span>3% so với tháng trước</span>
                    </div>
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
                    <div className="flex items-center text-green-500 text-sm mt-1">
                      <FaArrowUp className="mr-1" />
                      <span>15% so với tháng trước</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Doanh thu theo thời gian</h2>
                <div className="h-80">
                  <Line
                    data={revenueData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Doanh thu theo tháng',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Category Revenue Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Doanh thu theo danh mục</h2>
                <div className="h-80">
                  <Pie
                    data={categoryRevenueData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* User Registration Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Người dùng đăng ký theo tháng</h2>
              <div className="h-80">
                <Pie
                  data={userRegistrationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Top sản phẩm bán chạy</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng bán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doanh thu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.sales}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.revenue.toLocaleString()} đ</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
