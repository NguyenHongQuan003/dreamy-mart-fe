import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getImageByProductId } from "../../services/apiFunctions";

const ProductCard = ({ product }) => {
  const [imagePreview, setImagePreview] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getImageByProductId(product.id);
        setImagePreview(response);
      } catch (error) {
        console.error("Failed to fetch image", error);
      }
    };
    fetchImage();
  }, [product.id]);

  return (
    <>
      <Link to={`/products/${product.id}`}>
        <div className="bg-white rounded-xs shadow-2xl group">
          <div className="h-48 rounded-t-xs mb-2 p-0.5">
            <img
              src={imagePreview}
              alt={product.productName}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="px-2 space-y-2">
            <h2 className="line-clamp-2 h-[3em] overflow-hidden text-ellipsis whitespace-normal break-words">
              {product.productName}
            </h2>
            <h2 className="text-[#FF3B30] font-bold text-right">
              {product.price} đ
            </h2>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center">
                <FaStar color="#FFB921" /> 4.0
              </div>
              Đã bán 2,3K
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
