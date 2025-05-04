import axiosInstance from "../utils/axiosConfig"
export const getAllProducts = async (page = null, size = null, pageSize = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (pageSize !== null) params.append("pageSize", pageSize);
    const products = await axiosInstance.get(`/products/all?${params.toString()}`);
    console.log("Service list product:", products.data.result)
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

export const createProduct = async (data, files) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("quantity", data.quantity);
    formData.append("brand", data.brand);
    formData.append("costPrice", data.costPrice);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("categoryName", data.categoryName);
    if (files) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }
    const response = await axiosInstance.post("/products/create", formData);
    console.log("Service create product:", response)
    return response.data.result;
}

export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/products/delete/${id}`);
    console.log("Service delete product:", response)
    return response.data.result;
}

// Thêm vào cuối file src/services/productService.js

export const updateProduct = async (id, data, files) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("quantity", data.quantity);
    formData.append("brand", data.brand);
    formData.append("costPrice", data.costPrice);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("categoryName", data.categoryName);
    if (data.imageIds) {
        // Nếu imageIds là mảng, join lại, nếu là chuỗi thì giữ nguyên
        formData.append("imageIds", Array.isArray(data.imageIds) ? data.imageIds.join(",") : data.imageIds);
    }
    if (files) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }
    const response = await axiosInstance.put(`/products/update/${id}`, formData);
    return response.data.result;
}







