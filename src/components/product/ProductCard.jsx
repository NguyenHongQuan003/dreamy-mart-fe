import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ id }) => {
  return (
    <>
      <Link to={`/products/${id}`}>
        <div className="bg-white rounded-xs shadow-2xl group">
          <div className="h-48 rounded-t-xs mb-2 p-0.5">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Product"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="px-2 space-y-2">
            <h2 className="line-clamp-2 h-[3em] overflow-hidden text-ellipsis whitespace-normal break-words">
              Sản phẩm {id + 1}
            </h2>
            <h2 className="text-[#FF3B30] font-bold text-right">1.000.000 đ</h2>
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

export default ProductCard;
