import { FaSearch } from "react-icons/fa";
import Button from "./Button";
import PropTypes from 'prop-types'

const Filters = ({ filters, clearFilters, handleFilterChange, categories }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tìm kiếm</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Danh mục</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleFilterChange("category", category.name)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${filters.category === category.name
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {category.name === "all" ? "Tất cả" : category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Khoảng giá</h3>
                <div className="px-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">{formatPrice(filters.priceRange.min)}</span>
                        <span className="text-sm text-gray-600">{formatPrice(filters.priceRange.max)}</span>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="10000000"
                            step="100000"
                            value={filters.priceRange.min}
                            onChange={(e) => handleFilterChange("priceRange", {
                                ...filters.priceRange,
                                min: Number(e.target.value)
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            min="0"
                            max="999999999"
                            step="100000"
                            value={filters.priceRange.max}
                            onChange={(e) => handleFilterChange("priceRange", {
                                ...filters.priceRange,
                                max: Number(e.target.value)
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                        />
                    </div>
                </div>
            </div>

            {/* Clear Filters */}
            <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full py-2.5 text-sm font-medium"
            >
                Xóa bộ lọc
            </Button>
        </div>
    );
};

Filters.propTypes = {
    filters: PropTypes.shape({
        search: PropTypes.string,
        category: PropTypes.string,
        priceRange: PropTypes.string,
    }).isRequired,
    clearFilters: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default Filters;