import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { APP_INFO, BANNER } from "../../constants/common.constants";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Sale Banner */}
      <div className="w-full">
        <img
          src={BANNER.SALE_BANNER}
          alt="Sale Banner"
          className="w-full h-auto"
        />
      </div>

      {/* Main Header */}
      <div className="w-full bg-[#0078E8] shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={APP_INFO.LOGO}
                alt={APP_INFO.NAME}
                className="h-8 md:h-12 w-auto"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pr-15 border-2 border-gray-500 rounded-full py-3 px-4 bg-white focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0078E8] rounded-full p-3 hover:cursor-pointer">
                  <FaSearch className="text-white" />
                </button>
              </div>
            </div>

            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FaSearch className="h-6 w-6" />
            </button>

            {/* Auth & Cart */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="flex items-center">
                <div className="relative p-3 hover:cursor-pointer rounded-full bg-white">
                  <FaShoppingBag className="text-[#0078E8] h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </div>
                <span className="hidden md:block text-white ml-1">
                  Giỏ hàng
                </span>
              </Link>

              {/* Login/Register */}
              <Link to="/login" className="flex items-center">
                <div className="p-3 hover:cursor-pointer rounded-full bg-white">
                  <FaUser className="text-[#0078E8] h-5 w-5" />
                </div>
                <span className="hidden md:block text-white ml-1">
                  Đăng nhập
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden mt-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pr-15 border-2 border-gray-500 rounded-full py-3 px-4 bg-white focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0078E8] rounded-full p-3 hover:cursor-pointer">
                  <FaSearch className="text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 bg-white rounded-lg p-4 space-y-4">
              <Link
                to="/categories"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Danh mục
              </Link>
              <Link
                to="/promotions"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Khuyến mãi
              </Link>
              <Link
                to="/new-products"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Sản phẩm mới
              </Link>
              <Link
                to="/best-sellers"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Bán chạy
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
