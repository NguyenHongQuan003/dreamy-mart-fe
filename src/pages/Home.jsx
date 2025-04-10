import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { APP_INFO } from "../constants/app.constants";
// import { getLatestProducts } from "../services/apiFunctions";
import { useSelector } from "react-redux";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const sliderItems = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2148&auto=format&fit=crop",
      title: "Khuyến mãi mùa hè",
      description: "Giảm giá đến 50% cho tất cả sản phẩm điện tử",
      buttonText: "Mua ngay",
      buttonLink: "/products/electronics/all",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1926&auto=format&fit=crop",
      title: "Bộ sưu tập mới",
      description: "Khám phá bộ sưu tập mới nhất của chúng tôi",
      buttonText: "Khám phá",
      buttonLink: "/products/fashion/all",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1965&auto=format&fit=crop",
      title: "Miễn phí vận chuyển",
      description: "Miễn phí vận chuyển cho đơn hàng trên 500.000đ",
      buttonText: "Tìm hiểu thêm",
      buttonLink: "/shipping-policy",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Điện thoại",
      image:
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=2784&auto=format&fit=crop",
      link: "/products/electronics/phones",
    },
    {
      id: 2,
      name: "Laptop",
      image:
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1964&auto=format&fit=crop",
      link: "/products/electronics/laptops",
    },
    {
      id: 3,
      name: "Tai nghe",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      link: "/products/electronics/headphones",
    },
    {
      id: 4,
      name: "Thời trang",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      link: "/products/fashion/all",
    },
    {
      id: 5,
      name: "Đồ gia dụng",
      image:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1887&auto=format&fit=crop",
      link: "/products/home-appliances/all",
    },
    {
      id: 6,
      name: "Sách",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1798&auto=format&fit=crop",
      link: "/products/books/all",
    },
  ];

  useEffect(() => {
    // Tự động chuyển slide
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderItems.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderItems.length]);

  useEffect(() => {
    // Lấy sản phẩm mới nhất
    const fetchLatestProducts = async () => {
      try {
        // const products = await getLatestProducts();
        const products = [
          {
            id: 1,
            productName: "Điện thoại Samsung Galaxy S21",
            price: 20990000,
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
          },
        ];

        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to fetch latest products:", error);
        // Dữ liệu mẫu nếu API lỗi
        setFeaturedProducts([
          {
            id: 1,
            productName: "Điện thoại Samsung Galaxy S21",
            price: 20990000,
            rating: 4.5,
            image:
              "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
          },
          {
            id: 2,
            productName: "Laptop Dell XPS 13",
            price: 32990000,
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1964&auto=format&fit=crop",
          },
          {
            id: 3,
            productName: "Apple AirPods Pro",
            price: 5990000,
            rating: 4.7,
            image:
              "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=2033&auto=format&fit=crop",
          },
          {
            id: 4,
            productName: "iPad Pro 2021",
            price: 23990000,
            rating: 4.9,
            image:
              "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1975&auto=format&fit=crop",
          },
          {
            id: 5,
            productName: "Xiaomi Mi Band 6",
            price: 990000,
            rating: 4.3,
            image:
              "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=1780&auto=format&fit=crop",
          },
          {
            id: 6,
            productName: 'Smart TV LG OLED 55"',
            price: 28990000,
            rating: 4.6,
            image:
              "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop",
          },
          {
            id: 7,
            productName: "Google Nest Mini",
            price: 1290000,
            rating: 4.4,
            image:
              "https://images.unsplash.com/photo-1639153904113-077cb0e6bb0b?q=80&w=1887&auto=format&fit=crop",
          },
          {
            id: 8,
            productName: "Máy ảnh Canon EOS R5",
            price: 89990000,
            rating: 4.9,
            image:
              "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop",
          },
        ]);
      }
    };

    fetchLatestProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pb-12">
        {/* Hero Slider */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          {sliderItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                currentSlide === index
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-xl text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      {item.title}
                    </h1>
                    <p className="text-xl mb-6">{item.description}</p>
                    <Link
                      to={item.buttonLink}
                      className="inline-block bg-[#0078E8] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
                    >
                      {item.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 text-gray-800 z-10"
            onClick={prevSlide}
          >
            <FaChevronLeft />
          </button>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 text-gray-800 z-10"
            onClick={nextSlide}
          >
            <FaChevronRight />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {sliderItems.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        {user && (
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Xin chào, {user.fullname}!
              </h2>
              <p className="text-gray-600 mt-2">
                Chào mừng bạn quay trở lại với DreamyMart. Khám phá những sản
                phẩm mới nhất của chúng tôi.
              </p>
            </div>
          </div>
        )}

        {/* Featured Categories */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Danh mục nổi bật
            </h2>
            <Link
              to="/categories"
              className="text-[#0078E8] hover:underline flex items-center"
            >
              Xem tất cả <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link to={category.link} key={category.id} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105">
                  <div className="h-32 md:h-40 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-gray-800">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="container mx-auto px-4 py-12 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Sản phẩm nổi bật
            </h2>
            <Link
              to="/products"
              className="text-[#0078E8] hover:underline flex items-center"
            >
              Xem tất cả <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
                  <div className="h-48 md:h-56 overflow-hidden">
                    <img
                      src={product.image || APP_INFO.NO_IAMGE_AVAILABLE}
                      alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.productName}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        <FaStar />
                        <span className="ml-1 text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#FF3B30] font-bold text-lg">
                      {product.price.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Promotion Banner */}
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Tiết kiệm lớn trong tháng này!
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Giảm tới 30% cho các sản phẩm công nghệ. Ưu đãi có hạn, nhanh
                  tay kẻo lỡ!
                </p>
                <Link
                  to="/promotions"
                  className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-md transition duration-300 hover:bg-blue-50 self-start"
                >
                  Xem ưu đãi
                </Link>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1594968973184-9040a5a79963?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Promotion"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="container mx-auto px-4 py-12 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Tại sao chọn DreamyMart?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm tốt nhất
              với nhiều ưu đãi hấp dẫn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-3a1 1 0 00-.293-.707l-2-2A1 1 0 0012 8h-1V5a1 1 0 00-1-1H3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Giao hàng miễn phí</h3>
              <p className="text-gray-600">
                Miễn phí giao hàng cho đơn hàng từ 500.000đ trên toàn quốc.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hoàn trả dễ dàng</h3>
              <p className="text-gray-600">
                Chính sách hoàn trả trong vòng 30 ngày cho tất cả sản phẩm.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
              <p className="text-gray-600">
                Nhiều phương thức thanh toán an toàn, bảo mật cao.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
