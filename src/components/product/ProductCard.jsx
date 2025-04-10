import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getImageByProductId } from "../../services/apiFunctions";
import { APP_INFO } from "../../constants/app.constants";
import Button from "../common/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductCard = ({ product }) => {
  const [imagePreview, setImagePreview] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();

  // Giả sử rằng một số sản phẩm có thể có giảm giá
  const discount =
    product.discount || Math.random() > 0.7
      ? Math.floor(Math.random() * 30) + 10
      : 0;
  const originalPrice =
    discount > 0
      ? Math.floor(product.price * (100 / (100 - discount)))
      : product.price;

  // Tính số sao dựa trên thuộc tính rating hoặc giá trị mặc định
  const rating = product.rating || 4.5;

  // Format giá tiền với dấu phẩy ngăn cách hàng nghìn
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getImageByProductId(product.id);
        setImagePreview(response[0]?.downloadUrl);
      } catch (error) {
        console.error("Failed to fetch image", error);
      }
    };
    fetchImage();
  }, [product.id]);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Xử lý thêm vào giỏ hàng - có thể triển khai sau
    const productWithImage = {
      ...product,
      image: imagePreview || APP_INFO.NO_IAMGE_AVAILABLE,
    };
    const quantity = 1;

    dispatch(addToCart({ product: productWithImage, quantity }));
    console.log("Added to cart:", product.productName);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md z-10">
              -{discount}%
            </div>
          )}

          {/* Favorite button */}
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md z-10 transition-transform duration-300 hover:scale-110"
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-400" />
            )}
          </button>

          {/* Image container */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={imagePreview || APP_INFO.NO_IAMGE_AVAILABLE}
              alt={product.productName}
              className={`object-cover w-full h-full transition-all duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />

            {/* Quick actions on hover */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="primary"
                size="sm"
                className="!rounded-full px-3 py-2 text-sm font-medium"
                onClick={handleAddToCart}
                icon={FaShoppingCart}
              >
                Thêm vào giỏ
              </Button>
            </div>
          </div>

          {/* Product info */}
          <div className="px-3 py-3 flex-grow flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-medium line-clamp-2 min-h-[2.5rem] text-gray-800 mb-1">
                {product.productName}
              </h2>

              {/* Price */}
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold">
                    {formatPrice(product.price)} đ
                  </span>
                  {discount > 0 && (
                    <span className="text-gray-400 text-xs line-through">
                      {formatPrice(originalPrice)} đ
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Rating and sold count */}
            <div className="flex justify-between items-center text-xs mt-2 text-gray-600">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < Math.floor(rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                      size={12}
                    />
                  ))}
                </div>
                <span className="ml-1">{rating.toFixed(1)}</span>
              </div>
              <span>Đã bán {product.soldCount || "2,3K"}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    rating: PropTypes.number,
    soldCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default ProductCard;
