import axios from "axios";
import { API_URL } from "../constants/api.constants";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products", error);
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products?id=${productId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product info", error);
  }
};

export const getImageByProductId = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/images?product_id=${productId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch images", error);
  }
};
