import { useParams, Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/product/ProductCard";
import SortComboBox from "../components/common/SortComboBox";
import Button from "../components/common/Button";
import { getProducts } from "../services/apiFunctions";
import {
  FaHome,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaTimes,
  FaSlidersH,
  FaStar,
  FaChevronDown,
} from "react-icons/fa";
import { Transition, Dialog } from "@headlessui/react";

const priceRanges = [
  { id: "price-1", name: "Tất cả giá", value: "all" },
  { id: "price-2", name: "Dưới 100.000đ", value: "0-100000" },
  { id: "price-3", name: "100.000đ - 300.000đ", value: "100000-300000" },
  { id: "price-4", name: "300.000đ - 500.000đ", value: "300000-500000" },
  { id: "price-5", name: "500.000đ - 1.000.000đ", value: "500000-1000000" },
  { id: "price-6", name: "Trên 1.000.000đ", value: "1000000-9999999999" },
];

const ratings = [
  { id: "rating-1", name: "5 sao", value: 5 },
  { id: "rating-2", name: "4 sao trở lên", value: 4 },
  { id: "rating-3", name: "3 sao trở lên", value: 3 },
];

const categories = [
  { id: "cat-1", name: "Tất cả danh mục", value: "all" },
  { id: "cat-2", name: "Điện thoại", value: "phone" },
  { id: "cat-3", name: "Laptop", value: "laptop" },
  { id: "cat-4", name: "Máy tính bảng", value: "tablet" },
  { id: "cat-5", name: "Phụ kiện", value: "accessory" },
];

const ProductList = () => {
  const { subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    rating: 0,
    category: "all",
    search: "",
  });
  const [visibleProducts, setVisibleProducts] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response);
        setFilteredProducts(response);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...products];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((product) =>
        product.productName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Filter by rating (mock - in actual implementation, products would have ratings)
    if (filters.rating > 0) {
      // Mocking ratings since we don't have them in our product data
      result = result.filter(
        (product) =>
          // This is just a simulation - would use actual ratings in real app
          (product.price % 5) + 1 >= filters.rating
      );
    }

    // Filter by category (mock - adjust based on actual data structure)
    if (filters.category !== "all") {
      // This is a mock filter since we don't have category in our test data
      result = result.filter(
        (product, index) =>
          // This is just a simulation - would use actual categories in real app
          index % categories.length ===
          categories.findIndex((c) => c.value === filters.category)
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

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  const FilterCheckbox = ({
    id,
    name,
    value,
    currentValue,
    onChange,
    type = "radio",
  }) => (
    <div className="flex items-center">
      <input
        id={id}
        name={type === "radio" ? name : id}
        type={type}
        checked={value === currentValue}
        onChange={() => onChange(value)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-3 text-sm text-gray-600">
        {name}
      </label>
    </div>
  );

  const RatingStars = ({ rating }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
          size={14}
        />
      ))}
    </div>
  );

  const FilterSection = ({
    title,
    children,
    isOpen = true,
    toggleOpen = null,
  }) => (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium text-gray-900">{title}</h3>
        {toggleOpen && (
          <button onClick={toggleOpen} className="text-gray-500">
            <FaChevronDown
              className={`h-4 w-4 ${isOpen ? "transform rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
      <div className={`${isOpen ? "block" : "hidden"} space-y-2`}>
        {children}
      </div>
    </div>
  );

  const Filters = ({ isMobile = false }) => (
    <div className={`${isMobile ? "px-4" : ""}`}>
      {!isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
          {Object.values(filters).some(
            (v) => v !== "all" && v !== 0 && v !== ""
          ) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaTimes className="mr-1" /> Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      <div className="mt-4 mb-6">
        <div className="relative rounded-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <FilterSection title="Danh mục">
        {categories.map((category) => (
          <FilterCheckbox
            key={category.id}
            id={category.id}
            name="category"
            value={category.value}
            currentValue={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Khoảng giá">
        {priceRanges.map((range) => (
          <FilterCheckbox
            key={range.id}
            id={range.id}
            name="price-range"
            value={range.value}
            currentValue={filters.priceRange}
            onChange={(value) => handleFilterChange("priceRange", value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Đánh giá">
        {ratings.map((rating) => (
          <div key={rating.id} className="flex items-center">
            <input
              id={rating.id}
              name="rating"
              type="radio"
              checked={filters.rating === rating.value}
              onChange={() => handleFilterChange("rating", rating.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={rating.id}
              className="ml-3 flex items-center text-sm text-gray-600"
            >
              <RatingStars rating={rating.value} />
              <span className="ml-1">
                {rating.name === "5 sao" ? "" : " trở lên"}
              </span>
            </label>
          </div>
        ))}
      </FilterSection>
    </div>
  );

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
          <Link to="/category" className="hover:text-blue-600">
            Danh mục
          </Link>
          {subcategory && (
            <>
              <FaChevronRight className="mx-2 text-xs text-gray-400" />
              <span className="text-gray-700 font-medium">{subcategory}</span>
            </>
          )}
        </nav>

        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 md:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Bộ lọc</h2>
                  <button
                    type="button"
                    className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Đóng</span>
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Filters */}
                <div className="mt-4">
                  <Filters isMobile={true} />
                </div>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        {/* Product list */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter sidebar (desktop) */}
          <div className="hidden md:block md:w-64 bg-white rounded-lg shadow p-4 flex-shrink-0">
            <Filters />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-800 mr-3">
                    {subcategory
                      ? subcategory.toUpperCase()
                      : "Tất cả sản phẩm"}
                  </h1>
                  <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {filteredProducts.length} sản phẩm
                  </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                  {/* Mobile filter button */}
                  <button
                    type="button"
                    className="md:hidden flex items-center text-sm p-2 border border-gray-300 rounded bg-white"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <FaFilter className="mr-2 h-4 w-4" />
                    Lọc
                  </button>

                  {/* Sort Combo Box */}
                  <div className="flex items-center">
                    <FaSlidersH className="mr-2 h-4 w-4 text-gray-500" />
                    <SortComboBox />
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
                          categories.find((c) => c.value === filters.category)
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

                  {filters.rating > 0 && (
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
                  )}

                  {filters.search && (
                    <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                      <span>"{filters.search}"</span>
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
                {filteredProducts
                  .slice(0, visibleProducts)
                  .map((item, index) => (
                    <ProductCard key={index} product={item} />
                  ))}
              </div>
            )}

            {/* Load more button */}
            {!loading && filteredProducts.length > visibleProducts && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={loadMoreProducts}>
                  Xem thêm sản phẩm
                </Button>
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
