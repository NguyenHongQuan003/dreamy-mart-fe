import axiosInstance from "../utils/axiosConfig";
export const getPromotionByCode = async (code) => {
    const response = await axiosInstance.get(`/promotions/active/${code}`);
    return response.data;
};

// phân trang
export const getAllPromotions = async (page, size) => {
    const response = await axiosInstance.get(`/promotions/all?page=${page}&size=${size}`);
    return response.data;
};

export const createPromotion = async (promotion) => {
    const response = await axiosInstance.post("/promotions/create", promotion);
    return response.data;
};
export const updatePromotion = async (id, promotion) => {
    const response = await axiosInstance.put(`/promotions/update/${id}`, promotion);
    return response.data;
};

export const getPromotionById = async (id) => {
    const response = await axiosInstance.get(`/promotions/promotion/${id}`);
    return response.data;
};

export const deletePromotion = async (id) => {
    const response = await axiosInstance.delete(`/promotions/delete/${id}`);
    return response.data;
};

// /promotion/search?searchTerm=Giảm+giá&page=1&size=10
export const searchPromotion = async (searchTerm, page, size) => {
    const response = await axiosInstance.get(`/promotions/search?searchTerm=${searchTerm}&page=${page}&size=${size}`);
    return response.data;
};

// /promotion/filter?promotionName=Tết&page=1&size=10
export const filterPromotion = async (promotionName, page, size) => {
    const response = await axiosInstance.get(`/promotions/filter?promotionName=${promotionName}&page=${page}&size=${size}`);
    return response.data;
};


