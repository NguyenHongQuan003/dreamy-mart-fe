import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";

const ProductList = () => {
  const { category, subcategory } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#0078E8] mb-4">
          Danh sách sản phẩm cho {subcategory} trong {category}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Giả lập danh sách sản phẩm */}
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
              <h2 className="text-lg font-semibold mb-2">
                Sản phẩm {index + 1}
              </h2>
              <p className="text-gray-600">Mô tả ngắn gọn về sản phẩm.</p>
              <button className="mt-4 bg-[#0078E8] text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;
