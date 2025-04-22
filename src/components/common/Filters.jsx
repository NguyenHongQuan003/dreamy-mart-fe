import FilterSection from './FilterSection'
import FilterCheckBox from './FilterCheckBox'
import { FaSearch, FaTimes } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { priceRanges } from '../../constants/app.constants'


const Filters = ({ filters, clearFilters, handleFilterChange, categories }) => {
    return (
        <div >
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
                    <FilterCheckBox
                        key={category.id}
                        id={category.id}
                        name={category.name}
                        value={category.name}
                        currentValue={filters.category}
                        onChange={(value) => handleFilterChange("category", value)}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Khoảng giá">
                {priceRanges.map((range) => (
                    <FilterCheckBox
                        key={range.id}
                        id={range.id}
                        name={range.name}
                        value={range.value}
                        currentValue={filters.priceRange}
                        onChange={(value) => handleFilterChange("priceRange", value)}
                    />
                ))}
            </FilterSection>

            {/* <FilterSection title="Đánh giá">
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
              
              <span className="ml-1">
                {rating.name === "5 sao" ? "" : " trở lên"}
              </span>
            </label>
          </div>
        ))}
      </FilterSection> */}
        </div>
    )
}

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

export default Filters