import axiosInstance from "../utils/axiosConfig";

export const getCart = async () => {
    const response = await axiosInstance.get("/cart/get");
    return response.data;
}

export const clearCart = async () => {
    const response = await axiosInstance.post("/cart/clear");
    return response.data;
}

export const addToCart = async (productId, quantity) => {
    const response = await axiosInstance.post("/cartItems/add", {
        productId,
        quantity
    });
    // console.log("response add to cart", response);
    return response.data;
}

export const updateCartItem = async (productId, quantity) => {
    const response = await axiosInstance.post("/cartItems/update", {
        productId,
        quantity
    });
    return response.data;
}

export const removeCartItem = async (productId) => {
    const response = await axiosInstance.post(`/cartItems/remove/${productId}`);
    return response.data;
}

export const getAllCartItems = async () => {
    const response = await axiosInstance.get("/cartItems/getAll");
    return response.data;
}