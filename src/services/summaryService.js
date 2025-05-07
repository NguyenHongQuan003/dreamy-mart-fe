import axiosInstance from "../utils/axiosConfig";

// /admin/summary
// {
//     "code": 1000,
//     "message": "Get summary successfully",
//     "result": {
//         "totalUsers": 14,
//         "totalProducts": 11,
//         "totalOrders": 37,
//         "totalRevenue": 56000.00
//     }
// }
export const getSummary = async () => {
    const response = await axiosInstance.get("/admin/summary");
    return response.data.result;
};

// /admin/revenue-by-category
// {
//     "code": 1000,
//     "message": "Get revenue by category successfully",
//     "result": [
//         {
//             "categoryName": "Baby",
//             "totalRevenue": 56000.00
//         }
//     ]
// }

export const getRevenueByCategory = async () => {
    const response = await axiosInstance.get("/admin/revenue-by-category");
    return response.data.result;
}

// /admin/top-selling-products
// {
//     "code": 1000,
//     "message": "Get top selling products successfully",
//     "result": [
//         {
//             "productId": 13,
//             "productName": "Đồ bộ cho trẻ 6-18 tháng",
//             "productImage": "https://springboot-ms-product-bucket.s3.amazonaws.com/01f055b3-6237-45b0-87f6-10b2e8924fb6_1745425515207_quanaostrueem.jpg",
//             "quantity": 9,
//             "price": 56000.00,
//             "sold": 1,
//             "revenue": 56000.00,
//             "categoryName": "Baby"
//         }
//     ]
// }
export const getTopSellingProducts = async () => {
    const response = await axiosInstance.get("/admin/top-selling-products");
    return response.data.result;
}
// /admin/monthly-registration
// {
//     "code": 1000,
//     "message": "Get monthly registration data successfully",
//     "result": [
//         {
//             "month": 4,
//             "year": 2025,
//             "count": 14
//         }
//     ]
// }
export const getMonthlyRegistration = async () => {
    const response = await axiosInstance.get("/admin/monthly-registration");
    return response.data.result;
}
// /admin/revenue - by - time - range ? timeRange = monthly/daily/weekly
// {
//     "code": 1000,
//     "message": "Get revenue by time range successfully",
//     "result": [
//         {
//             "date": "May 2025",
//             "revenue": 56000.00
//         }
//     ]
// }
export const getRevenueByTimeRange = async (timeRange) => {
    const response = await axiosInstance.get(`/admin/revenue-by-time-range?timeRange=${timeRange}`);
    return response.data.result;
}