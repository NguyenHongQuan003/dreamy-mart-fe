import axiosInstance from "../utils/axiosConfig";

export const placeOrder = async (selectedCartItemIds, couponCode, shippingAddress) => {
    const response = await axiosInstance.post("/orders/place-order", {
        selectedCartItemIds,
        couponCode: couponCode || "DEFAULT",
        shippingAddress: shippingAddress.address,
    });
    return response.data;
};


export const checkToOrder = async (orderId) => {
    const response = await axiosInstance.get(`/inventory/checkToOrder/${orderId}`);
    return response.data;
};

export const createMomoPayment = async (orderId, userId, totalAmount) => {
    const response = await axiosInstance.post("/payment/create-momo-payment", {
        orderId,
        userId,
        totalAmount
    });
    return response.data;
};

export const getOrderDetail = async () => {
    const response = await axiosInstance.get("/orders/user-orders");
    return response.data;
};

export const getOrderDetailById = async (orderId) => {
    const response = await axiosInstance.get(`/orders/order/${orderId}`);
    return response.data;
};

export const getAllOrders = async (page, size) => {
    const response = await axiosInstance.get(`/orders/getAll?page=${page}&size=${size}`);
    return response.data;
};


// http://localhost:8080/api/v1/orders/filter?customerName=Quan&customerPhone=0901&page=1&size=10&orderStatus=SHIPPED&minTotalPrice=100000&maxTotalPrice=1000000&startDate=2024-01-01&endDate=2024-03-31
export const filterOrders = async (customerName, customerPhone, page = null, size = null, orderStatus = null, minTotalPrice = null, maxTotalPrice = null, startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (customerName) params.append("customerName", customerName);
    if (customerPhone) params.append("customerPhone", customerPhone);
    if (orderStatus !== null) params.append("orderStatus", orderStatus);
    if (minTotalPrice !== null) params.append("minTotalPrice", minTotalPrice);
    if (maxTotalPrice !== null) params.append("maxTotalPrice", maxTotalPrice);
    if (startDate !== null) params.append("startDate", startDate);
    if (endDate !== null) params.append("endDate", endDate);

    const response = await axiosInstance.get(`/orders/filter?${params.toString()}`);
    return response.data;
}

// http://localhost:8080/api/v1/orders/search?searchTerm=1&page=1&size=10
export const searchOrders = async (searchTerm, page = null, size = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (searchTerm) params.append("searchTerm", searchTerm);

    const response = await axiosInstance.get(`/orders/search?${params.toString()}`);
    return response.data;
}




