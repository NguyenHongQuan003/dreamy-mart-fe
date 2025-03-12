import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

const categories = [
  {
    name: "Điện thoại",
    subcategories: ["Apple", "Samsung", "Xiaomi"],
  },
  {
    name: "Tablet",
    subcategories: ["Android", "iOS"],
  },
  {
    name: "Laptop",
    subcategories: ["Gaming", "Ultrabook", "MacBook"],
  },
  {
    name: "Thời trang",
    subcategories: ["Áo", "Quần", "Giày", "Phụ kiện"],
  },
  {
    name: "Đồng hồ",
    subcategories: ["Đồng hồ thông minh", "Đồng hồ cơ"],
  },
  { name: "Mẹ & bé", subcategories: ["Sữa", "Bỉm", "Đồ chơi"] },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubcategories = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <nav className="bg-[#F5F5F5] text-[#0078E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-0.5">
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {categories.map((category, index) => (
                <div key={category.name} className="relative group">
                  <button
                    onClick={() => toggleSubcategories(index)}
                    className="focus:shadow-[0_3px_0_0_#0078E8] focus:text-[#0078E8] px-3 py-2 text-sm font-medium flex items-center"
                  >
                    {category.name}
                    {category.subcategories && (
                      <FaChevronDown className="ml-1" />
                    )}
                  </button>
                  {openCategory === index && category.subcategories && (
                    <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-200"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {categories.map((category, index) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleSubcategories(index)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 w-full text-left"
                >
                  {category.name}
                  {category.subcategories && (
                    <FaChevronDown className="ml-1 inline" />
                  )}
                </button>
                {openCategory === index && category.subcategories && (
                  <div className="pl-4">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                        className="block px-3 py-2 text-sm hover:bg-gray-200"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
