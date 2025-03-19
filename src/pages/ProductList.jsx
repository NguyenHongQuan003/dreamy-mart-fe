import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/product/ProductCard";
import SortComboBox from "../components/common/SortComboBox";
import Button from "../components/common/Button";
import { useEffect, useState } from "react";
import { getProducts } from "../services/apiFunctions";

const ProductList = () => {
  const { category, subcategory } = useParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

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
                  <strong>{products.length}</strong> sản phẩm
                </div>
              </div>
              <SortComboBox />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
              {products.map((item, index) => (
                <ProductCard key={index} product={item} />
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
