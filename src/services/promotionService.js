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
// /filter?promotionName=SummerSale
// &promotionCode=SS2025
// &status=true
// &startDatePromotionStartDate=2025-06-01
// &endDatePromotionStartDate=2025-06-30
// &startDatePromotionEndDate=2025-07-01
// &endDatePromotionEndDate=2025-07-31
// &page=1
// &size=10
export const filterPromotion = async (promotionName, promotionCode, status = null, startDatePromotionStartDate = null, endDatePromotionStartDate = null, startDatePromotionEndDate = null, endDatePromotionEndDate = null, page = null, size = null) => {
    const params = new URLSearchParams();
    if (promotionName) params.append("promotionName", promotionName);
    if (promotionCode) params.append("promotionCode", promotionCode);
    if (status !== null) params.append("status", status);
    if (startDatePromotionStartDate !== null) params.append("startDatePromotionStartDate", startDatePromotionStartDate);
    if (endDatePromotionStartDate !== null) params.append("endDatePromotionStartDate", endDatePromotionStartDate);
    if (startDatePromotionEndDate !== null) params.append("startDatePromotionEndDate", startDatePromotionEndDate);
    if (endDatePromotionEndDate !== null) params.append("endDatePromotionEndDate", endDatePromotionEndDate);
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);

    const response = await axiosInstance.get(`/promotions/filter?${params.toString()}`);
    return response.data;
};


