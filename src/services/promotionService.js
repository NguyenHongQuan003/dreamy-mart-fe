import axiosInstance from "../utils/axiosConfig";
// /promotions/promotion-code/NEWUSER10
export const getPromotionByCode = async (code) => {
    const response = await axiosInstance.get(`/promotions/promotion-code/${code}`);
    return response.data;
};



