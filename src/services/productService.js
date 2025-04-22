import axiosInstance from "../utils/axiosConfig"
export const getAllProducts = async (page, size, pageSize) => {
    const products = await axiosInstance.get(`/products/all?page=${page}&size=${size}&pageSize=${pageSize}`);
    console.log("Service list product:", products)
    return products.data.result;
}

export const getProductById = async (id) => {
    const product = await axiosInstance.get(`/products/product/${id}`);
    console.log("Service get product by id:", product)
    return product.data.result;
}

// /products/category?page=2&size=1&categoryName=Phone
export const getProductByCategory = async (categoryName, page = null, size = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (categoryName) params.append("categoryName", categoryName);

    const response = await axiosInstance.get(`/products/category?${params.toString()}`);
    return response.data.result;
};


// /products/brand?brandName=apply
export const getProductByBrand = async (brandName) => {
    const products = await axiosInstance.get(`/products/brand?brandName=${brandName}`);
    console.log("Service get product by brand:", products)
    return products.data.result;
}

// /products/category/brand?brandName=Apply&categoryName=Apple
export const getProductByCategoryAndBrand = async (brandName, categoryName) => {
    const products = await axiosInstance.get(`/products/category/brand?brandName=${brandName}&categoryName=${categoryName}`);
    console.log("Service get product by category and brand:", products)
    return products.data.result;
}






