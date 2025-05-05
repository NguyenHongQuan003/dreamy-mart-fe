import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";

function SortComboBox({ list, setList }) {
  const [selectedSort, setSelectedSort] = useState("default");

  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "price-asc", label: "Giá: Thấp đến Cao" },
    { value: "price-desc", label: "Giá: Cao đến Thấp" },
    { value: "name-asc", label: "Tên: A-Z" },
    { value: "name-desc", label: "Tên: Z-A" },
  ];

  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
    // console.log("Đã chọn:", event.target.value);

    switch (event.target.value) {
      case "price-asc":
        setList((prevList) =>
          [...prevList].sort((a, b) => a.sellingPrice - b.sellingPrice)
        );
        break;
      case "price-desc":
        setList((prevList) =>
          [...prevList].sort((a, b) => b.sellingPrice - a.sellingPrice)
        );
        break;
      case "name-asc":
        setList((prevList) =>
          [...prevList].sort((a, b) => a.name.localeCompare(b.name))
        );
        break;
      case "name-desc":
        setList((prevList) =>
          [...prevList].sort((a, b) => b.name.localeCompare(a.name))
        );
        break;
      default:
        setList(list);
    }
  };

  return (
    <div className="relative w-42">
      {/* Label */}
      <label
        htmlFor="sort"
        className="mb-2 text-sm font-semibold text-gray-800 tracking-wide hidden"
      >
        Sắp xếp theo
      </label>

      {/* Dropdown */}
      <div className="relative">
        <select
          id="sort"
          value={selectedSort}
          onChange={handleSortChange}
          className="appearance-none w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078E8] focus:border-[#0078E8] transition-all duration-200 hover:border-gray-400 cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Icon mũi tên */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaChevronDown color="#bdbdbd" />
        </div>
      </div>
    </div>
  );
}

SortComboBox.propTypes = {
  list: PropTypes.array.isRequired,
  setList: PropTypes.func.isRequired,
};

export default SortComboBox;
