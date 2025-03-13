import {
  FaClock,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMap,
  FaPhone,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="flex flex-col md:flex-row md:justify-between container mx-auto">
        <div className="text-center text-sm mb-4 md:mb-0">
          <p className="mx-2 text-xl">DREAMY MART</p>
          <div className="flex items-center">
            <FaMap className="h-4 w-4 mx-2" />
            <p>Dreamy Gò Vấp: 14 Nguyễn Văn Bảo, P.4, TP HCM.</p>
          </div>
          <div className="flex items-center">
            <FaClock className="h-4 w-4 mx-2" />
            <p>Thời gian hoạt động: 9h00 - 21h00 (kể cả CN và ngày lễ)</p>
          </div>
          <div className="flex items-center">
            <FaPhone className="h-4 w-4 mx-2" /> <p>1900 63 64 76</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="h-4 w-4 mx-2" /> <p>webshop@dreamymart.vn</p>
          </div>
        </div>
        <div className="text-center text-sm mb-4 md:mb-0">
          <p className="mx-2 text-xl">DANH MỤC</p>

          <ul className="list-none">
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="#">Sản phẩm</a>
            </li>
          </ul>
        </div>
        <div className="text-center text-sm mb-4 md:mb-0">
          <p className="mx-2 text-xl">BLOG</p>
          <ul className="list-none">
            <li>
              <a href="#">Bài viết</a>
            </li>
            <li>
              <a href="#">Tin tức</a>
            </li>
          </ul>
        </div>
        <div className="text-center text-sm mb-4 md:mb-0">
          <p className="mb-2 text-xl">CONTACT US</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:underline">
              <FaFacebook className="h-6 w-6 text-white" />
            </a>
            <a href="#" className="hover:underline">
              <FaInstagram className="h-6 w-6 text-white" />
            </a>
            <a href="#" className="hover:underline">
              <FaTiktok className="h-6 w-6 text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700"></div>
      <div className="text-center text-sm mt-2">
        <p>&copy; {currentYear} DreamyMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
