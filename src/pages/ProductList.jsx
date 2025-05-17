import { useParams, Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/product/ProductCard";
import SortComboBox from "../components/common/SortComboBox";
import Button from "../components/common/Button";
import {
  FaHome,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaSlidersH,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { filterProductsHome } from "../services/productService";
import { getCategories } from "../services/categoryService";
import Filters from "../components/common/Filters";

const ProductList = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    priceRange: {
      min: 0,
      max: 999999999
    }
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 25,
    totalPages: 1,
    totalItems: 0
  });

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      console.log(filters);
      const response = await filterProductsHome(
        filters.category === "all" ? null : filters.category,
        filters.search,
        filters.priceRange.min,
        filters.priceRange.max,
        page,
        pagination.pageSize
      );
      setProducts(response.result.data);
      setPagination({
        currentPage: response.result.currentPage,
        pageSize: response.result.pageSize,
        totalPages: response.result.totalPages,
        totalItems: response.result.totalElements
      });
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      const allCategory = { id: 0, name: "all" };
      const updatedCategories = [allCategory, ...response];
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(1);
      window.scrollTo(0, 0);
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [categoryName, filters, fetchProducts]);

  useEffect(() => {
    setFilters({
      category: categoryName,
      search: "",
      priceRange: {
        min: 0,
        max: 999999999
      }
    })
  }, [
    categoryName
  ])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      search: "",
      priceRange: {
        min: 0,
        max: 999999999
      }
    });
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="flex items-center hover:text-blue-600">
            <FaHome className="mr-1" />
            <span>Trang chủ</span>
          </Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <Link to="/products/category/all" className="hover:text-blue-600">
            Danh mục
          </Link>
          {categoryName && (
            <>
              <FaChevronRight className="mx-2 text-xs text-gray-400" />
              <span className="text-gray-700 font-medium">{categoryName === "all" ? "Tất cả" : categoryName}</span>
            </>
          )}
        </nav>

        {/* Product list */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter sidebar (desktop) */}
          <div className="hidden md:block md:w-64 bg-white rounded-lg shadow p-4 flex-shrink-0">
            <Filters filters={filters} clearFilters={clearFilters} handleFilterChange={handleFilterChange} categories={categories} />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-800 mr-3">
                    {filters.category === "all" ? "TẤT CẢ" : filters.category.toUpperCase()}
                  </h1>
                  <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {pagination.totalItems} sản phẩm
                  </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                  {/* Sort Combo Box */}
                  <div className="flex items-center">
                    <FaSlidersH className="mr-2 h-4 w-4 text-gray-500" />
                    <SortComboBox list={products} setList={setProducts} />
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {(filters.search || filters.category !== "all" || filters.priceRange.min > 0 || filters.priceRange.max < 10000000) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Bộ lọc đang áp dụng:
                  </span>

                  {filters.category !== "all" && (
                    <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                      <span>{filters.category}</span>
                      <button
                        onClick={() => handleFilterChange("category", "all")}
                        className="ml-1 inline-flex text-blue-500 focus:outline-none"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {(filters.priceRange.min > 0 || filters.priceRange.max < 10000000) && (
                    <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                      <span>
                        {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
                      </span>
                      <button
                        onClick={() => handleFilterChange("priceRange", { min: 0, max: 10000000 })}
                        className="ml-1 inline-flex text-blue-500 focus:outline-none"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {filters.search && (
                    <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                      <span>{filters.search}</span>
                      <button
                        onClick={() => handleFilterChange("search", "")}
                        className="ml-1 inline-flex text-blue-500 focus:outline-none"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 underline ml-2"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <FaSearch className="mx-auto h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-1 text-gray-500">
                  Không có sản phẩm nào phù hợp với bộ lọc của bạn.
                </p>
                <div className="mt-6">
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((item, index) => (
                    <ProductCard key={index} product={item} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="inline-flex items-center space-x-1 rounded-lg shadow-sm bg-white px-4 py-2 border border-gray-200">
                      {/* Nút Trước */}
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-40 transition"
                      >
                        <FaArrowLeft />
                      </button>

                      {/* Các số trang */}
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrent = pagination.currentPage === page;

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${isCurrent
                              ? "bg-blue-500 text-white shadow"
                              : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      {/* Nút Sau */}
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-40 transition"
                      >
                        <FaArrowRight />
                      </button>
                    </nav>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductList;
