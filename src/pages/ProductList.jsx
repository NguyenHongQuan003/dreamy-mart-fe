import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/product/ProductCard";
import SortComboBox from "../components/common/SortComboBox";
import Button from "../components/common/Button";
import { getProducts } from "../services/apiFunctions";
import {
  FaHome,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaSlidersH,
} from "react-icons/fa";
import { getProductByCategory } from "../services/productService";
import { getCategories } from "../services/categoryService";
import Filters from "../components/common/Filters";
import { priceRanges } from "../constants/app.constants";


// const ratings = [
//   { id: "rating-1", name: "5 sao", value: 5 },
//   { id: "rating-2", name: "4 sao trở lên", value: 4 },
//   { id: "rating-3", name: "3 sao trở lên", value: 3 },
// ];

const ProductList = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: "all",
    rating: 0,
    category: "all",
    search: "",
  });
  // const [visibleProducts, setVisibleProducts] = useState(10);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      console.log("Fetched products:", response);
      setProducts(response.result.data);
      setFilteredProducts(response.result.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();

      // Thêm phần tử "Tất cả" vào đầu danh sách
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

  const fetchProductByCategory = async (categoryName) => {
    setLoading(true);
    try {
      const response = await getProductByCategory(categoryName);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products category", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    if (categoryName === "all") {
      fetchProducts();
    } else {
      fetchProductByCategory(categoryName);
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [categoryName]);

  useEffect(() => {
    // Apply filters
    let result = [...products];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter(
        (product) => product.sellingPrice >= min && product.sellingPrice <= max
      );
    }

    if (filters.category !== "all") {
      result = result.filter(
        (product) =>
          product.category.name.toLowerCase() === filters.category.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "all",
      rating: 0,
      category: "all",
      search: "",
    });
  };

  // const loadMoreProducts = () => {
  //   setVisibleProducts((prev) => prev + 10);
  // };

  // const RatingStars = ({ rating }) => (
  //   <div className="flex">
  //     {[...Array(5)].map((_, i) => (
  //       <FaStar
  //         key={i}
  //         className={i < rating ? "text-yellow-400" : "text-gray-300"}
  //         size={14}
  //       />
  //     ))}
  //   </div>
  // );

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
                    {categoryName === "all" ? "TẤT CẢ" : categoryName.toUpperCase()
                    }
                  </h1>
                  <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {filteredProducts.length} sản phẩm
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
              {Object.values(filters).some(
                (v) => v !== "all" && v !== 0 && v !== ""
              ) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Bộ lọc đang áp dụng:
                    </span>

                    {filters.category !== "all" && (
                      <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                        <span>
                          {
                            categories.find((c) => c.name === filters.category)
                              ?.name
                          }
                        </span>
                        <button
                          onClick={() => handleFilterChange("category", "all")}
                          className="ml-1 inline-flex text-blue-500 focus:outline-none"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {filters.priceRange !== "all" && (
                      <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                        <span>
                          {
                            priceRanges.find(
                              (p) => p.value === filters.priceRange
                            )?.name
                          }
                        </span>
                        <button
                          onClick={() => handleFilterChange("priceRange", "all")}
                          className="ml-1 inline-flex text-blue-500 focus:outline-none"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* {filters.rating > 0 && (
                      <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                        <span className="flex items-center">
                          <RatingStars rating={filters.rating} />
                          <span className="ml-1">trở lên</span>
                        </span>
                        <button
                          onClick={() => handleFilterChange("rating", 0)}
                          className="ml-1 inline-flex text-blue-500 focus:outline-none"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    )} */}

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
            ) : filteredProducts.length === 0 ? (
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((item, index) => (
                  <ProductCard key={index} product={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductList;
