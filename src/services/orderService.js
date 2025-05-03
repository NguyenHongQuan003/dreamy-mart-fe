import axiosInstance from "../utils/axiosConfig";

export const placeOrder = async (selectedCartItemIds, couponCode, shippingAddress) => {
    const response = await axiosInstance.post("/orders/place-order", {
        selectedCartItemIds,
        couponCode,
        shippingAddress: shippingAddress.address
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






