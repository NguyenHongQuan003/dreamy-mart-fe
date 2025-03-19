import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getImageByProductId, getProductById } from "../services/apiFunctions";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/common.constants";
import { FaMinus, FaPlus } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState({});
  const [imageList, setImageList] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await getProductById(id);
        setProductInfo(response[0]);
      } catch (error) {
        console.error("Failed to fetch product info", error);
      }
    };

    fetchProductInfo();
    const fetchImage = async () => {
      try {
        const response = await getImageByProductId(id);
        setImageList(response);
      } catch (error) {
        console.error("Failed to fetch image", error);
      }
    };
    fetchImage();
  }, [id]);

  useEffect(() => {
    setImagePreview(imageList[0]?.downloadUrl);
  }, [imageList]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-around">
          <div className="flex">
            {/* imagePreview */}
            <div className="w-100 h-100">
              <img
                src={imagePreview || APP_INFO.NO_IAMGE_AVAILABLE}
                alt={productInfo.productName}
                className="object-cover w-full h-full rounded-md mb-2"
              />
            </div>
            {/* imageList */}
            <div className="space-y-1 ml-2">
              {imageList.map((image) => (
                <img
                  key={image.id}
                  src={image.downloadUrl}
                  alt={productInfo.productName}
                  className={`w-15 h-15 rounded-md cursor-pointer ${
                    imagePreview === image.downloadUrl
                      ? "border-2 border-red-600"
                      : ""
                  }`}
                  onClick={() => setImagePreview(image.downloadUrl)}
                />
              ))}
            </div>
          </div>
          {/* productInfo */}
          <div className="flex-grow ml-8">
            <h1 className="text-xl text-[#0078E8] mb-4">
              {productInfo.productName}
            </h1>
            <div className="mb-4">
              Giá:
              <strong className="text-2xl text-[#FF3B30] ml-20">
                {productInfo.price} đ
              </strong>
            </div>
            <div className="flex items-center">
              Số lượng:
              <div className="ml-8">
                <Button
                  size="mini"
                  variant="secondary"
                  icon={FaMinus}
                  onClick={() => {
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                />
                <span className="mx-4 text-xl">{quantity}</span>
                <Button
                  size="mini"
                  variant="secondary"
                  icon={FaPlus}
                  onClick={() => setQuantity(quantity + 1)}
                />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <Button variant="outline">Thêm vào giỏ hàng</Button>
              <Link to="/cart" className="ml-auto w-1/2">
                <Button variant="primary" fullWidth>
                  Mua ngay
                </Button>
              </Link>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md mt-6">
              <h2 className="p-2 border-b border-gray-200 text-[#0078E8]">
                Mô tả sản phẩm
              </h2>
              <p className="p-4 text-sm max-h-40 overflow-y-auto">
                {productInfo.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
