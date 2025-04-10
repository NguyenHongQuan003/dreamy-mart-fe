import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { APP_INFO } from "../../constants/app.constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={APP_INFO.LOGO} alt="DreamyMart" className="h-10 mb-4" />
            <p className="text-gray-400 mb-4">
              DreamyMart - Nơi mang đến những sản phẩm chất lượng với giá cả hợp
              lý nhất cho người tiêu dùng Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Mua sắm</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/electronics/all"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Điện tử
                </Link>
              </li>
              <li>
                <Link
                  to="/products/fashion/all"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Thời trang
                </Link>
              </li>
              <li>
                <Link
                  to="/products/home-appliances/all"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Đồ gia dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/products/books/all"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sách
                </Link>
              </li>
              <li>
                <Link
                  to="/products/beauty/all"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Làm đẹp
                </Link>
              </li>
              <li>
                <Link
                  to="/products/sports/all"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Thể thao
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/warranty"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-methods"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Phương thức thanh toán
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">0123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">support@dreamymart.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Đăng ký nhận thông tin</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none flex-1"
                />
                <button className="bg-[#0078E8] hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700 mt-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; {currentYear} {APP_INFO.NAME}. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex justify-center md:justify-end space-x-4">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Điều khoản
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
