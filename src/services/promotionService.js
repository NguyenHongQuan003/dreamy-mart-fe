import axiosInstance from "../utils/axiosConfig";
// /promotions/promotion-code/NEWUSER10
export const getPromotionByCode = async (code) => {
    const response = await axiosInstance.get(`/promotions/promotion-code/${code}`);
    return response.data;
};

export const getAllPromotions = async () => {
    const response = await axiosInstance.get("/promotions/all");
    return response.data;
};

export const createPromotion = async (promotion) => {
    const response = await axiosInstance.post("/promotions/create", promotion);
    return response.data;
};

// /promotions/update/5
// {
//     "promotionName": "Giảm giá cho khách hàng mới",
//             "description": "Giảm ngay 10% cho đơn hàng đầu tiên của khách hàng mới.",
//             "couponCode": "NEWUSER10",
//             "discountPercent": 0.00,
//             "discountAmount": 3000000.00,
//             "minimumOrderValue": 50000.00,
//             "startDate": "2025-03-01T00:00:00Z",
//             "endDate": "2025-06-01T23:59:59Z",
//             "isActive": true
// }
export const updatePromotion = async (id, promotion) => {
    const response = await axiosInstance.put(`/promotions/update/${id}`, promotion);
    return response.data;
};

// /promotions/promotion/7
export const getPromotionById = async (id) => {
    const response = await axiosInstance.get(`/promotions/promotion/${id}`);
    return response.data;
};



