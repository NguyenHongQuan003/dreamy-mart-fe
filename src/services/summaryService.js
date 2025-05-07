import axiosInstance from "../utils/axiosConfig";

export const getSummary = async () => {
    const response = await axiosInstance.get("/admin/summary");
    return response.data.result;
};


export const getRevenueByCategory = async () => {
    const response = await axiosInstance.get("/admin/revenue-by-category");
    return response.data.result;
}


export const getTopSellingProducts = async () => {
    const response = await axiosInstance.get("/admin/top-selling-products");
    return response.data.result;
}

export const getMonthlyRegistration = async () => {
    const response = await axiosInstance.get("/admin/monthly-registration");
    return response.data.result;
}

export const getRevenueByTimeRange = async (timeRange) => {
    const response = await axiosInstance.get(`/admin/revenue-by-time-range?timeRange=${timeRange}`);
    return response.data.result;
}

// http://localhost:8080/api/v1/admin/monthly-order-stats
// {
//     "code": 1000,
//     "message": "Get monthly order statistics successfully",
//     "result": [
//         {
//             "year": 2025,
//             "month": 5,
//             "count": 37
//         }
//     ]
// }
export const getMonthlyOrderStats = async () => {
    const response = await axiosInstance.get("/admin/monthly-order-stats");
    return response.data.result;
}
// http://localhost:8080/api/v1/admin/order-status-stats
// {
//     "code": 1000,
//     "message": "Get order status statistics successfully",
//     "result": [
//         {
//             "orderStatus": "PAYMENT_PROCESSING",
//             "count": 23
//         },
//         {
//             "orderStatus": "DELIVERY_PROCESSING",
//             "count": 6
//         },
//         {
//             "orderStatus": "ORDER_CREATED",
//             "count": 6
//         },
//         {
//             "orderStatus": "ORDER_COMPLETED",
//             "count": 1
//         },
//         {
//             "orderStatus": "PAYMENT_COMPLETED",
//             "count": 1
//         }
//     ]
// }
export const getOrderStatusStats = async () => {
    const response = await axiosInstance.get("/admin/order-status-stats");
    return response.data.result;
}