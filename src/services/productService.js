import axiosInstance from "../utils/axiosConfig"
export const getAllProducts = async (page = null, size = null, pageSize = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (pageSize !== null) params.append("pageSize", pageSize);
    const products = await axiosInstance.get(`/products/all?${params.toString()}`);
    return products.data.result;
}

export const getProductById = async (id) => {
    const product = await axiosInstance.get(`/products/product/${id}`);
    return product.data.result;
}

export const getProductByCategory = async (categoryName, page = null, size = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (categoryName) params.append("categoryName", categoryName);

    const response = await axiosInstance.get(`/products/category?${params.toString()}`);
    return response.data.result;
};


export const getProductByBrand = async (brandName) => {
    const products = await axiosInstance.get(`/products/brand?brandName=${brandName}`);
    return products.data.result;
}
export const getProductByCategoryAndBrand = async (brandName, categoryName) => {
    const products = await axiosInstance.get(`/products/category/brand?brandName=${brandName}&categoryName=${categoryName}`);
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
    // console.log("Service create product:", response)
    return response.data.result;
}

export const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/products/delete/${id}`);
    // console.log("Service delete product:", response)
    return response.data.result;
}

export const updateProduct = async (id, data,
    files
) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("quantity", data.quantity);
    formData.append("brand", data.brand);
    formData.append("costPrice", data.costPrice);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("categoryName", data.categoryName);
    if (data.imageIds.length > 0) {
        data.imageIds.forEach((imageId) => {
            formData.append("imageIds", imageId);
        });
    }
    if (files) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    const response = await axiosInstance.put(`/products/update/${id}`, formData);
    return response.data.result;
}

export const searchProducts = async (searchTerm, page = null, size = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (searchTerm) params.append("searchTerm", searchTerm);

    const response = await axiosInstance.get(`/products/search?${params.toString()}`);
    return response.data.result;
}

export const filterProducts = async (brand, minPrice, maxPrice, page = null, size = null, name = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (brand) params.append("brand", brand);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (name) params.append("name", name);

    const response = await axiosInstance.get(`/products/filter?${params.toString()}`);
    return response.data;
}

export const filterProductsHome = async (categoryName, searchTerm, minPrice, maxPrice, page = null, size = null) => {
    const params = new URLSearchParams();
    if (page !== null) params.append("page", page);
    if (size !== null) params.append("size", size);
    if (categoryName) params.append("categoryName", categoryName);
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    console.log("Params:", params.toString());

    const response = await axiosInstance.get(`/products/filter/home?${params.toString()}`);
    return response.data;
}


// @PostMapping("/recently/add/{id}")
export const addRecentlyProduct = async (id) => {
    const response = await axiosInstance.post(`/products/recently/add/${id}`);
    return response.data;
}

// http://localhost:8080/api/v1/products/recently/get
// {
//     "code": 1000,
//     "message": "Recently viewed products retrieved successfully",
//     "result": []
// }
export const getRecentlyProducts = async () => {
    const response = await axiosInstance.get("/products/recently/get");
    return response.data;
}

