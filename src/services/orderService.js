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







