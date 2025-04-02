import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaLaptop,
  FaTshirt,
  FaHome,
  FaBook,
  FaHeartbeat,
  FaBabyCarriage,
  FaCar,
  FaDog,
} from "react-icons/fa";

const categoryData = [
  {
    id: 1,
    name: "Điện tử",
    icon: <FaLaptop />,
    link: "/products/electronics/all",
    subcategories: [
      { id: 101, name: "Điện thoại", link: "/products/electronics/phones" },
      { id: 102, name: "Laptop", link: "/products/electronics/laptops" },
      { id: 103, name: "Máy tính bảng", link: "/products/electronics/tablets" },
      { id: 104, name: "Phụ kiện", link: "/products/electronics/accessories" },
      {
        id: 105,
        name: "Thiết bị thông minh",
        link: "/products/electronics/smart-devices",
      },
    ],
  },
  {
    id: 2,
    name: "Thời trang",
    icon: <FaTshirt />,
    link: "/products/fashion/all",
    subcategories: [
      { id: 201, name: "Nam", link: "/products/fashion/men" },
      { id: 202, name: "Nữ", link: "/products/fashion/women" },
      { id: 203, name: "Trẻ em", link: "/products/fashion/kids" },
      { id: 204, name: "Phụ kiện", link: "/products/fashion/accessories" },
    ],
  },
  {
    id: 3,
    name: "Đồ gia dụng",
    icon: <FaHome />,
    link: "/products/home-appliances/all",
    subcategories: [
      { id: 301, name: "Nhà bếp", link: "/products/home-appliances/kitchen" },
      { id: 302, name: "Phòng ngủ", link: "/products/home-appliances/bedroom" },
      {
        id: 303,
        name: "Phòng tắm",
        link: "/products/home-appliances/bathroom",
      },
      {
        id: 304,
        name: "Nội thất",
        link: "/products/home-appliances/furniture",
      },
    ],
  },
  {
    id: 4,
    name: "Sách",
    icon: <FaBook />,
    link: "/products/books/all",
    subcategories: [
      { id: 401, name: "Sách giáo khoa", link: "/products/books/textbooks" },
      { id: 402, name: "Tiểu thuyết", link: "/products/books/novels" },
      { id: 403, name: "Sách kinh doanh", link: "/products/books/business" },
      { id: 404, name: "Sách thiếu nhi", link: "/products/books/children" },
    ],
  },
  {
    id: 5,
    name: "Làm đẹp",
    icon: <FaHeartbeat />,
    link: "/products/beauty/all",
    subcategories: [
      { id: 501, name: "Chăm sóc da", link: "/products/beauty/skincare" },
      { id: 502, name: "Trang điểm", link: "/products/beauty/makeup" },
      { id: 503, name: "Chăm sóc tóc", link: "/products/beauty/haircare" },
      { id: 504, name: "Nước hoa", link: "/products/beauty/perfume" },
    ],
  },
  {
    id: 6,
    name: "Mẹ & Bé",
    icon: <FaBabyCarriage />,
    link: "/products/mother-baby/all",
    subcategories: [
      { id: 601, name: "Đồ cho mẹ", link: "/products/mother-baby/mother" },
      { id: 602, name: "Đồ cho bé", link: "/products/mother-baby/baby" },
      { id: 603, name: "Đồ chơi", link: "/products/mother-baby/toys" },
      { id: 604, name: "Dinh dưỡng", link: "/products/mother-baby/nutrition" },
    ],
  },
  {
    id: 7,
    name: "Ô tô & Xe máy",
    icon: <FaCar />,
    link: "/products/vehicles/all",
    subcategories: [
      { id: 701, name: "Phụ tùng ô tô", link: "/products/vehicles/car-parts" },
      {
        id: 702,
        name: "Phụ tùng xe máy",
        link: "/products/vehicles/motorcycle-parts",
      },
      { id: 703, name: "Chăm sóc xe", link: "/products/vehicles/care" },
      { id: 704, name: "Phụ kiện", link: "/products/vehicles/accessories" },
    ],
  },
  {
    id: 8,
    name: "Thú cưng",
    icon: <FaDog />,
    link: "/products/pets/all",
    subcategories: [
      { id: 801, name: "Thức ăn cho chó", link: "/products/pets/dog-food" },
      { id: 802, name: "Thức ăn cho mèo", link: "/products/pets/cat-food" },
      { id: 803, name: "Phụ kiện", link: "/products/pets/accessories" },
      { id: 804, name: "Chăm sóc thú cưng", link: "/products/pets/care" },
    ],
  },
];

const Navbar = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Xử lý khi hover vào danh mục trên desktop
  const handleMouseEnter = (categoryId) => {
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  // Xử lý khi click vào danh mục trên mobile
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto">
        {/* Desktop Menu */}
        <div className="hidden md:block">
          <ul className="flex">
            {categoryData.map((category) => (
              <li
                key={category.id}
                className="group relative"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={category.link}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-[#0078E8] hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  {category.subcategories && (
                    <FaChevronDown className="ml-1 text-xs" />
                  )}
                </Link>

                {/* Dropdown for subcategories */}
                {category.subcategories && hoveredCategory === category.id && (
                  <div className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-b-md z-10 animate-fadeIn">
                    <ul className="py-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id}>
                          <Link
                            to={subcategory.link}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0078E8]"
                          >
                            <span className="flex items-center">
                              <FaChevronRight className="mr-2 text-xs" />
                              {subcategory.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <ul className="divide-y divide-gray-200">
            {categoryData.map((category) => (
              <li key={category.id}>
                <div
                  className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <Link
                    to={category.link}
                    className="flex items-center text-gray-700"
                    onClick={(e) => {
                      if (category.subcategories) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Link>
                  {category.subcategories && (
                    <FaChevronDown
                      className={`text-gray-500 transition-transform duration-200 ${
                        expandedCategory === category.id
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  )}
                </div>

                {/* Subcategories */}
                {category.subcategories && expandedCategory === category.id && (
                  <ul className="bg-gray-50 py-2">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link
                          to={subcategory.link}
                          className="block pl-10 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
