import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/product/ProductCard";
import SortComboBox from "../components/common/SortComboBox";
import Button from "../components/common/Button";

const ProductList = () => {
  const { category, subcategory } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex space-x-2">
          <div className=" bg-gray-200 w-75"></div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-[#0078E8]">
                  {/* Danh sách sản phẩm cho {subcategory} trong {category} */}
                  {subcategory.toLocaleUpperCase()}
                </h1>
                <div className="text-sm text-gray-600">
                  {/* Hiển thị số lượng sản phẩm tìm thấy */}
                  <strong>12</strong> sản phẩm
                </div>
              </div>
              <SortComboBox />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
              {[...Array(12)].map((_, index) => (
                <ProductCard key={index} id={index} />
              ))}
            </div>

            <div className="flex justify-center items-center mt-4  ">
              <Button variant="outline" size="small">
                Xem thêm sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductList;
