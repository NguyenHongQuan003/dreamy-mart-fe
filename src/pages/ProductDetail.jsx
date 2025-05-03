import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../redux/slices/cartSlice";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/app.constants";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHome,
  FaChevronRight,
  FaHeart,
  FaShareAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { getProductById } from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productInfo, setProductInfo] = useState({});
  const [imageList, setImageList] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  // const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch product info
        const response = await getProductById(id);
        console.log("Product Info:", response);
        setProductInfo(response);
        setImageList(response.images || []);

        // const fakeRelatedProducts = [
        //   {
        //     id: 101,
        //     productName: "Sản phẩm tương tự 1",
        //     price: 249000,
        //     image: "https://via.placeholder.com/150",
        //   },
        //   {
        //     id: 102,
        //     productName: "Sản phẩm tương tự 2",
        //     price: 299000,
        //     image: "https://via.placeholder.com/150",
        //   },
        //   {
        //     id: 103,
        //     productName: "Sản phẩm tương tự 3",
        //     price: 349000,
        //     image: "https://via.placeholder.com/150",
        //   },
        //   {
        //     id: 104,
        //     productName: "Sản phẩm tương tự 4",
        //     price: 199000,
        //     image: "https://via.placeholder.com/150",
        //   },
        // ];
        // setRelatedProducts(fakeRelatedProducts);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (imageList.length > 0) {
      setImagePreview(imageList[0]?.fileUri);
    }
  }, [imageList]);

  const handleAddToCart = () => {
    dispatch(addToCartAsync({ productId: productInfo.id, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCartAsync({ productId: productInfo.id, quantity }));
    navigate("/cart");
  };

  // Hiển thị đánh giá bằng sao
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  // Hiển thị một sản phẩm liên quan
  // const RelatedProductCard = ({ product }) => (
  //   <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
  //     <Link to={`/product/${product.id}`}>
  //       <img
  //         src={product.image}
  //         alt={product.productName}
  //         className="w-full h-40 object-cover"
  //       />
  //       <div className="p-3">
  //         <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">
  //           {product.productName}
  //         </h3>
  //         <p className="text-red-600 font-bold">
  //           {product.price?.toLocaleString()} đ
  //         </p>
  //         <div className="flex items-center mt-1">
  //           {renderRatingStars(4)}
  //           <span className="text-xs text-gray-500 ml-1">(12)</span>
  //         </div>
  //       </div>
  //     </Link>
  //   </div>
  // );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="flex items-center hover:text-blue-600">
            <FaHome className="mr-1" />
            <span>Trang chủ</span>
          </Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <Link to="/category" className="hover:text-blue-600">
            Danh mục
          </Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="text-gray-700 font-medium truncate max-w-xs">
            {productInfo.name}
          </span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Gallery Section */}
            <div className="md:w-2/5">
              <div className="sticky top-20">
                <div className="relative mb-4 border border-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    {/* <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                      -15%
                    </span> */}
                    {/* <span className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded">
                      Mới
                    </span> */}
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <FaHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <FaShareAlt className="text-gray-400 hover:text-blue-500" />
                    </button>
                  </div>
                  <img
                    src={imagePreview || APP_INFO.NO_IAMGE_AVAILABLE}
                    alt={productInfo.name}
                    className="w-full h-[300px] md:h-[400px] object-contain rounded-lg"
                  />
                </div>
                {/* Thumbnails */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {imageList.map((image, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 flex-shrink-0 rounded-md cursor-pointer border-2 ${imagePreview === image.fileUri
                        ? "border-blue-500"
                        : "border-transparent"
                        } hover:border-blue-300 transition-all`}
                      onClick={() => setImagePreview(image.fileUri)}
                    >
                      <img
                        src={image.fileUri || APP_INFO.NO_IAMGE_AVAILABLE}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="md:w-3/5">
              <div className="flex items-center mb-1">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Chính hãng
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  Mã SP: {productInfo.id}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {productInfo.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {renderRatingStars(4.5)}
                  <span className="ml-2 text-sm text-gray-500">
                    4.5 (124 đánh giá)
                  </span>
                </div>
                <span className="text-sm text-gray-500">| Đã bán: 278</span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-bold text-red-600">
                    {productInfo.sellingPrice?.toLocaleString()} đ
                  </div>
                  <div className="text-lg text-gray-500 line-through">
                    {/* {((productInfo.price || 0) * 1.15).toLocaleString()} đ */}
                  </div>
                  {/* <div className="text-red-600 text-sm font-medium">-15%</div> */}
                </div>
                <p className="text-sm text-green-600 mt-1">
                  <FaBolt className="inline mr-1" />
                  Giảm thêm 5% cho đơn hàng từ 500K
                </p>
              </div>

              <div className="border-t border-b border-gray-100 py-4 mb-6">
                {/* <div className="flex items-center mb-4">
                  <span className="w-24 text-gray-600">Màu sắc:</span>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-black border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></button>
                    <button className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></button>
                    <button className="w-10 h-10 rounded-full bg-blue-600 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></button>
                  </div>
                </div> */}

                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                      onClick={() =>
                        setQuantity((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <FaMinus size={12} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      // disabled={productInfo.quantity <= 0}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(parseInt(e.target.value) || 1, productInfo.quantity)
                          )
                        )
                      }
                      className="w-14 text-center border-x border-gray-300 py-1 focus:outline-none"
                    />
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={() => setQuantity((prev) => Math.min(prev + 1, productInfo.quantity))}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <Button
                  variant="outline"
                  size="large"
                  icon={FaShoppingCart}
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  icon={FaBolt}
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <FaTruck className="text-blue-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium">Giao hàng miễn phí</p>
                    <p className="text-sm text-gray-500">
                      Cho đơn hàng từ 300K
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaShieldAlt className="text-blue-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium">Bảo hành chính hãng</p>
                    <p className="text-sm text-gray-500">
                      12 tháng tại cửa hàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaUndo className="text-blue-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium">7 ngày đổi trả</p>
                    <p className="text-sm text-gray-500">Lỗi là đổi mới</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-500 mt-1 mr-2" />
                  <div>
                    <p className="font-medium">Hỗ trợ 24/7</p>
                    <p className="text-sm text-gray-500">
                      Hotline: {APP_INFO.HOTLINE}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                className={`pb-4 font-medium text-sm border-b-2 ${activeTab === "description"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab("description")}
              >
                Mô tả sản phẩm
              </button>
              {/* <button
                className={`pb-4 font-medium text-sm border-b-2 ${activeTab === "specification"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab("specification")}
              >
                Thông số kỹ thuật
              </button> */}
              <button
                className={`pb-4 font-medium text-sm border-b-2 ${activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab("reviews")}
              >
                Đánh giá (124)
              </button>
            </nav>
          </div>

          <div>
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {productInfo.description || (
                    <p className="text-gray-500 italic">
                      Đang cập nhật mô tả sản phẩm...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* {activeTab === "specification" && (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50 w-1/3">
                        Thương hiệu
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {productInfo?.brand}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50">
                        Xuất xứ
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        Việt Nam
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50">
                        Chất liệu
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        Cao cấp
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50">
                        Kích thước
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        Tiêu chuẩn
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50">
                        Bảo hành
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        12 tháng
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )} */}

            {activeTab === "reviews" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="flex mr-4">{renderRatingStars(4.5)}</div>
                    <span className="text-xl font-bold">4.5/5</span>
                    <span className="ml-2 text-sm text-gray-500">
                      (124 đánh giá)
                    </span>
                  </div>

                  <div className="flex space-x-1">
                    <Button size="small" variant="outline" className="mr-2">
                      Tất cả
                    </Button>
                    <Button size="small" variant="outline">
                      5 Sao (98)
                    </Button>
                    <Button size="small" variant="outline">
                      4 Sao (20)
                    </Button>
                    <Button size="small" variant="outline">
                      3 Sao (4)
                    </Button>
                    <Button size="small" variant="outline">
                      2 Sao (1)
                    </Button>
                    <Button size="small" variant="outline">
                      1 Sao (1)
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          TH
                        </div>
                        <div>
                          <h4 className="font-medium">Trần Huyền</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="flex mr-2">
                              {renderRatingStars(5)}
                            </div>
                            <span>15/09/2023</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                        <FaShoppingCart className="mr-1" size={10} />
                        Đã mua hàng
                      </span>
                    </div>
                    <p className="text-gray-700">
                      Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng
                      gói cẩn thận. Mình rất hài lòng với sản phẩm này. Chắc
                      chắn sẽ ủng hộ shop dài dài.
                    </p>
                  </div>

                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold mr-3">
                          NL
                        </div>
                        <div>
                          <h4 className="font-medium">Nguyễn Linh</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="flex mr-2">
                              {renderRatingStars(4)}
                            </div>
                            <span>10/09/2023</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                        <FaShoppingCart className="mr-1" size={10} />
                        Đã mua hàng
                      </span>
                    </div>
                    <p className="text-gray-700">
                      Sản phẩm khá ổn, chất lượng tốt, giao hàng nhanh. Tuy
                      nhiên hướng dẫn sử dụng hơi khó hiểu.
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">Xem thêm đánh giá</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Sản phẩm tương tự</h2>
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <RelatedProductCard key={product.id} product={product} />
            ))}
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
