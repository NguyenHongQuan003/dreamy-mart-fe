import { useState, useEffect } from "react";
import {
  FaUsers,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,
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
import { getSummary, getRevenueByCategory, getTopSellingProducts, getMonthlyRegistration, getRevenueByTimeRange, getOrderStatusStats, getMonthlyOrderStats } from "../../services/summaryService";
import { Radio } from 'antd';

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


const deliveryStatusOptions = [
  { value: 'DELIVERY_COMPLETED', label: 'Giao thành công' },
  { value: 'DELIVERY_FAILED', label: 'Giao thất bại' },
  { value: 'DELIVERY_PROCESSING', label: 'Đang giao' },
  { value: 'INVENTORY_CHECKED', label: 'Đã kiểm kho' },
  { value: 'INVENTORY_COMPLETED', label: 'Đã xuất kho' },
  { value: 'INVENTORY_FAILED', label: 'Lỗi xuất kho' },
  { value: 'INVENTORY_PROCESSING', label: 'Đang xuất kho' },
  { value: 'ORDER_CANCELLED', label: 'Đơn bị hủy' },
  { value: 'ORDER_COMPLETED', label: 'Đơn hoàn tất' },
  { value: 'ORDER_CREATED', label: 'Đơn mới' },
  { value: 'PAYMENT_COMPLETED', label: 'Đã thanh toán' },
  { value: 'PAYMENT_FAILED', label: 'Thanh toán thất bại' },
  { value: 'PAYMENT_PROCESSING', label: 'Đang thanh toán' },
  { value: 'PAYMENT_REFUND_COMPLETED', label: 'Đã hoàn tiền' },
  { value: 'PAYMENT_REFUND_FAILED', label: 'Hoàn tiền thất bại' },
  { value: 'PAYMENT_REFUND_PROCESSING', label: 'Đang hoàn tiền' },
];

const Dashboard = () => {

  // const generateColors = (count) => {
  //   return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 60%)`);
  // };
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor(Math.random() * 360);     // tông màu ngẫu nhiên
      const saturation = 60 + Math.random() * 30;       // từ 60% - 90% cho tươi
      const lightness = 50 + Math.random() * 20;        // từ 50% - 70% cho dễ nhìn
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };


  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: 'Doanh thu (triệu đồng)',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
    }]
  });
  const [categoryRevenueData, setCategoryRevenueData] = useState({
    labels: [],
    datasets: [{
      data: [],
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
    }]
  });
  const [userRegistrationData, setUserRegistrationData] = useState({
    labels: [],
    datasets: [{
      data: [],
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
    }]
  });
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState({
    labels: [],
    datasets: [{
      data: [],
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
    }]
  });
  const [monthlyOrderData, setMonthlyOrderData] = useState({
    labels: [],
    datasets: [{
      label: 'Số lượng đơn hàng',
      data: [],
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(153, 102, 255, 0.1)',
    }]
  });


  const user = useSelector((state) => state.auth.user);
  useCheckAdminAuth(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Lấy dữ liệu tổng quan
        const summaryData = await getSummary();
        setStats({
          users: summaryData.totalUsers,
          products: summaryData.totalProducts,
          orders: summaryData.totalOrders,
          revenue: summaryData.totalRevenue,
        });

        // Lấy dữ liệu doanh thu theo thời gian
        const revenueByTime = await getRevenueByTimeRange(timeRange);
        setRevenueData({
          labels: revenueByTime.map(item => item.date),
          datasets: [{
            label: 'Doanh thu (triệu đồng)',
            data: revenueByTime.map(item => item.revenue / 1000000), // Chuyển đổi sang triệu đồng
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
          }]
        });

        // Lấy dữ liệu doanh thu theo danh mục
        const revenueByCategory = await getRevenueByCategory();
        const colorsCategory = generateColors(revenueByCategory.length);
        setCategoryRevenueData({
          labels: revenueByCategory.map(item => item.categoryName),
          datasets: [{
            data: revenueByCategory.map(item => item.totalRevenue),
            backgroundColor: colorsCategory,
            borderColor: colorsCategory.map(color => color.replace('60%', '40%')),
            borderWidth: 1,
          }]
        });

        // Lấy dữ liệu đăng ký người dùng theo tháng
        const monthlyRegistrations = await getMonthlyRegistration();
        const colorsUser = generateColors(monthlyRegistrations.length);
        setUserRegistrationData({
          labels: monthlyRegistrations.map(item => `Tháng ${item.month}/${item.year}`),
          datasets: [{
            data: monthlyRegistrations.map(item => item.count),
            backgroundColor: colorsUser,
            borderColor: colorsUser.map(color => color.replace('60%', '40%')),
            borderWidth: 1,
          }]
        });

        // Lấy dữ liệu top sản phẩm bán chạy
        const topSellingProducts = await getTopSellingProducts();
        setTopProducts(topSellingProducts);

        // Lấy dữ liệu trạng thái đơn hàng
        const orderStatusStats = await getOrderStatusStats();
        const colorsOrderStatus = generateColors(orderStatusStats.length);
        setOrderStatusData({
          labels: orderStatusStats.map(item => {
            const found = deliveryStatusOptions.find(opt => opt.value === item.orderStatus);
            return found ? found.label : item.orderStatus;
          }),

          datasets: [{
            data: orderStatusStats.map(item => item.count),
            backgroundColor: colorsOrderStatus,
            borderColor: colorsOrderStatus.map(color => color.replace('60%', '40%')),
            borderWidth: 1,
          }]
        });

        // Lấy dữ liệu đơn hàng theo tháng
        const monthlyOrderStats = await getMonthlyOrderStats();
        setMonthlyOrderData({
          labels: monthlyOrderStats.map(item => `Tháng ${item.month}/${item.year}`),
          datasets: [{
            label: 'Số lượng đơn hàng',
            data: monthlyOrderStats.map(item => item.count),
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
          }]
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                    <FaUsers className="text-blue-600 text-lg md:text-xl" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xs md:text-sm font-medium text-gray-500">
                      Người dùng
                    </h2>
                    <p className="text-lg md:text-2xl font-semibold text-gray-800">
                      {stats.users}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 md:p-3 rounded-full">
                    <FaShoppingBag className="text-green-600 text-lg md:text-xl" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xs md:text-sm font-medium text-gray-500">
                      Sản phẩm
                    </h2>
                    <p className="text-lg md:text-2xl font-semibold text-gray-800">
                      {stats.products}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                    <FaClipboardList className="text-purple-600 text-lg md:text-xl" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xs md:text-sm font-medium text-gray-500">
                      Đơn hàng
                    </h2>
                    <p className="text-lg md:text-2xl font-semibold text-gray-800">
                      {stats.orders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 md:p-3 rounded-full">
                    <FaChartLine className="text-red-600 text-lg md:text-xl" />
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h2 className="text-xs md:text-sm font-medium text-gray-500">
                      Doanh thu
                    </h2>
                    <p className="text-lg md:text-2xl font-semibold text-gray-800">
                      {stats.revenue.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-md p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                  <span className="text-xs md:text-sm font-semibold bg-amber-200 px-2 rounded-2xl text-amber-900">Doanh thu theo thời gian</span>
                  <Radio.Group
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    buttonStyle="solid"
                    size="small"
                  >
                    <Radio.Button value="daily">Ngày</Radio.Button>
                    <Radio.Button value="weekly">Tuần</Radio.Button>
                    <Radio.Button value="monthly">Tháng</Radio.Button>
                  </Radio.Group>
                </div>
                <div className="h-60 md:h-80">
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
                          text: `Doanh thu theo ${timeRange === 'daily' ? 'ngày' : timeRange === 'weekly' ? 'tuần' : 'tháng'}`,
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Category Revenue Chart */}
              <div className="col-span-1 bg-white rounded-lg shadow-md p-4 md:p-6">
                <span className="text-xs md:text-sm font-semibold bg-green-200 px-2 rounded-2xl text-green-900">Doanh thu theo danh mục</span>
                <div className="h-60 md:h-80 mt-4 md:mt-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-md p-4 md:p-6">
                <span className="text-xs md:text-sm font-semibold bg-indigo-200 px-2 rounded-2xl text-indigo-900">Số lượng đơn hàng theo tháng</span>
                <div className="h-60 md:h-80 mt-4 md:mt-6">
                  <Line
                    data={monthlyOrderData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Số lượng đơn hàng theo tháng',
                        },
                      },
                    }}
                  />
                </div>
              </div>
              {/* User Registration Chart */}
              <div className="col-span-1 bg-white rounded-lg shadow-md p-4 md:p-6">
                <span className="text-xs md:text-sm font-semibold bg-blue-200 px-2 rounded-2xl text-blue-900">Người dùng đăng ký theo tháng</span>
                <div className="h-60 md:h-80 mt-4 md:mt-6">
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="col-span-1 bg-white rounded-lg shadow-md p-4 md:p-6">
                <span className="text-xs md:text-sm font-semibold bg-pink-200 px-2 rounded-2xl text-pink-900">Trạng thái đơn hàng</span>
                <div className="h-60 md:h-80 mt-4 md:mt-6">
                  <Pie
                    data={orderStatusData}
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
              <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-md p-4 md:p-6">
                <span className="text-xs md:text-sm font-semibold bg-purple-200 px-2 rounded-2xl text-purple-900">Top sản phẩm bán chạy</span>
                <div className="overflow-x-auto mt-4 md:mt-6">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số lượng bán
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doanh thu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topProducts.map((product) => (
                        <tr key={product.productId}>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover mr-2 md:mr-3"
                              />
                              <div className="text-xs md:text-sm font-medium text-gray-900">{product.productName}</div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                            <div className="text-xs md:text-sm text-gray-500">{product.categoryName}</div>
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                            <div className="text-xs md:text-sm text-gray-900">{product.sold}</div>
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                            <div className="text-xs md:text-sm text-gray-900">{product.revenue.toLocaleString()} đ</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
