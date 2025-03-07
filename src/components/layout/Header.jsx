import { Link } from "react-router-dom";
import { APP_INFO, BANNER } from "../../constants/common.constants";
import { FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";

const Header = () => {
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
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={APP_INFO.LOGO}
                alt={APP_INFO.NAME}
                className="h-12 w-auto"
              />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
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

            {/* Auth & Cart */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="flex items-center">
                <div className="relative p-3 hover:cursor-pointer rounded-full bg-white">
                  <FaShoppingBag className="text-[#0078E8]" />
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </div>
                <span className="text-white ml-1">Giỏ hàng</span>
              </Link>

              {/* Login/Register */}
              <Link to="/login" className="flex items-center">
                <div className="p-3 hover:cursor-pointer rounded-full bg-white">
                  <FaUser className="text-[#0078E8]" />
                </div>
                <span className="text-white ml-1">Đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
